<template>
  <BasicModal 
  v-bind="$attrs" 
  @register="registerModal" 
  title="提交需求" 
  @ok="handleSubmit" 
  width="920px" 
  :minHeight="550"
  >
    <div class="oldformbox">
    <BasicForm @register="registerForm" >
      </BasicForm>
      </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,  unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { formSchema } from './data';
  //API
  import { saveData } from '/@/api/common/customtpl';
  export default defineComponent({
    name: 'addTplModal',
    components: { BasicModal, BasicForm},
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const grouplist = ref([]);
      const {createMessage,createSuccessModal} = useMessage();
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
      });
      //提交数据
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if(unref(isUpdate)){//更新
            values.id=rowId.value
          }
          try {
            createMessage.loading({ content: '提交中...', key:"saveData",duration:0});
            const resultdata = await saveData(values);
            closeModal();
            if(resultdata){
              createMessage.success({ content: '提交成功！', key:"saveData", duration: 1 });
              createSuccessModal({ title: '提交成功', content: resultdata.message });
              emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
            }else if(resultdata.code==0){
              createMessage.success({ content: '已提交！', key:"saveData", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveData");
          }
         
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { 
         registerModal, 
         registerForm,
         handleSubmit,
         grouplist
        };
    },
  });
</script>
<style lang="less" scoped>
:deep(.tox-tbtn__select-label){
  width: auto;
}
:deep(.tox .tox-toolbar){
  border-top:0px;
}
</style>
