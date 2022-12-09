<template>
  <BasicModal 
  v-bind="$attrs" 
  @register="registerModal" 
  title="阅读文章" 
  width="920px" 
  :minHeight="550"
  >
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,  unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // import { useMessage } from '/@/hooks/web/useMessage';
  //API
  import { getArticle } from '/@/api/home/base';
  export default defineComponent({
    name: 'ViewArticleModal',
    components: { BasicModal},
    emits: ['success', 'register'],
    setup( ) {
      const isUpdate = ref(true);
      const rowId = ref('');
      const grouplist = ref([]);
      // const {createMessage,createSuccessModal} = useMessage();

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          const bigdata = await getArticle({id:data.record.id});
          if(bigdata){
          
          }
        }
      });
      //提交数据

      return { 
         registerModal, 
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
