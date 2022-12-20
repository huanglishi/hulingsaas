<!-- 单选列表 -->
<template>
  <formItem :title="label">
    <ul class="radio-list">
      <li
        :class="{ active: item.id === modelValue }"
        v-for="item in options"
        :key="item.id"
        @click.stop="change(item)"
      >
        <span></span>
        <p>{{ item.text }}</p>
      </li>
    </ul>
  </formItem>
</template>

<script>
import formItem from "../formItem/index.vue";
export default {
  name: "radioComp",
  components: {
    formItem,
  },
  props: {
    label: String,
    options: Array,
    modelValue: String,
  },
  setup(props, { emit }) {
    const change = ({ id }) => {
      emit("change", id);
    };
    return {
      change,
    };
  },
};
</script>

<style lang="less" scoped>
.radio-list {
  display: flex;
  align-items: center;
  height: 36px;
  li {
    line-height: 36px;
    display: flex;
    align-items: center;
    margin-right: 15px;
    user-select: none;
    cursor: pointer;
    &.active span::after {
      background-color: rgb(130, 130, 130);
    }

    p{
      color: #333;
      font-size: 13px;
    }
    span {
      position: relative;
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #d8d8d8;
      margin-right: 5px;
      &::after {
        content: "";
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: transparent;
      }
    }
  }
}
</style>