<template>
  <div class="right-menu">
    <transition name="setingComp">
      <component :is="compConfig.name" :datas="compConfig.config" />
    </transition>
  </div>
</template>

<script>
import { siteData } from "../../store/index";
import { importComponent } from "../../utils";
import { ElScrollbar } from "element-plus";
const files = import.meta.globEager("../styleCompnents/**/index.vue");
import setingPage from "../setingComponents/setingPage.vue";
import { reactive, watch } from "vue";
import _ from "lodash";

export default {
  name: "rightSetting",
  components: { ElScrollbar, setingPage, ...importComponent(files) },
  setup() {
    const store = siteData();
    const compConfig = reactive({
      name: "",
      config: {},
    });

    watch(
      () => store,
      (val, oldVal) => {
        const {
          pageConfig,
          pageList,
          activeComponentId,
          activePageId,
          baseCompId,
          editMode,
          navId,
          navList,
        } = val;

        compConfig.name = "";
        compConfig.config = {};
        console.log(activeComponentId)
        if (!(["component"].includes(editMode) && activeComponentId)) {
          compConfig.name = "";
          compConfig.config = {};
        }

        if (editMode === "page") {
          // 编辑页面
          compConfig.name = "setingPage";
          compConfig.config = pageConfig;
        } else if (editMode === "component") {
          // 编辑组件
          const componentConfig = _.find(pageConfig.component, ["id", activeComponentId]);
          if (!componentConfig) return;
          const { styleComponent, containerConfig, datas } = componentConfig;
          compConfig.name = styleComponent;
          compConfig.config.containerConfig = containerConfig;
          compConfig.config.datas = datas;
        } else if (editMode === "footerNav") {
          // 编辑底部导航
          compConfig.name = "footerNavStyle";
          compConfig.config = navList;
        } else if (editMode === "nav") {
          // 编辑魔方导航项
          const component = _.find(pageConfig.component, ["id", activeComponentId]);
          if (!component) return;
          const nav = _.find(component.datas.navs, ["id", navId]);
          if (!nav) return;
          compConfig.name = "editNav";
          compConfig.config = nav;
        } else if (["textComp", "imageComp", "buttonComp"].includes(editMode)) {
          // 编辑图片、文本、按钮
          const component = _.find(pageConfig.component, ["id", activeComponentId]);
          const baseComp = _.find(component.datas.component, ["id", baseCompId]);
          if (!baseComp) {
            compConfig.name = "";
            compConfig.config = "";
            return;
          }
          switch (editMode) {
            case "textComp":
              compConfig.name = "textCompStyle";
              compConfig.config = baseComp;
              break;
            case "imageComp":
              compConfig.name = "imageCompStyle";
              compConfig.config = baseComp;
              break;
            default:
              compConfig.name = "buttonCompStyle";
              compConfig.config = baseComp;
          }
        }
      },
      { deep: true }
    );

    return {
      compConfig,
    };
  },
};
</script>

<style lang="less" scoped>
.right-menu {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.setingComp-enter-active,
.setingComp-leave-active {
  transition: all 0.3s ease;
}
.setingComp-leave-to,
.setingComp-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.setingComp-leave-from,
.setingComp-enter-to {
  transform: translateX(0);
  opacity: 1;
}
</style>
