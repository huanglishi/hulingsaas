<template>
  <div class="videostyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>
     <!-- 提示 -->
    <p style="color: #969799; font-size: 12px; margin-top: 10px">
      视频可选择本地上传或使用其他存放位置的视频连接输入链接地址即可
    </p>
    <!-- 上传图片 -->
    <el-button @click="showUpload" style="width: 100%;" type="primary" plain
      >点击添加视频</el-button
    >
    <div class="bor"></div>
    <el-form label-width="70px" :model="datas" class="lef">
      <el-form-item label="封面链接">
        <el-input
          v-model="datas.coverUrl"
          placeholder="请输入封面链接"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="视频链接">
        <el-input
          v-model="datas.src"
          placeholder="请输入视频链接"
          show-word-limit
        />
      </el-form-item>
      <!-- 是否自动播放 -->
      <el-form-item class="lef" label="是否自动播放" label-width="100px">
        <el-switch
          v-model="datas.autoplay"
          active-color="#13ce66"
          active-text="是"
          inactive-text="否"
          :active-value="true"
          :inactive-value="false">
        </el-switch>
        <!-- {{ datas.autoplay ? '是' : '否' }} -->
        <!-- <el-checkbox style="margin-left: 196px" v-model="datas.autoplay" /> -->
      </el-form-item>
    </el-form>
     <!-- 上传视频 -->
   <uploadVideo ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>

<script>
import { ElColorPicker,ElForm,ElFormItem,ElInput,ElButton,ElSwitch} from 'element-plus'
import uploadVideo from '../../uploadVideo/index.vue' //图片上传
export default {
  name: 'videostyle',
  props: {
    datas: Object,
  },
  components: {uploadVideo,
    ElColorPicker,ElForm,ElFormItem,ElInput,ElButton,ElSwitch
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    //显示视频
    showUpload() {
      this.$refs.upload.showUpload()
    },
     // 选择视频回调
     uploadInformation(res) {
      this.datas.coverUrl = res.cover_url
      this.datas.src = res.url
    },
  },
}
</script>

<style scoped lang="less">
.videostyle {
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
</style>
