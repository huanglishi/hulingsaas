<template>
  <div class="phoneWrap">
    <div class="phone-content">
      <template v-if="renderType === 'page'">
        <component :is="pageName" />
      </template>

      <template v-else>
        <!-- 顶部导航 -->
        <page-header-nav :pageConfig="pageConfig" />

        <!-- 中间内容区 -->
        <div
          class="phone"
          id="phone-content"
          :style="{
            backgroundColor: pageConfig.templateJson.backgroundColor,
            backgroundImage: `url(${pageConfig.templateJson.backgroundImage})`,
          }"
          @dragenter.capture="dragenter"
          @dragleave.capture="dragleave"
          @drop="drop"
          @dragover="dragover"
          @mousemove="move"
        >
          <template v-for="(element, index) in getCurPageComponents" :key="element.id">
            <template v-if="index === 0">
              <draggableHover :isLast="false" :index="index" />
            </template>
            <container-component
              :moduleSetting="element.containerConfig"
              :compConfig="element.datas"
              :compName="element.componentName"
              :compId="element.id"
              :clientInfo="clientInfo"
            />
            <draggableHover
              :isLast="index + 1 === getCurPageComponents.length"
              :index="index + 1"
            />
          </template>

          <div
            v-if="getCurPageComponents.length === 0 && draggableIsEnter"
            class="draggable"
          >
            放在这里
          </div>
        </div>

        <!-- 底部导航 -->
        <template v-if="pageConfig.templateJson.showFooterNav">
          <footerNav />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { siteData } from "../store";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import containerComponent from "./publicComponents/containerComponent/index.vue";
import footerNav from "./publicComponents/footerNav/index.vue";
import pageHeaderNav from "./publicComponents/pageHeaderNav/index.vue";
import productDetail from "../page/productDetail.vue";
import essayDetail from "../page/essayDetail.vue";
import Login from "../page/login.vue";
import Regstry from "../page/regstry.vue";
import MemberCenter from "../page/memberCenter.vue";
import freeContainer from "./publicComponents/freeContainer/index.vue";
import _ from "lodash";
import { ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import { parseUrlParams } from "../utils";
import draggableHover from "./publicComponents/draggableHover/index.vue";
import { freeContainerData } from "../initData/index.js";

export default {
  name: "centerShow",
  components: {
    draggable,
    containerComponent,
    footerNav,
    productDetail,
    essayDetail,
    freeContainer,
    pageHeaderNav,
    Login,
    Regstry,
    MemberCenter,
    draggableHover,
  },
  setup() {
    const draggableIsEnter = ref(false);
    const renderType = ref("");
    const pageName = ref("");
    const clientInfo = reactive({
      clientX: 0,
      clientY: 0,
    });

    const store = siteData();
    const router = useRoute();
    const { getCurPageComponents, getCurPageConfig, pageConfig } = storeToRefs(store);

    const move = (e) => {
      const { clientX, clientY } = e;
      clientInfo.clientX = clientX;
      clientInfo.clientY = clientY;
    };

    const _wr = (type) => {
      const origin = history[type];
      return function () {
        const event = new Event(type);
        event.arguments = arguments;
        window.dispatchEvent(event);
        return origin.apply(this, arguments);
      };
    };
    //重写方法
    history.pushState = _wr("pushState");
    history.replaceState = _wr("replaceState");

    window.addEventListener("pushState", function (e) {
      const href = e.arguments[2];
      const { type, compName } = parseUrlParams(href.split("?")[1]);
      if (type) {
        renderType.value = type;
      } else {
        renderType.value = "";
      }
      if (compName) {
        pageName.value = compName;
      } else {
        pageName.value = "";
      }
    });

    watch(
      () => router.query,
      (val) => {
        // 监听参数变化，渲染对应页面
        const { type, compName } = val;
        if (type) {
          renderType.value = type;
        } else {
          renderType.value = "";
        }
        if (compName) {
          pageName.value = compName;
        } else {
          pageName.value = "";
        }
      },
      { deep: true, immediate: true }
    );

    const isAllow = ref(true); // 是否可以加入该数据、是否显示占位标志
    watch(
      () => store.isInFreeContainer,
      (val) => {
        isAllow.value = !val;
      }
    );

    const dragover = (e) => {
      e.preventDefault();
    };

    // 拖拽进入
    const dragenter = () => {
      draggableIsEnter.value = true;
    };

    // 拖拽移出
    const dragleave = () => {
      draggableIsEnter.value = false;
    };

    // 拖拽放置
    const drop = (e) => {
      const jsonData = e.dataTransfer.getData("data");
      const compData = JSON.parse(jsonData);
      let data = {};
      draggableIsEnter.value = false;
      if (store.pageConfig.component.length === 0) {
        // 组件列表为空，直接放入
        if (["textComp", "imageComp", "buttonComp"].includes(compData.componentName)) {
          data = _.cloneDeep(freeContainerData);
          data.datas.component.push(compData);
        } else {
          data = compData;
        }
        data.id = _.now();
        store.editMode = "component";
        store.activeComponentId = data.id;
        store.pageConfig.component.push(data);
      }
    };

    return {
      getCurPageComponents,
      getCurPageConfig,
      dragover,
      pageConfig,
      renderType,
      pageName,
      clientInfo,
      move,
      isAllow,
      dragenter,
      draggableIsEnter,
      dragleave,
      drop,
    };
  },
};
</script>

<style lang="less" scoped>
.phoneWrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .phone-content {
    position: absolute;
    left: 50%;
    top: 80px;
    bottom: 80px;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    width: 375px;
    min-height: 500px;
    background-color: #fff;
    .phone {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
  .draggable {
    line-height: 30px;
    text-align: center;
    color: #5874d8;
    box-sizing: border-box;
    border: 1px dashed #5874d8;
    pointer-events: none;
  }
}
</style>
