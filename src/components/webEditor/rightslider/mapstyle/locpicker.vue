
<template>
  <div class="locpicker">
     <a-modal v-model:visible="dialogVisible" title="地图选点" :footer="null" width="375px" :maskClosable="false"  class="locpicker">
     <iframe id="mapPage" width="100%" height="100%" frameborder=0
      class="screen"
      src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=GENBZ-G5S3J-7OLFW-FLBX4-WVEMK-SOBL4&referer=myapp&coord=24.881453,102.8335863"
       ></iframe>
  </a-modal>
  </div>
</template>

<script>
import { Modal} from 'ant-design-vue';
import { reactive,toRefs} from 'vue'
export default {
  name: 'locpicker',
  emits: ['mapInformation'],
  components:{AModal:Modal},
  setup(props, ctx) {
    // 数据集合
    const pldatas = reactive({
      dialogVisible: false, //弹框默认隐藏
    })

    // 事件集合
    const methods = {
      /* 显示上传文件组件 */
      showUpload() {
        pldatas.dialogVisible = true
      },
    }
    // 加载完成事件
    const load = () => {
      document.querySelector('iframe').contentWindow.postMessage(props.val, "https://apis.map.qq.com");
    }
      window.addEventListener('message', function(event) {
          pldatas.dialogVisible = false
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          var loc = event.data;
          if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
              //{
              //    module:'locationPicker',
              //    latlng: {
              //    lat: 39.998766,
              //        lng: 116.273938
              //    },
              //    poiaddress: "北京市海淀区新建宫门路19号",
              //    poiname: "颐和园",
              //    cityname: "北京市"
              //}
               ctx.emit('mapInformation',loc)
          }
      }, false);
    //分组管理
    return {
        ...toRefs(pldatas),
        ...methods,
        load,
    }
  },
}
</script>

<style lang="less" scoped>
.locpicke .ant-modal-close{
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
</style>
