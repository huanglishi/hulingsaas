<template>
  <div
    class="draggable-hover"
    @dragover="dragover"
    @dragenter="dragenter"
    @dragleave="dragleave"
    @drop="drop"
    :style="style"
  >
    <div class="draggable-hover-content" v-if="showHover">放置组件</div>
  </div>
</template>

<script>
import _ from "lodash-es";
import { freeContainerData } from "../../../initData";
import { siteData } from "../../../store";
import { reactive, ref, computed } from "vue";
export default {
  name: "draggableHover",
  props: {
    index: Number,
    isLast: Boolean,
  },
  setup(props) {
    const showHover = ref(false);
    const store = siteData();

    const dragover = (e) => {
      e.preventDefault();
    };

    const dragenter = () => {
      showHover.value = true;
    };

    const dragleave = () => {
      showHover.value = false;
    };

    const drop = (e) => {
      const jsonData = e.dataTransfer.getData("data");
      const compData = JSON.parse(jsonData);
      let data = {};
      showHover.value = false;
      if (["textComp", "imageComp", "buttonComp"].includes(compData.componentName)) {
        data = _.cloneDeep(freeContainerData);
        data.datas.component.push(compData);
      } else {
        data = compData;
      }
      data.id = _.now();
      if (props.index === 0) {
        store.pageConfig.component.unshift(data);
        return;
      }

      if (props.index === store.pageConfig.component.length) {
        store.pageConfig.component.push(data);
        return;
      }
      store.pageConfig.component.splice(props.index, 0, data);
    };

    const style = computed(() => {
      if (props.isLast) {
        return {
          flex: "1 0 10px",
        };
      } else {
        return {
          flex: "0 0 10px",
        };
      }
    });

    return {
      showHover,
      dragover,
      dragenter,
      dragleave,
      drop,
      style,
    };
  },
};
</script>

<style lang="less" scoped>
.draggable-hover {
  transition: height 0.1s linear;
  .draggable-hover-content {
    display: flex;
    pointer-events: none;
    align-items: center;
    justify-content: center;
    height: 30px;
    box-sizing: border-box;
    border: 1px dashed #5874d8;
    color: #5874d8;
    font-size: 13px;
  }
}
</style>
