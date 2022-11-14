<template>
  <div class="componentsbox">
  <div class="notice">
    <!-- 公告 -->
    <van-notice-bar
      :text="datas.noticeText"
      left-icon="volume-o"
      :background="datas.backColor"
      :color="datas.textColor"
    />
  </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'notice',
  props: {
    datas: Object,
  },
}
</script>

<style scoped lang="less">
</style>
