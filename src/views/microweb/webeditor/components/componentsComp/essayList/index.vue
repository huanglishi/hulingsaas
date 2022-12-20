<template>
  <template v-if="datas.essayList.length !== 0">
    <component :is="`flex${datas.moduleStyle}`" :datas="datas" />
  </template>
  <div class="empty" v-else>请从右侧面板选中选择文章~</div>
</template>

<script>
import flex1 from "./components/flex1.vue";
import flex2 from "./components/flex2.vue";
export default {
  name: "essayList",
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
  font-size: 14px;
  line-height: 130px;
  text-align: center;
}
</style>
