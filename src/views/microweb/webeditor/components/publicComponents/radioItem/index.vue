<!-- 单选项 -->
<template>
  <div :class="['radio-item', modelValue ? 'active': '']" @click="change">
    <span></span>
    <p>{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: "radioItem",
  props: {
    label: String,
    modelValue: Boolean,
  },
  setup(props, { emit }) {
    const change = () => {
      emit('change', !props.modelValue)
    };

    return {
      change,
    };
  },
};
</script>

<style lang="less" scoped>
.radio-item {
  display: flex;
  align-items: center;
  user-select: none;
  color: #333;
  cursor: pointer;
  &.active span::after {
    background-color: rgb(130, 130, 130);
  }

  span {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #d8d8d8;
    margin-right: 6px;
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
</style>