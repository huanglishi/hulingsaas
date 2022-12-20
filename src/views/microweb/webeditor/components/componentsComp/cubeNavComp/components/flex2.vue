<template>
  <ul class="nav-list-2">
    <li
      class="nav-item"
      v-for="(item, index) in initData"
      :key="index"
      :style="{
        backgroundColor: setParams(item, 'bgModel', 'defaultBg', 'customBg'),
      }"
      @click.stop="editNav(item)"
    >
      <a
        :href="setjump(item)"
        style="pointer-events: none"
        :class="`flex-use-${item.flexUse}`"
      >
        <div class="titles">
          <p
            v-if="!item.hideTitle"
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
            {{ item.title }}
          </p>
          <p
            v-if="!item.hideSubtitle"
            :style="{
              'font-weight':
                item.subtitlefontWeight && item.subtitleStyle === 'custom'
                  ? 700
                  : 'normal',
              'text-decoration':
                item.subtitleOutLine && item.subtitleStyle === 'custom'
                  ? 'underline'
                  : 'none',
              color:
                item.subtitleStyle === 'custom'
                  ? item.subtitleColor
                  : item.defaultSubtitleColor,
              'font-size':
                item.subtitleStyle === 'custom'
                  ? `${item.subtitleFontSize}px`
                  : `${item.defaultSubtitleFontSize}px`,
            }"
          >
            {{ item.subtitle }}
          </p>
        </div>
        <div class="icon-bg">
          <template v-if="item.iconModel !== 'hide'">
            <img
              :src="setParams(item, 'iconModel', 'defaultIcon', 'customIcon')"
              alt=""
            />
          </template>
        </div>
      </a>
    </li>
  </ul>
</template>

<script>
import { siteData } from "../../.././../store/index";
import { reactive, onMounted } from "vue";
import _ from "lodash";
export default {
  name: "flex2",
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
        title: "公司概况",
        hideTitle: false,
        subtitle: "ABOUT US",
        hideSubtitle: false,
        iconModel: "default",
        defaultIcon: "gongsigaikuang.svg",
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

        flexUse: 1,

        titleStyle: "default",
        titleFontSize: 12,
        defaultFontSize: 12,
        titleColor: "",
        defaultTitleColor: "#fff",
        titlefontWeight: false,
        titleOutLine: false,

        subtitleStyle: "default",
        subtitleFontSize: 12,
        defaultSubtitleFontSize: 12,
        subtitleColor: "",
        defaultSubtitleColor: "#fff",
        subtitlefontWeight: false,
        subtitleOutLine: false,

        id: _.uniqueId("nav_"),
      },

      {
        title: "新闻资讯",
        hideTitle: false,
        subtitle: "NEWS",
        hideSubtitle: false,
        iconModel: "default",
        defaultIcon: "xinwenzixun.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#34CFEE",
        customBg: "#34CFEE",

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

        subtitleStyle: "default",
        subtitleFontSize: 12,
        defaultSubtitleFontSize: 12,
        subtitleColor: "",
        defaultSubtitleColor: "#fff",
        subtitlefontWeight: false,
        subtitleOutLine: false,

        id: _.uniqueId("nav_"),
      },

      {
        title: "在线服务",
        hideTitle: false,
        subtitle: "OL SERVICE",
        hideSubtitle: false,
        iconModel: "default",
        defaultIcon: "zaixianfuwu.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#FC562E",
        customBg: "#FC562E",

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

        subtitleStyle: "default",
        subtitleFontSize: 12,
        defaultSubtitleFontSize: 12,
        subtitleColor: "",
        defaultSubtitleColor: "#fff",
        subtitlefontWeight: false,
        subtitleOutLine: false,

        id: _.uniqueId("nav_"),
      },

      {
        title: "更多服务",
        hideTitle: false,
        subtitle: "SERVICE",
        hideSubtitle: false,
        iconModel: "default",
        defaultIcon: "gengduofuwu.svg",
        customIcon: "",
        bgModel: "default",
        defaultBg: "#424446",
        customBg: "#424446",

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

        subtitleStyle: "default",
        subtitleFontSize: 12,
        defaultSubtitleFontSize: 12,
        subtitleColor: "",
        defaultSubtitleColor: "#fff",
        subtitlefontWeight: false,
        subtitleOutLine: false,

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
      editNav,
      setParams,
      setjump,
    };
  },
};
</script>

<style lang="less" scoped>
.nav-list-2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px 0;
  .nav-item {
    display: flex;
    flex-direction: column;
    width: calc(50% - 16px);
    background-color: gray;
    margin: 8px 8px;
    box-sizing: border-box;
    border: 1px solid transparent;
    height: 100px;

    a {
      display: flex;
      width: 100%;
      height: 100%;
      .icon-bg {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        height: 30px;
        img {
          width: 30px;
          height: 30px;
        }
      }
      &.flex-use-1 {
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        padding: 15px;
        box-sizing: border-box;
        .titles {
          width: 100%;
          p {
            text-align: left;
          }
        }
        .icon-bg {
          display: flex;
          align-items: flex-end;
          width: 100%;
        }
      }

      &.flex-use-2 {
        justify-content: space-between;
        align-items: center;
        flex-direction: column-reverse;
        padding: 10px 0;
        box-sizing: border-box;
        .icon-bg {
          margin-bottom: 20px;
        }
      }

      &.flex-use-3 {
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        box-sizing: border-box;
        .icon-bg {
          margin-top: 20px;
        }
      }

      &.flex-use-4 {
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: center;
        padding: 30px 10px;
        box-sizing: border-box;
        p {
          text-align: right;
        }
      }

      &.flex-use-5 {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 30px 10px;
        box-sizing: border-box;
        p {
          text-align: left;
        }
      }
    }

    &:hover {
      border-color: #5874d8;
    }

    .titles {
      p {
        color: #fff;
        &:nth-of-type(1) {
          font-size: 15px;
          margin-bottom: 4px;
        }
        &:nth-of-type(2) {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
