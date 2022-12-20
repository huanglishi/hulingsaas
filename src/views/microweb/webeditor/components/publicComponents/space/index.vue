<template>
  <span
    class="space"
    :style="{
      height: direction == 'vertical' ? `${size}px` : '',
      width: direction == 'horizontal' ? `${size}px` : '',
    }"
  ></span>
</template>

<script>
export default {
  name: "space",
  props: {
    size: {
      type: Number,
      default: () => 10,
    },
    direction: {
      type: String,
      default: () => "vertical",
      required: false,
    },
  },
};
</script>

<style lang="less" scoped>
.space {
  display: inline-block;
}
</style>