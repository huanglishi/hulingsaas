<template>
  <div class="componentsbox">
  <div class="entertheshop">
    <!-- 内容 -->
    <van-cell
      class="pointer-events"
      :icon="datas.icon"
      :title="datas.shopName"
       is-link
      :value="datas.copywriting"
    />
  </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'entertheshop',
  props: {
    datas: Object,
  },
}
</script>

<style scoped lang="less">
.entertheshop {
  :deep(.van-cell__left-icon){
    display: flex;
    align-items: center;
  }
}
</style>
