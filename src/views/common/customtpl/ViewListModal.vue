<template>
  <BasicModal 
  v-bind="$attrs" 
  @register="registerModal" 
  @ok="handleSubmit" 
  title="申请模板列表" 
  width="920px" 
  :minHeight="590"
  :showCancelBtn="false"
  :showOkBtn="false"
  >
   <div class="customtpl">
     <div class="left">
     </div>
     <div class="right">
     </div>
   </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // import { useMessage } from '/@/hooks/web/useMessage';
  //API
  import { getArticle } from '/@/api/home/base';
  export default defineComponent({
    name: 'ViewListModal',
    components: { BasicModal},
    emits: ['success', 'register'],
    setup( ) {
      const pagedata = ref({title:"",content:""});
      // const {createMessage,createSuccessModal} = useMessage();
      const [registerModal, { setModalProps ,closeModal}] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        pagedata.value = await getArticle({id:data.id});
      });
      function handleSubmit(){
        closeModal();
      }
      return { 
         registerModal, 
         handleSubmit,
         pagedata
        };
    },
  });
</script>
<style lang="less" scoped>
 .customtpl{
  display: flex;
  .lest{
    flex: 1;
  }
  .right{
    flex: 1;
  }
 }
</style>
