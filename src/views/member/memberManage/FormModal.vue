<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" >
    <div class="oldformbox">
      <BasicForm @register="registerForm" >
        <template #cid="{model, field}">
            <a-select
                  v-model:value="model[field]"
                  show-search
                  allowClear
                  placeholder="选择分组"
                  style="width: 100%"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="searchGroup"
                >
                <a-select-option v-for="item in grouplist"  :value="item['id']+''"><span v-html="item['name']"></span></a-select-option>
              </a-select>
          </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Select} from 'ant-design-vue';
  import { formSchema } from './data';
  //API
  import { saveMember } from '/@/api/member/manage';
  import { getGroupList } from '/@/api/member/group';
  export default defineComponent({
    name: 'FormModal',
    components: { BasicModal, BasicForm, ASelect:Select,ASelectOption:Select.Option  },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const grouplist = ref([]);
      const {createMessage,} = useMessage();
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
            cid:data.record.cid+''
          });
        }
        getFormGroupList("")
      });
       //搜索分组
       function searchGroup(val) {
        getFormGroupList(val)
      }
      //获取分组数据
      async function getFormGroupList(keyword){
        let treeData= await getGroupList({keyword:keyword})
        if(!treeData) treeData=[]
        let parntList : any=[{id: 0,name: "--无--"}];
        grouplist.value = parntList.concat(treeData)
      }
      const getTitle = computed(() => (!unref(isUpdate) ? '新增会员信息' : '编辑会员信息'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if(unref(isUpdate)){//更新
            values.id=rowId.value
          }
          try {
            createMessage.loading({ content: '提交中...', key:"saveMember",duration:0});
            const resultdata = await saveMember(values);
            closeModal();
            if(resultdata){
              createMessage.success({ content: '提交成功！', key:"saveMember", duration: 2 });
              emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
            }else if(resultdata==0){
              createMessage.success({ content: '已提交！', key:"saveMember", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveMember");
          }
         
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      return { registerModal,searchGroup, registerForm, getTitle, handleSubmit,grouplist};
    },
  });
</script>
