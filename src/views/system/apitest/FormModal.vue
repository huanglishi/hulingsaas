<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :width="620">
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
            <a-select-option v-for="item in grouplist"  :value="item['id']+''"><span v-html="item['name_txt']"></span></a-select-option>
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
  import { getFormGroupList } from '/@/api/system/apitestgroup';
  import { saveData } from '/@/api/system/apitest';
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
          });
        }
        getGroupList("")
      });
      //搜索分组
      function searchGroup(val) {
          getGroupList(val)
      }
      //获取分组数据
      async function getGroupList(keyword){
        let treeData= await getFormGroupList({keyword:keyword})
        if(!treeData) treeData=[]
        grouplist.value = treeData
      }
      const getTitle = computed(() => (!unref(isUpdate) ? '新增接口' : '编辑接口'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if(unref(isUpdate)){//更新
            values.id=rowId.value
          }
          try {
            createMessage.loading({ content: '提交中...', key:"saveGroup",duration:0});
            const resultdata = await saveData(values);
            closeModal();
            if(resultdata){
              createMessage.success({ content: '提交成功！', key:"saveGroup", duration: 2 });
              emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
            }else if(resultdata==0){
              createMessage.success({ content: '已提交！', key:"saveGroup", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveGroup");
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit,searchGroup,grouplist};
    },
  });
</script>
