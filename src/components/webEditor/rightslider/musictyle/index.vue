<template>
  <div class="musicstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>
     <!-- 提示 -->
    <p style="color: #969799; font-size: 12px; margin-top: 10px">
      音乐可选择本地上传或使用其他存放位置的音乐连接输入链接地址即可
    </p>
    <!-- 上传图片 -->
    <el-button @click="showUpload" style="width: 100%;" type="primary" plain>点击添加音乐</el-button>
    <div class="bor"></div>
    <el-form label-width="85px" :model="datas" class="lef">
      <el-form-item label="音乐名称">
        <el-input
          v-model="datas.title"
          placeholder="请输入音乐名称"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="作者">
        <el-input
          v-model="datas.author"
          placeholder="请输入作者"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="音乐链接">
        <el-input
          v-model="datas.src"
          placeholder="请输入音乐链接"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="封面链接">
        <el-input
          v-model="datas.coverUrl"
          placeholder="请输入封面链接"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="歌词">
        <el-input
          type="textarea"
          v-model="datas.lrc"
          placeholder="请输入歌词"
          :rows="3"
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
      </el-form-item>
      <el-form-item class="lef" label="循环播放" label-width="100px">
        <el-switch
            v-model="datas.loop"
            active-color="#13ce66"
            active-text="是"
            inactive-text="否"
            active-value="all"
            inactive-value="none">
          </el-switch>
      </el-form-item>
      <el-form-item label="音量" class="lef borrediu">
          <el-slider
            v-model="datas.volume"
            :min="0"
            :max="1"
            :step="0.1"
            input-size="small"
            show-input
          >
          </el-slider>
      </el-form-item>
      <div class="bor"></div>
       <!-- 背景颜色 -->
       <el-form-item class="lef" label="背景颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.backgroundColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>
       <!-- 边框线尺寸 -->
       <el-form-item label="边框线尺寸" class="lef borrediu">
        <el-slider
          v-model="datas.border"
          :max="50"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>
       <!-- 边框颜色 -->
       <el-form-item class="lef" label="边框线颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.borderColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>
      <!-- 边框圆角 -->
      <el-form-item label="边框圆角" class="lef borrediu">
          <el-slider
            v-model="datas.borderRadius"
            :max="50"
            input-size="small"
            show-input
          >
          </el-slider>
      </el-form-item>
      <el-form-item label="边距" class="lef borrediu">
          <el-slider
            v-model="datas.margin"
            :max="50"
            input-size="small"
            show-input
          >
          </el-slider>
      </el-form-item>
    </el-form>
     <!-- 上传音乐 -->
   <uploadMusic ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>

<script>
import { ElColorPicker,ElForm,ElFormItem,ElInput,ElButton,ElSlider,ElSwitch} from 'element-plus'
import uploadMusic from '../../uploadMusic/index.vue' //音乐上传
export default {
  name: 'musicstyle',
  props: {
    datas: Object,
  },
  components: { uploadMusic,
    ElColorPicker,ElForm,ElFormItem,ElInput,ElButton,ElSlider,ElSwitch
  },
  data() {
    return {
      predefineColors: [
        // 颜色选择器预设
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        '#409EFF',
        '#909399',
        '#C0C4CC',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
      ],
    }
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
      this.datas.title = res.title
    },
  },
}
</script>

<style scoped lang="less">
.musicstyle {
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
