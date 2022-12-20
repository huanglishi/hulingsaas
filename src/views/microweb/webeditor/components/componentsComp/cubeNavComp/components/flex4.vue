<template>
  <ul class="nav-list">
    <li
      v-for="(item, index) in initData"
      :key="index"
      :style="{
        width: `${calcWidth(index)}%`,
      }"
      @click.stop="editNav(item)"
    >
      <a
        :href="setjump(item)"
        style="pointer-events: none"
        class="content"
        :class="`flex-use-${item.flexUse}`"
        :style="{
          backgroundColor: setParams(item, 'bgModel', 'defaultBg', 'customBg'),
        }"
      >
        <div class="icon-bg">
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
          {{ !item.hideTitle ? item.title : "" }}
        </p>
      </a>
    </li>
  </ul>
</template>

<script>
import { siteData } from "../../.././../store/index";
import { reactive, ref, onMounted } from "vue";
import _ from "lodash";
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
        title: "服务中心",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "fuwuzhongxin.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#404040",
        customBg: "#404040",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        flexUse: 1,

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "",
        defaultTitleColor: "#fff",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },

      {
        title: "成功案例",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "chenggonganli.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#404040",
        customBg: "#404040",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        flexUse: 1,

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "",
        defaultTitleColor: "#fff",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "日程安排",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "richenganpai.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#404040",
        customBg: "#404040",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        flexUse: 1,

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "",
        defaultTitleColor: "#fff",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "新闻资讯",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "xinwenzixun.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#404040",
        customBg: "#404040",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        flexUse: 1,

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "",
        defaultTitleColor: "#fff",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "企业文化",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "qiyewenhua.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#404040",
        customBg: "#404040",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        flexUse: 1,

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "",
        defaultTitleColor: "#fff",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
      {
        title: "搜索查询",
        hideTitle: false,
        iconModel: "default",
        defaultIcon: "sousuochaxun.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#404040",
        customBg: "#404040",

        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },

        flexUse: 1,

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "",
        defaultTitleColor: "#fff",
        titlefontWeight: false,
        titleOutLine: false,
        id: _.uniqueId("nav_"),
      },
    ]);
    const len = ref(initData.length);
    const remainder = ref(len.value % 3);
    onMounted(() => {
      store.selectMofangNav(initData, props.compId);
    });
    // 计算占比
    const calcWidth = (index) => {
      if (len.value <= 3) {
        // 数量小于3个
        if (len.value === 3) return 100 / 3;
        if (len.value === 2) return 50;
        if (len.value === 1) return 100;
        if (len.value === 0) return 0;
      } else {
        // 数量大于3个
        if (len.value - remainder.value - 1 >= index) {
          return 100 / 3;
        } else {
          return remainder.value === 1 ? 100 : 50;
        }
      }
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

    const editNav = (item) => {
      store.activeComponentId = props.compId;
      store.editMofangNav(item.id);
    };

    return {
      calcWidth,
      initData,
      setParams,
      setjump,
      editNav,
    };
  },
};
</script>

<style lang="less" scoped>
.nav-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 5px;
  li {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 110px;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid transparent;

    &:hover {
      border-color: #5874d8;
    }
    .content {
      display: flex;
      width: 100%;
      height: 100%;

      &.flex-use-1 {
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .icon-bg {
          margin-bottom: 15px;
        }
      }

      &.flex-use-2 {
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        padding: 10px 0;
        box-sizing: border-box;
      }

      &.flex-use-3 {
        flex-direction: column-reverse;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        box-sizing: border-box;
      }

      &.flex-use-4 {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        p {
          text-align: right;
        }
      }

      &.flex-use-5 {
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        p {
          text-align: left;
        }
      }
    }
    .icon-bg {
      display: inline-block;
      width: 26px;
      height: 26px;
      font-size: 30px;
      color: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      width: 80%;
      font-size: 13px;
      text-align: center;
      z-index: 1;
      margin: 0;
      color: #fff;
    }
  }
}
</style>
