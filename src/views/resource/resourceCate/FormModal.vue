<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" >
     <div class="filebox">
        <BasicForm @register="registerForm" >
        <template #pid="{model, field}">
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
              <a-select-option v-for="item in grouplist" :value="item.id+''"><span v-html="item.title_txt"></span></a-select-option>
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
  import { formSchema,CateItem } from './data';
  //API
  import { getParentList,saveFile } from '/@/api/resource/cate';
  export default defineComponent({
    name: 'FormModal',
    components: { BasicModal, BasicForm, ASelect:Select,ASelectOption:Select.Option  },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const grouplist = ref<CateItem[]>([]);
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
            pid:data.record.pid+''
          });
          getGroupList("")
        }
      });
      //搜索分组
      function searchGroup(val) {
          getGroupList(val)
      }
      //获取分组数据
      async function getGroupList(keyword){
        let treeData= await getParentList({keyword:keyword})
        if(!treeData) treeData=[]
        let parntList : any=[{id:0,title_txt: "--无--",pid: 0}];
        grouplist.value = parntList.concat(treeData)
      }
      const getTitle = computed(() => (!unref(isUpdate) ? '新增分类' : '编辑分类'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if(unref(isUpdate)){//更新
            values.id=rowId.value
          }
          values.type=1//文件夹
          try {
            createMessage.loading({ content: '提交中...', key:"saveFile",duration:0});
            const resultdata = await saveFile(values);
            closeModal();
            if(resultdata){
              createMessage.success({ content: '提交成功！', key:"saveFile", duration: 2 });
              emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
            }else if(resultdata==0){
              createMessage.success({ content: '已提交！', key:"saveFile", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveFile");
          }
         
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit,searchGroup,grouplist};
    },
  });
</script>
<style lang="less" scoped>
.filebox{
  padding: 10px;
}
</style>
