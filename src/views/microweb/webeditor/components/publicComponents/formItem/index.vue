<template>
  <div
    class="wraper"
    :style="{
      flexDirection: direction == 'horizontal' ? 'row' : 'column',
    }"
  >
    <div
      class="label"
      :style="{
        width: `${labelWidth}px`,
      }"
    >
      {{ title }}
    </div>
    <div class="conetnt">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "formItem",
  props: {
    title: String,
    labelWidth: {
      type: Number,
      default: () => 70,
    },
    direction: {
      type: String,
      default: () => "horizontal", // horizontal  vertical
    },
  },
};
</script>

<style lang="less" scoped>
.wraper {
  display: flex;
  align-items: flex-start;
  height: 36px;
  .label {
    text-align: right;
    height: 36px;
    line-height: 36px;
    margin-right: 10px;
    color: #333;
    font-size: 13px;
  }
  .conetnt {
    height: 100%;
  }
}
</style>