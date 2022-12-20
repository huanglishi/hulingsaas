<!-- 模块外部容器 -->
<template>
  <div
    :class="['container-wrap', getActiveComponetId === compId ? 'active' : '']"
    @click="selectComp"
    :style="{
      opacity: 1 - moduleSetting.opacity / 100,
    }"
  >
    <div class="border"></div>
    <div class="border"></div>
    <div class="border"></div>
    <div class="border"></div>
    <!-- <div class="edit-component" @click="selectComp">编辑组件</div> -->
    <template v-if="moduleSetting.showTitle">
      <!-- 样式一 -->
      <div class="title-2" v-if="moduleSetting.selectStyle === 2">
        <span :style="{ backgroundColor: moduleSetting.color }">{{
          moduleSetting.title
        }}</span>
      </div>

      <!-- 样式二 -->
      <div class="title-3" v-else-if="moduleSetting.selectStyle === 3">
        <i class="dot" :style="{ backgroundColor: moduleSetting.color }"></i>
        <span :style="{ color: moduleSetting.color }">{{ moduleSetting.title }}</span>
      </div>

      <!-- 默认样式 -->
      <div class="title-1" v-else>
        <i class="dot" :style="{ backgroundColor: moduleSetting.color }"></i>
        <span :style="{ color: moduleSetting.color }">{{ moduleSetting.title }}</span>
      </div>
    </template>

    <!-- 内容区 -->
    <draggable
      :list="data"
      :style="{
        backgroundColor: moduleSetting.backgroundColor,
      }"
      class="comp-list"
      :group="{ pull: false, put: true }"
      :sort="false"
      :ghostClass="'hoverGhostClass'"
      handle=".dargBtn"
      @mousemove="move"
    >
      <template #item="{ element }">
        <div
          @mousedown.stop="mousedown(element.id)"
          :id="element.id"
          :style="{
            position: 'absolute',
            top: `${element.top}px`,
            left: `${element.left}px`,
          }"
        >
          <component :is="element.componentName" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import { reactive, watch, ref } from "vue";
import { siteData } from "../../../store/index";
import { storeToRefs } from "pinia";
import _ from "lodash";
import { importComponent } from "../../../utils";
const files = import.meta.globEager("../../componentsComp/**/index.vue");
import draggable from "vuedraggable";
import textComp from "../../componentsComp/textComp/index.vue";
export default {
  name: "freeContainer",
  components: {
    draggable,
    textComp,
    ...importComponent(files),
  },
  props: {
    // 容器模块配置
    moduleSetting: {
      type: Object,
      default: () => ({
        selectStyle: 1, // 选中的预设样式
        title: "模块标题", // 模块标题
        showTitle: true, // 是否显示标题
        color: "rgb(255,114,20)", // 标题颜色
        backgroundColor: "#fff", // 背景色
      }),
    },
    // 组件配置
    compConfig: {
      type: Object,
      default: () => ({}),
    },
    // 组件名
    compName: {
      type: String,
      default: () => "",
    },
    // 组件id
    compId: {
      type: String,
      default: () => "",
    },
    datas: Object,
  },
  setup(props) {
    console.log(props.datas);
    const data = reactive([]);
    const store = siteData();
    const { getActiveComponetId } = storeToRefs(store);
    const dataId = ref("");

    const selectComp = () => {
      store.changeComponent(props.compId);
    };

    const move = (e) => {
      // const { clientX, clientY } = e;
      // console.log(dataId.value, props.datas);
      // const item = _.find(props.datas, ["id", dataId.value]);
      // console.log(props.datas);
      // console.log(e);
      // console.log(node.value);
    };

    const mousedown = (id) => {
      // console.log(id);
      // dataId.value = id;
      // console.log(e.target);
      // node.value = e.target;
    };

    watch(
      () => data,
      (val) => {
        console.log('data----',val[0].datas[0]);
        // console.log(val);
        // console.log("页面信息", store.pageConfig.component);
        // data.push(val.datas[0]);
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return {
      selectComp,
      data,
      move,
      getActiveComponetId,
      mousedown,
    };
  },
};
</script>

<style lang="less" scoped>
.container-wrap {
  margin-bottom: 14px;
  position: relative;

  .border {
    position: absolute;
    display: none;
    z-index: 1;
    &:nth-of-type(1) {
      border-top: 1px dashed #5874d8;
      top: 0;
      left: 0;
      right: 0;
    }
    &:nth-of-type(2) {
      border-right: 1px dashed #5874d8;
      top: 0;
      bottom: 0;
      right: 0;
    }
    &:nth-of-type(3) {
      border-bottom: 1px dashed #5874d8;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &:nth-of-type(4) {
      border-left: 1px dashed #5874d8;
      top: 0;
      bottom: 0;
      left: 0;
    }
  }

  &.active,
  &:hover {
    .border {
      display: block;
    }
  }
  &:hover {
    .edit-component {
      display: block;
    }
  }

  .title-1 {
    display: flex;
    align-items: center;
    padding: 10px 0;
    background-color: #fff;
    border-bottom: 1px solid rgb(219, 219, 219);
    .dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      margin: 0 10px;
    }
    span {
      display: flex;
      align-items: center;
      color: rgb(255, 114, 20);
      font-size: 16px;
    }
  }
  .title-2 {
    padding: 10px 0;
    background-color: #fff;
    border-bottom: 1px solid rgb(219, 219, 219);
    span {
      color: #fff;
      font-size: 14px;
      display: inline-block;
      line-height: 24px;
      padding: 2px 10px;
      background-color: rgb(255, 114, 20);
      border-radius: 0 24px 24px 0;
    }
  }
  .title-3 {
    display: flex;
    align-items: center;

    padding: 10px 0;
    background-color: #fff;
    border-bottom: 1px solid rgb(219, 219, 219);
    .dot {
      display: inline-block;
      width: 4px;
      height: 14px;
      border-radius: 2px;
      margin: 0 10px;
    }
    span {
      display: flex;
      align-items: center;
      font-size: 16px;
    }
  }
  .comp-list {
    position: relative;
    height: 229px;
    overflow: hidden;
  }
  .edit-component {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(-100%);
    color: #666;
    font-size: 13px;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
    user-select: none;
    cursor: pointer;
    z-index: 9999;
    background-color: #fff;
    &:hover {
      color: #5874d8;
    }
  }
}
</style>
