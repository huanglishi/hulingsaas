<!-- 配置模块容器 -->
<template>
  <div class="wrapper">
    <!-- 选择颜色 -->
    <picker-color
      :colorList="colors"
      :activeColor="config.color"
      @select="(color) => (config.color = color)"
    />

    <ul class="style-list">
      <li
        v-for="item in 3"
        :class="{
          default: item === 1,
          'style-item': item !== 1,
        }"
        :key="item"
        @click="selectStyle(item)"
      >
        <div
          class="bg-img"
          :class="{
            'active-flex': config.selectStyle === item,
          }"
          :style="{
            backgroundColor: config.color,
          }"
        >
          {{ item === 1 ? "默认" : "" }}
        </div>
      </li>
    </ul>

    <div class="line"></div>
    <p class="custom">自定义模块皮肤:</p>
    <fold-comp title="常规" :open="active" @change.self="handle">
      <div class="principal-content">
        <el-form label-width="80px" class="routine-form">
          <el-form-item label="标题栏：">
            <el-radio-group v-model="config.showTitle">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="透明度：">
            <el-slider
              v-model="config.opacity"
              :min="0"
              :max="100"
              :format-tooltip="formatTip"
              size="small"
            />
          </el-form-item>
        </el-form>
      </div>
    </fold-comp>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElButton,
  ElColorPicker,
  ElCheckbox,
  ElRadio,
  ElSlider,
} from "element-plus";
import { reactive } from "vue";
import foldComp from "../foldComp/index.vue";
import radioComp from "../radioComp/index.vue";
import pickerColor from "../pickerColor/index.vue";
import formItem from "../formItem/index.vue";
export default {
  name: "containerSetingfForm",
  components: {
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElButton,
    ElColorPicker,
    ElCheckbox,
    ElRadio,
    foldComp,
    radioComp,
    pickerColor,
    formItem,
    ElSlider,
  },
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const active = ref(false);
    const border = ref("default");
    const handle = () => {
      active.value = !active.value;
    };

    const colors = reactive([
      "rgb(255,114,20)",
      "rgb(242,48,48)",
      "rgb(255,71,141)",
      "rgb(6,193,174)",
      "rgb(251,190,64)",
      "rgb(66,189,86)",
      "rgb(6, 193, 174)",
      "rgb(50, 133, 255)",
      "rgb(191, 160, 115)",
      "rgb(41, 41, 41)",
    ]);
    const selectColor = (color) => {
      props.config.color = color;
    };
    const selectStyle = (item) => {
      props.config.selectStyle = Number(item);
    };

    const formatTip = (val) => `${val}%`;
    return {
      colors,
      selectColor,
      selectStyle,
      active,
      handle,
      border,
      formatTip,
    };
  },
};
</script>

<style lang="less" scoped>
.style-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  li {
    width: 50%;
    height: 130px;
    padding: 0 8px 15px;
    cursor: pointer;
    .bg-img {
      width: 100%;
      height: 100%;
      border: 1px solid rgb(228, 228, 228);
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    &.active .bg-img {
      border-color: #5874d8 !important;
    }
    &:nth-of-type(2) .bg-img {
      background-image: url("../../../assets/flexImages/flex-1.png");
    }
    &:nth-of-type(3) .bg-img {
      background-image: url("../../../assets/flexImages/flex-2.png");
    }

    &.default {
      line-height: 102px;
      text-align: center;
      user-select: none;
      .bg-img {
        background-color: #fff !important;
      }
    }
  }
}

.line {
  width: 100%;
  height: 1px;
  border-top: 1px dashed #ccc;
}
.custom {
  font-size: 14px;
  color: #666;
  margin: 20px 0;
}

::v-deep .routine-form {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-slider{
    width: 70%;
    .el-slider__button{
      width: 15px;
      height: 15px;
    }
  }
}
</style>
