<template>
  <div class="pageWrap" v-if="loading">
    <HeaderNav />
    <div class="container-box">
      <div class="left-menu">
        <leftMenu />
      </div>
      <div class="center-show" @click="clearContent">
        <CenterShow />
      </div>
      <div class="right-edit">
        <RightMenu />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { siteData } from "./store";
import LeftMenu from "./components/leftMenu/index.vue";
import RightMenu from "./components/rightSetting/index.vue";
import CenterShow from "./components/centerShow.vue";
import HeaderNav from "./components/headerNav.vue";
import { initPageData, initfooterNav } from "./initData";
import { reactive, nextTick, ref, watch } from "vue";
import {
  getMicweb,
  getMicwebPage,
  saveMicwebPabe,
  saveFooterTabBar,
} from "/@/api/microweb/webeditor";
import { useRoute } from "vue-router";

import _ from "lodash";
export default {
  name: "index",
  components: {
    LeftMenu,
    RightMenu,
    CenterShow,
    HeaderNav,
  },
  setup() {
    const loading = ref(false);
    const position = reactive({
      leftTopX: 0,
      leftTopY: 0,
      rightBottoX: 0,
      rightBottoY: 0,
    });
    const store = siteData();
    const route = useRoute();

    const getContent = () => {
      const phone = document.getElementsByClassName("phone-content")[0];
      const { width, height, x, y } = phone.getBoundingClientRect();
      position.leftTopX = x;
      position.leftTopY = y;
      position.rightBottoX = x + width;
      position.rightBottoY = y + height;
    };

    const clearContent = (e) => {
      const { clientX, clientY } = e;
      if (
        !(
          clientX >= position.leftTopX &&
          clientX <= position.rightBottoX &&
          clientY >= position.leftTopY &&
          clientY <= position.rightBottoY
        )
      ) {
        store.editMode = "";
        store.activeComponentId = "";
      }
    };

    const getSiteInfo = async () => {
      let params = {};
      const { id } = route.query;
      if (id) {
        params["tplid"] = id;
      }
      const res = await getMicweb(params);
      const { footer_tabbar, pagelist, id: microwebId, title } = res;
      if (_.isArray(pagelist) && _.size(pagelist) === 0) {
        // 页面为空，初始化一个页面并重新请求页面列表
        await saveMicwebPabe(initPageData);
        getSiteInfo();
      } else {
        // 获取第一个页面数据
        pagelist.forEach((item) => {
          store.pageList.push(item);
        });
        const { id, uuid } = pagelist[0];
        let pageInfo = await getMicwebPage({ uuid: uuid, micweb_id: microwebId });
        _.keys(pageInfo).forEach((key) => {
          store.pageConfig[key] = pageInfo[key];
        });
        store.activePageId = id;
      }

      // 底部导航为空，初始化五个
      if (footer_tabbar === null || _.size(footer_tabbar) === 0) {
        await saveFooterTabBar({
          id: microwebId,
          footer_tabbar: initfooterNav,
        });
      } else {
        _.keys(footer_tabbar).forEach((key) => {
          store.navList[key] = footer_tabbar[key];
        });
      }
      store.micwebInfo["id"] = microwebId;
      store.micwebInfo["title"] = title;
      loading.value = true;
    };

    getSiteInfo();

    watch(loading, (val) => {
      if (val) {
        nextTick(() => {
          getContent();
        });
      }
    });

    return {
      clearContent,
      loading,
    };
  },
};
</script>

<style lang="less">
@import "./assets/iconFont/iconfont.css";
@import "./assets/reset.css";

.active-flex {
  position: relative;
  border-color: #5874d8 !important;
  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    content: "";
    width: 28px;
    height: 24px;
    background-image: url("./assets/images/icon-list.png");
    background-repeat: no-repeat;
    background-position: -135px -28px;
  }
}

// 多选方框
.check-box {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #333;
  user-select: none;
  cursor: pointer;
  &.active {
    span::after {
      content: "";
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 16px;
      height: 16px;
      background-image: url("./assets/images/icon-list.png");
      background-position: -516px 1px;
    }
  }
  span {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #d0d4d7;
    border-radius: 1px;
    margin-right: 10px;
  }
}

// 单选圆点
.radio {
  display: flex;
  align-items: center;
  margin-right: 15px;
  user-select: none;
  cursor: pointer;
  > span {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #d8d8d8;
    border-radius: 50%;
    margin-right: 6px;
    &::after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      content: "";
      display: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #828282;
    }
  }
  &.active > span::after {
    display: block;
  }
}

// 表单行
.form-item {
  display: flex;
  margin-bottom: 20px;
  .title {
    width: 70px;
    text-align: right;
    margin-right: 10px;
    line-height: 30px;
  }
  .title-text {
    border: 1px solid #e3e2e8;
    color: #333;
    height: 30px;
    text-overflow: ellipsis;
    border-radius: 2px;
    padding: 0 8px;
    box-sizing: border-box;
    font-size: 13px;
    margin-right: 15px;
  }
}
</style>

<style lang="less" scoped>
.pageWrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 60px;
  .container-box {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background-color: rgb(230, 230, 230);

    .left-menu {
      width: 400px;
      height: 100%;
      background-color: #fff;
    }
    .center-show {
      position: relative;
      flex: 1;
      height: 100%;
    }
    .right-edit {
      width: 454px;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
