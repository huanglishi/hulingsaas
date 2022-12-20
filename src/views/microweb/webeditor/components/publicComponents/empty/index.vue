<template>
  <div class="empty">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "empty",
  props: {
    text: {
      type: String,
      default: () => "暂无数据！",
    },
  },
};
</script>

<style lang="less">
.empty{
    line-height: 160px;
    text-align: center;
    color: #666;
    font-size: 14px;
}
</style>
