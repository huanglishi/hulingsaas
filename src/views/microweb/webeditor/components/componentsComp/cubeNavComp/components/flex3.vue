<template>
  <ul class="nav-list-3">
    <li
      class="nav-item"
      v-for="(item, index) in initData"
      :key="index"
      @click.stop="editNav(item)"
    >
      <a :href="setjump(item)" style="pointer-events: none; display: block">
        <div
          class="icon-bg"
          :style="{
            backgroundColor: setParams(item, 'bgModel', 'defaultBg', 'customBg'),
          }"
        >
          <template v-if="item.iconModel !== 'hide'">
            <img
              :src="setParams(item, 'iconModel', 'defaultIcon', 'customIcon')"
              alt=""
            />
          </template>
        </div>
        <p
          :style="{
            'font-weight':
              item.titlefontWeight && item.titleStyle === 'custom' ? 700 : 'normal',
            'text-decoration':
              item.titleOutLine && item.titleStyle === 'custom' ? 'underline' : 'none',
            color:
              item.titleStyle === 'custom' ? item.titleColor : item.defaultTitleColor,
            'font-size':
              item.titleStyle === 'custom'
                ? `${item.titleFontSize}px`
                : `${item.defaultFontSize}px`,
          }"
        >
          {{ item.hideTitle ? "" : item.title }}
        </p>
      </a>
    </li>
  </ul>
</template>

<script>
import { siteData } from "../../.././../store/index";
import { reactive, onMounted } from "vue";
import _ from "lodash";
export default {
  name: "flex3",
  props: {
    navs: {
      type: Array,
      default: () => [],
    },
    compId: {
      type: String,
      default: () => "",
    },
  },
  setup(props) {
    const store = siteData();
    const initData = reactive([
      {
        title: "为您推荐",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "weiningtuijian.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#FF453F",
        customBg: "#FF453F",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },

      {
        title: "限时特价",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "xianshitejia.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#8578F5",
        customBg: "#8578F5",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },

      {
        title: "优惠券",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "youhuiquan.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#FFD112",
        customBg: "#FFD112",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "会员",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "huiyuan.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#1B9BFC",
        customBg: "#1B9BFC",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "购物车",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "gouwuche.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#16DEF3",
        customBg: "#16DEF3",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "关于我们",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "guanyuwomen.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#FF8000",
        customBg: "#FF8000",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "搜索",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "sousuo-2.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#F6736C",
        customBg: "#F6736C",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "更多",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "gengduo.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#61E68F",
        customBg: "#61E68F",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "#000",
        defaultTitleColor: "#333",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
    ]);

    const editNav = (item) => {
      store.activeComponentId = props.compId;
      store.editMofangNav(item.id);
    };

    const setParams = (item, model, defaultParam, customParam) => {
      if (item[model] === "default") {
        if (model === "iconModel") {
          return new URL(
            `../../../../assets/images/mofangNav/${item[defaultParam]}`,
            import.meta.url
          ).href;
        } else {
          return item[defaultParam];
        }
      } else if (item[model] === "hide") {
        return model === "bgModel" ? "transparent" : "";
      } else {
        return item[customParam];
      }
    };

    // 设置a标签是否跳转
    const setjump = (item) => {
      const { jumpUse, jumpUrl } = item;
      return jumpUse === "not" ? "javascript:;" : jumpUrl;
    };

    onMounted(() => {
      store.selectMofangNav(initData, props.compId);
    });
    return {
      initData,
      setParams,
      setjump,
      editNav,
    };
  },
};
</script>

<style lang="less" scoped>
.nav-list-3 {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  .nav-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: calc(100% / 4);
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px solid transparent;
    &:hover {
      border-color: #5874d8;
    }
    .icon-bg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background-color: red;
      img {
        width: 50%;
        height: 50%;
      }
    }
    p {
      text-align: center;
      margin: 10px 0 0 0;
    }
  }
}
</style>
