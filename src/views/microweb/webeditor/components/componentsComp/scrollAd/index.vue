<template>
  <component :is="config.name" :config="config.config" />
</template>

<script>
import { computed } from "vue";
import flex1 from "./components/flex1.vue";
import flex2 from "./components/flex2.vue";
export default {
  name: "textAnnouncement",
  components: {
    flex1,
    flex2
  },
  props: {
    datas: {
      type: Object,
      default: () => ({
        selectStyle: 1,
        color: "red",
        notice: [],
      }),
    },
  },
  setup(props) {
    const config = computed(() => {
      const result = {
        name: "",
        config: {},
      };
      const { moduleFlex, color, iconStyle, notice } = props.datas;
      result.name = `flex${moduleFlex}`;
      result.config = {
        color,
        iconStyle,
        notice,
      };
      return result;
    });

    return {
      config,
    };
  },
};
</script>

<style lang="less" scoped>
</style>