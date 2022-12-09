<template>
  <BasicModal 
  v-bind="$attrs" 
  @register="registerModal" 
  @ok="handleSubmit" 
  title="阅读文章" 
  width="920px" 
  :minHeight="550"
  :showCancelBtn="false"
  okText="关闭"
  >
   <div class="readarticle">
     <div class="title">
       {{pagedata.title}}
     </div>
     <div class="content_box">
       <div class="content_veiw" v-bind:innerHTML="pagedata.content">
       </div>
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
    name: 'ViewArticleModal',
    components: { BasicModal},
    emits: ['success', 'register'],
    setup( ) {
      const pagedata = ref({title:"",content:""});
      // const {createMessage,createSuccessModal} = useMessage();
      const [registerModal, { setModalProps ,closeModal}] = useModalInner(async (data) => {
        console.log("日志：",data)
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
 .readarticle{
  padding: 15px;
  .title{
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
  .content_box{
    margin-top: 15px;
    .content_veiw{

    }
  }
 }
</style>
