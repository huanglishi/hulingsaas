<template>
  <div class="richtextstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>
    <el-form label-width="90px" :model="datas">
      <!-- 背景颜色 -->
      <el-form-item label="背景颜色" class="lef">
        <!-- 背景颜色 -->
        <el-color-picker
          v-model="datas.backColor"
          show-alpha
          style="float: right"
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>
       <!-- 边框线尺寸 -->
       <el-form-item label="边框线尺寸" class="lef ">
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
      <el-form-item label="边框圆角" class="lef ">
          <el-slider
            v-model="datas.borderRadius"
            :max="50"
            input-size="small"
            show-input
          >
          </el-slider>
      </el-form-item>
      <el-form-item label="外边距" class="lef ">
          <el-slider
            v-model="datas.margin"
            :max="80"
            input-size="small"
            show-input
          >
          </el-slider>
      </el-form-item>
      <el-form-item label="内边距" class="lef ">
          <el-slider
            v-model="datas.padding"
            :max="80"
            input-size="small"
            show-input
          >
          </el-slider>
      </el-form-item>
    </el-form>
    <div class="edit">
      <Tinymce v-model="datas.myValue" width="100%" :height="650" />
    </div>
  </div>
</template>

<script>
 import { Tinymce } from '/@/components/Tinymce/index';
import { ElColorPicker,ElForm,ElFormItem,ElButton,ElInput,ElSlider} from 'element-plus'
export default {
  name: 'richtextstyle',
  props: {
    datas: Object,
  },
   components: {Tinymce,
    ElColorPicker,ElForm,ElFormItem,ElButton,ElInput,ElSlider
  },
  data() {
    return {
      init: {
        images_upload_handler: (blobInfo, succFun, failFun) => {
          var formData = new FormData()

          formData.append('path', 'test/')
          formData.append('file', blobInfo.blob(), blobInfo.blob().name)

          var xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', `${window.global_config.BASE_URL}upload/miniShop`)

          xhr.onload = function () {
            // 获取数据
            var res = JSON.parse(xhr.response)
            if (res.success != true) return failFun('HTTP Error: ' + res.msg)
            succFun(res.data.src)
          }
          xhr.send(formData)
        },
      },
       // 颜色选择器预设
      predefineColors: [
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
}
</script>

<style scoped lang="less">
.richtextstyle {
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
  :deep(.el-form-item--default){
    margin-bottom:0px;
  }
  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }
}

/* 修改富文本样式 */
:deep(.tox) {
  border: 1px solid #ebedf0 !important;
  .tox-tbtn {
    height: 25px !important;
    margin: 0 2px !important;
    width: auto;
    font-size: 13px;
  }
  .tox-tbtn--bespoke .tox-tbtn__select-label {
    width: auto !important;
  }
  .tox-toolbar__group {
    background: #f7f8fa;
  }
}

:deep(.tox) .tox-toolbar,
.tox .tox-toolbar__primary,
.tox .tox-toolbar__overflow {
  background: none !important;
}

:deep(.tox) .tox-tbtn--enabled,
.tox .tox-tbtn--enabled:hover {
  background: none !important;
  :deep(svg) {
    fill: #155bd4 !important;
  }
}
</style>
