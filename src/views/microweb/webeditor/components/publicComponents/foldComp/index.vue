<!-- 折叠模块 -->
<template>
  <div class="fold" :class="{ active: open }">
    <div class="title" @click="handle">
      <i class="iconfont icon-youjiantou"></i>
      {{ title }}
    </div>
    <div
      class="fold-content"
      :style="{
        'max-height': open ? `${maxHeight}px` : '0',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "foldComp",
  props: {
    title: {
      type: String,
      default: () => "",
    },
    open: {
      type: Boolean,
      default: () => false,
    },
    maxHeight: {
      type: Number,
      default: () => 235,
    },
  },
  setup(props, { emit }) {
    const handle = () => {
      emit("change", !props.open);
    };
    return {
      handle,
    };
  },
};
</script>

<style lang="less" scoped>
.fold {
  &.active {
    // .fold-content {
    //   max-height: 235px;
    // }
    .title i {
      transform: rotate(90deg);
    }
  }
  .title {
    padding: 0 16px;
    line-height: 40px;
    background-color: rgb(247, 247, 247);
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 10px;

    i {
      display: inline-block;
      font-size: 10px;
      color: #676769;
      transition: all 0.3s ease;
    }
  }
  .fold-content {
    padding: 0 16px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s linear;
  }
}
</style>
