<template>
  <ul class="nav-list-1">
    <li
      class="nav-item"
      v-for="(item, index) in initData"
      :key="index"
      @click.stop="editNav(item)"
    >
      <div
        class="icon-bg"
        :style="{
          backgroundColor: setParams(item, 'bgModel', 'defaultBg', 'customBg'),
        }"
      >
        <template v-if="item.iconModel !== 'hide'">
          <img :src="setParams(item, 'iconModel', 'defaultIcon', 'customIcon')" alt="" />
        </template>
      </div>
      <p
        :style="{
          'font-weight':
            item.titlefontWeight && item.titleStyle === 'custom' ? 700 : 'normal',
          'text-decoration':
            item.titleOutLine && item.titleStyle === 'custom' ? 'underline' : 'none',
          color: item.titleStyle === 'custom' ? item.titleColor : item.defaultTitleColor,
          'font-size':
            item.titleStyle === 'custom'
              ? `${item.titleFontSize}px`
              : `${item.defaultFontSize}px`,
        }"
      >
        {{ item.hideTitle ? "" : item.title }}
      </p>
    </li>
  </ul>
</template>

<script>
import { siteData } from "../../.././../store/index";
import _ from "lodash";
import { reactive, onMounted } from "vue";
export default {
  name: "flex1",
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
        title: "机票",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "jipiao.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#32CE9A",
        customBg: "#32CE9A",

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
        title: "酒店",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "jiudian.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#26A9FD",
        customBg: "#26A9FD",

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
        title: "当地玩乐",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "dangdiwanle.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#FFA352",
        customBg: "#FFA352",

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
        title: "自驾游",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "zijiayou.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#FD6190",
        customBg: "#FD6190",

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
        title: "邮轮",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "youlun.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#D23E50",
        customBg: "#D23E50",

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
        title: "信用卡",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "xinyongka.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#FE6469",
        customBg: "#FE6469",

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
        title: "问答攻略",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "wendagonglue.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#8E8FFB",
        customBg: "#8E8FFB",

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
        title: "游记",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "youji.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#76C951",
        customBg: "#76C951",

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
        title: "购物",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "gouwu.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#6EDCFE",
        customBg: "#6EDCFE",

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
        defaultIcon: "sousuo.svg",
        customIcon: "",

        bgModel: "default",
        defaultBg: "#FFC72E",
        customBg: "#FFC72E",
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

    onMounted(() => {
      store.selectMofangNav(initData, props.compId);
    });

    // 设置图标 背景
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

    return {
      editNav,
      initData,
      setParams,
      setjump,
    };
  },
};
</script>

<style lang="less" scoped>
.nav-list-1 {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  .nav-item {
    padding: 6px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(100% / 5);
    border: 1px solid transparent;
    box-sizing: border-box;
    margin-bottom: 15px;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:hover {
      border-color: #5874d8;
    }

    .icon-bg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 50%;
        height: 50%;
      }
    }
    p {
      margin-top: 10px;
      font-size: 12px;
      text-align: center;
      color: #333;
    }
  }
}
</style>
