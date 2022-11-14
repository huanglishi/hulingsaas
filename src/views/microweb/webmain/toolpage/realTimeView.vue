<template>
  <a-modal v-model:visible="datas.show" :footer="null" width="380px" :maskClosable="false" class="RealTimeView" style=" height: 667px ;">
    <img src="../../../../assets/webeditor/phoneTop.png" style="width: 380px;" />
   <div   class="iframebox">
    <iframe
      v-if="datas.show"
      ref="iframe"
      class="screen"
      src="https://tuwen.hulingyun.cn/webmin/#/web?type=iframe"
      @load="load"
    ></iframe>
    <div class="loading" v-if="loading">
      <van-loading  size="24px" vertical>加载中</van-loading>
    </div>
   </div>
  </a-modal>
</template>

<script>
import { ref  } from 'vue';
//design组件
import { Modal } from 'ant-design-vue';
export default {
  name: 'RealTimeView',
  components: {AModal:Modal },
  props: {
    datas: {
      show: false,
    },
    val:Object
  },
  setup(props) {
    // 是否在加载中
    const loading = ref(true)
    // 加载完成事件
    const load = () => {
      loading.value = false
      setTimeout(()=>{
          document.querySelector('iframe').contentWindow.postMessage(props.val, "https://tuwen.hulingyun.cn");
      }, 600);
    }
    return{
      loading,
      load
    }
  }
}
</script>

<style lang="less" >
.RealTimeView .ant-modal-close{
      position: absolute;
      top: -32px;
      right: -32px;
      background: #fff;
      width: 35px;
      height: 35px;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
}
.iframebox{
  overflow: hidden;
}
 .screen {
    width: 380px ;
    height: 667px ;
    border: 0;
    overflow:scroll;
    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
      width:0px;
    }
  }
  .loading{
    width: 380px /*no*/;
    height: 667px /*no*/;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
