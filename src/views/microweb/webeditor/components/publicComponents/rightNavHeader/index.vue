<!-- 顶部切换模块 -->
<template>
  <ul class="nav-list">
    <li
      :class="['nav-item', index === curIndex ? 'active' : '']"
      v-for="(nav, index) in navs"
      :key="index"
      @click="changNav(nav, index)"
    >
      {{ nav.text }}
    </li>
    <li
      class="bg"
      :style="{
        width: `${100 / navs.length}%`,
        transform: `translateX(${curIndex * 100}%)`,
      }"
    ></li>
  </ul>
</template>

<script>
import _ from "lodash-es";
import { ref } from "vue";
export default {
  name: "navHeader",
  props: {
    navs: {
      type: Array,
      default: () => [],
    },
    activeName: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const curIndex = ref(0);
    if (!props.activeName) {
      curIndex.value = 0;
    } else {
      const idx = _.findIndex(props.navs, ["type", props.activeName]);
      curIndex.value = idx;
    }
    const changNav = (nav, index) => {
      curIndex.value = index;
      emit("change", nav);
    };
    return {
      curIndex,
      changNav,
    };
  },
};
</script>

<style lang="less" scoped>
.nav-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: rgb(240, 240, 240);
  .nav-item {
    width: 50%;
    line-height: 50px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    color: #666;
    z-index: 3;
    &.active {
      color: #5874d8;
    }
  }
  .bg {
    position: absolute;
    left: 0;
    transition: all 0.3s ease;
    height: 50px;
    width: 50%;
    background-color: #fff;
  }
}
</style>
