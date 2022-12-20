<template>
  <component :is="`flex${datas.moduleStyle.flexUse}`" :datas="datas" />
</template>

<script>
import flex1 from "./components/flex1.vue";
import flex2 from "./components/flex2.vue";
import { computed } from "vue";
export default {
  name: "imgList",
  components: {
    flex1,
    flex2,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style></style>
