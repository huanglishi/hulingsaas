<template>
  <setction class="main">
    <div class="left-aside">
      <ul>
        <li
          :class="['item', activeName === 'moduleList' ? 'active' : '']"
          @click="change('moduleList')"
        >
          <i class="iconfont icon-gongzuotai"></i>
          <p>模块</p>
        </li>
        <li
          :class="['item', activeName === 'pageList' ? 'active' : '']"
          @click="change('pageList')"
        >
          <i class="iconfont icon-hetongliebiao"></i>
          <p>页面</p>
        </li>
        <li
          class="bg"
          :style="{
            transform: `translateY(${index * 100}%)`,
          }"
        ></li>
      </ul>
    </div>

    <div class="right-content">
      <component :is="activeName" />
    </div>
  </setction>
</template>

<script>
import { ref } from "vue";
import { ElTabs, ElTabPane, ElIcon } from "element-plus";
import moduleList from "./components/moduleList.vue";
import pageList from "./components/pageList.vue";

export default {
  name: "leftMenu",
  components: {
    ElTabs,
    ElTabPane,
    ElIcon,
    moduleList,
    pageList,
  },
  setup() {
    const activeName = ref("moduleList");
    const index = ref(0);

    const change = (item) => {
      index.value = item === "moduleList" ? 0 : 1;
      activeName.value = item;
    };

    return {
      activeName,
      index,
      change,
    };
  },
};
</script>

<style lang="less" scoped>
.main {
  display: flex;
  height: 100%;
  width: 400px;

  .left-aside {
    position: relative;
    height: 100%;
    width: 64px;
    background-color: #2b3244;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      color: #a0acbe;
      user-select: none;
      cursor: pointer;
      z-index: 3;
      &.active,
      &:hover {
        color: #fff;
      }
      i {
        font-size: 30px;
        margin-bottom: 12px;
      }
    }
    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100px;
      box-sizing: border-box;
      background-color: #5874d8;
      z-index: 2;
      transition: all 0.2s linear;
    }
  }
  .right-content {
    flex: 1;
    background-color: #fff;
    overflow: auto;
    padding-bottom: 30px;
  }
}
</style>