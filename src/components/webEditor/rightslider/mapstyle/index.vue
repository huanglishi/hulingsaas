<template>
  <div class="mapstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>
     <!-- 提示 -->
    <p style="color: #969799; font-size: 12px; margin-top: 10px">
      选择定位地址，或者直接输入
    </p>
    <!-- 上传图片 -->
    <el-button @click="showUpload" style="width: 100%;" type="primary" plain>选择地址</el-button>
    <div class="bor"></div>
    <el-form label-width="70px" :rules="rules" :model="datas" class="lef">
      <el-form-item label="位置名称" :hide-required-asterisk="true">
        <el-input
          v-model="datas.name"
          placeholder="请输入位置名称"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="经纬度" :hide-required-asterisk="true">
         <div class="towline">
          <div class="one">
            <el-input
                v-model="datas.lat"
                placeholder="纬度"
                show-word-limit
              />
          </div>
          <div class="tow">
             <el-input
                v-model="datas.lng"
                placeholder="经度"
                show-word-limit
              />
          </div>
         </div>
      </el-form-item>
       <el-form-item label="缩放级别">
         <el-slider
          v-model="datas.zoom"
          :max="20"
          :min="3"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>
      <el-form-item class="lef" label="是否可以拖拽" label-width="100px">
        <el-switch
            v-model="datas.draggable"
            active-color="#13ce66"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        <!-- {{ datas.draggable ? '是' : '否' }}
        <el-checkbox style="margin-left: 196px" v-model="datas.draggable" /> -->
      </el-form-item>
    </el-form>
     <!-- 位置 -->
   <locPicker ref="locpicker" @mapInformation="mapInformation" />
  </div>
</template>

<script>
import { ElColorPicker,ElForm,ElFormItem,ElInput,ElButton,ElSlider,ElSwitch} from 'element-plus'
import locPicker from './locpicker.vue' //地图选点
export default {
  name: 'mapstyle',
  props: {
    datas: Object,
  },
  components: { 
    ElColorPicker,ElForm,ElFormItem,ElInput,ElButton,ElSlider,locPicker,ElSwitch
  },
  data() {
    return {
        rules: {
          //校验表单输入
          name: [
            //页面名称
            { required: true, message: '请输入位置名称', trigger: 'blur' },
          ],
          lat: [
            //页面名称
            { required: true, message: '请输入纬度', trigger: 'blur' },
          ],
          lng: [
            //页面名称
            { required: true, message: '请输入经度', trigger: 'blur' },
          ],
        },
    }
  },
  created() {},
  methods: {
    //显示选择位置
    showUpload() {
      this.$refs.locpicker.showUpload()
    },
     // 选择位置回调
     mapInformation(res) {
       if(res&& res.poiname){
           this.datas.name = res.poiname
          this.datas.lat = res.latlng.lat
          this.datas.lng = res.latlng.lng
       }
    },
  },
}
</script>

<style scoped lang="less">
.mapstyle {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px 20px;
  box-sizing: border-box;
  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }

  /* 刷新 */
  .link {
    display: inline-block;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    cursor: pointer;
    color: #155bd4;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.towline{
  display: flex;
  .one{
    flex:1;
  }
  .tow{
    flex:1;
  }
}
</style>
