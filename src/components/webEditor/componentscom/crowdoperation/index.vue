<template>
  <div class="componentsbox">
  <div class="crowdoperation">
    {{ datas.text }}
  </div>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'crowdoperation',
  props: {
    datas: Object,
  },
}
</script>

<style scoped lang="less">
</style>
