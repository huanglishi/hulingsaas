<!-- 选择颜色 -->
<template>
  <ul class="color-list">
    <li
      v-for="(color, index) in colorList"
      :class="{
        default: index === 0,
        active: activeColor === color,
      }"
      :key="index"
      @click="selectColor(color)"
    >
      <i v-if="index === 0">默</i>
      <span class="bg" :style="{ backgroundColor: color }"></span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "pickerColor",
  props: {
    colorList: {
      type: Array,
      default: () => [],
    },
    activeColor: String,
  },
  setup(props, { emit }) {
    const selectColor = (item) => {
      emit("select", item);
    };

    return {
      selectColor,
    };
  },
};
</script>

<style lang="less" scoped>
.color-list {
  display: flex;
  align-items: center;
  height: 100%;
  .default {
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    &::after {
      background-color: transparent;
      border: 1px solid rgb(189, 189, 189);
    }
  }
  li {
    position: relative;
    width: 20px;
    height: 20px;
    margin: 0 10px 0 0;
    cursor: pointer;
    user-select: none;
    &.active {
      border-radius: 4px !important;

      .bg {
        border-radius: 6px;
      }
    }
    i {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }

    &.default {
      border-radius: 50%;
      .bg {
        transform: rotate(45deg);
        background-color: transparent !important;
        border: 1px solid rgb(199, 199, 199);
      }
    }

    .bg {
      transform: rotate(45deg);
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      z-index: 1;
      border-radius: 50%;
    }
  }
}
</style>