<template>
  <div class="warpper">
    <right-nav-header
      :navs="[
        {
          text: '产品展示',
          type: 'productsShow',
        },
        {
          text: '编辑模块',
          type: 'editModule',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />

    <div class="tabs" v-if="activeName === 'productsShow'">
      <div class="tabs-content">
        <span class="tab-pane" @click="() => (tabsIndex = 0)">基础</span>
        <span class="tab-pane" @click="() => (tabsIndex = 1)">参数</span>
        <span
          class="line"
          :style="{
            transform: `translateX(${tabsIndex * 70}px)`,
          }"
        ></span>
      </div>
    </div>

    <div class="content">
      <template v-if="activeName === 'productsShow'">
        <component :is="tabsIndex === 0 ? 'base' : 'params'" :datas="datas" />
      </template>

      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import base from "./components/base.vue";
import params from "./components/params.vue";
import publicComponents from "../../publicComponents";
import _ from "lodash-es";
export default {
  name: "productsCompStyle",
  components: {
    base,
    params,
    ...publicComponents,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    console.log(props)
    const tabsIndex = ref(0);
    const activeName = ref("productsShow");

    return {
      activeName,
      tabsIndex,
    };
  },
};
</script>

<style lang="less" scoped>
.warpper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
}
.content {
  padding: 15px 20px 0;
}

.tabs {
  padding: 0 20px;
  margin-top: 20px;
  border-bottom: 1px solid #e6e6e6;
  .tabs-content {
    position: relative;
    .tab-pane {
      display: inline-block;
      width: 70px;
      text-align: center;
      color: #666;
      user-select: none;
      cursor: pointer;
      padding-bottom: 15px;
    }
    .line {
      position: absolute;
      display: inline-block;
      width: 70px;
      height: 2px;
      background-color: #557ce1;
      bottom: 0;
      left: 0;
      transition: all 0.3s ease;
    }
  }
}
</style>
