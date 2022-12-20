<template>
  <form-item :title="label" :labelWidth="70">
    <div class="content">
      <input type="text" v-model="modelValue" />
      <div class="checkbox" @click="change">
        <span
          :class="{
            active: hide,
          }"
        ></span>
        隐藏
      </div>
    </div>
  </form-item>
</template>

<script>
import formItem from "../../publicComponents/formItem/index.vue";
export default {
  name: "moduleTitle",
  components: {
    formItem,
  },
  props: {
    modelValue: String,
    hide: Boolean,
    label: {
      type: String,
      default: () => "模块标题：",
    },
  },
  setup(props, { emit }) {
    const change = () => {
      emit("change", !props.hide);
    };

    return {
      change,
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 2px 0;
  input {
    flex: 1;
    height: 100%;
    padding: 0 10px;
    border: 1px solid #e3e2e8;
    border-radius: 2px;
    margin-right: 10px;
    font-size: 13px;
    &:focus {
      border: 1px solid #5874d8;
      outline: none;
    }
  }
  .checkbox {
    display: flex;
    align-items: center;
    user-select: none;
    span {
      display: inline-block;
      content: "";
      width: 16px;
      height: 16px;
      border: 1px solid #d0d4d7;
      margin-right: 10px;
      background-position: -517px -1px;
      &.active {
        background-image: url("../../../assets/images/icon-list.png");
      }
    }
  }
}
</style>