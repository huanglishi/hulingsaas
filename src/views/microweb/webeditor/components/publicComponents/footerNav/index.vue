<!-- 底部导航 -->
<template>
  <ul :class="['footer-nav', editMode === 'footerNav' ? 'active' : '']" @click="edit">
    <li class="nav-item" v-for="(item, index) in navList.navs" :key="index">
      <a style="pointer-events: none">
        <template v-if="item.isActive"> </template>
        <img :src="matchIcon(item)" />
        <p
          :style="{
            color: item.isActive ? navList.activeTextColor : navList.defaultTextColor,
          }"
        >
          {{ item.navName }}
        </p>
      </a>
    </li>
  </ul>
</template>

<script>
import { siteData } from "../../../store";
import { storeToRefs } from "pinia";
import _ from "lodash-es";
export default {
  name: "footerNav",
  setup() {
    const store = siteData();
    const { getCurPageConfig, editMode, navList } = storeToRefs(store);
    const edit = () => {
      store.editNav();
    };

    // 匹配对应的图标
    const matchIcon = (item) => {
      const { isActive, icon, activeIcon } = item;

      if (isActive) {
        return _.startsWith(activeIcon, "http")
          ? activeIcon
          : new URL(`../../../assets/images/${activeIcon}`, import.meta.url).href;
      } else {
        return _.startsWith(icon, "http")
          ? icon
          : new URL(`../../../assets/images/${icon}`, import.meta.url).href;
      }
    };

    return {
      getCurPageConfig,
      edit,
      editMode,
      navList,
      matchIcon,
    };
  },
};
</script>

<style lang="less" scoped>
.footer-nav {
  display: flex;
  background-color: #fff;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-top-color: rgba(235, 235, 235, 0.74);
  padding: 6px 0;
  .nav-item {
    flex: 1;
    cursor: pointer;
    a {
      display: block;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    }
    img {
      width: 16px;
      height: 16px;
    }
    p {
      font-size: 12px;
      margin-top: 4px;
    }
  }
  &.active,
  &:hover {
    border-style: dashed;
    border-width: 1px;
    border-color: #5874d8;
  }
}
</style>
