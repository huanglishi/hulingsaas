<template>
  <div
    class="text"
    contenteditable="true"
    placeholder="点击输入内容"
    :style="{
      color: datas.color,
    }"
  ></div>
</template>

<script>
import { reactive } from "vue";
import { ElInput } from "element-plus";
export default {
  name: "textComp",
  components: {
    ElInput,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({
        fontSize: 16,
        color: "#000",
        url: "",
      }),
    },
  },
};
</script>

<style lang="less" scoped>
.text {
  padding: 4px;
  width: 200px;
  min-height: 30px;
  &:focus {
    border: 1px dashed #409eff;
    outline: none;
    content: none;
  }
  &:empty::before {
    content: attr(placeholder);
    color: #ccc;
    font-size: 13px;
  }
}
</style>
