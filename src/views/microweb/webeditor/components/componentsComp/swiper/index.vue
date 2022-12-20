<template>
  <template v-if="datas.imgList.length === 0">
    <empty text="请在右侧面板添加图片" />
  </template>
  <template v-else>
    <component :is="`flex${datas.flexUse}`" :datas="datas" />
  </template>
</template>

<script>
import flex1 from "./components/flex1.vue";
import flex2 from "./components/flex2.vue";
import Empty from "../../publicComponents/empty/index.vue";
export default {
  name: "swipe",
  components: {
    flex1,
    flex2,
    Empty,
  },
  props: {
    datas: Object,
  },
};
</script>

<style></style>
