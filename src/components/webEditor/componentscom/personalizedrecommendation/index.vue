<template>
  <div class="componentsbox">
  <div class="personalizedrecommendation">
    {{ datas.text }}
  </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'personalizedrecommendation',
  props: {
    datas: Object,
  },
}
</script>

<style scoped lang="less">
</style>
