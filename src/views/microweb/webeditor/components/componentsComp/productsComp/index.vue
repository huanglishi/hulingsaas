<template>
  <div v-if="datas.productsList.length === 0" class="empty">请从右侧面板中选择产品~</div>
  <template v-else>
    <component :is="`flex${datas.moduleStyle}`" :datas="datas" />
  </template>
</template>

<script>
import flex1 from "./components/flex1.vue";
import flex2 from "./components/flex2.vue";
export default {
  name: "productsComp",
  components: {
    flex1,
    flex2,
  },
  props: {
    datas: Object,
  },
};
</script>

<style lang="less" scoped>
.empty {
  color: #666;
  line-height: 130px;
  text-align: center;
}
</style>
