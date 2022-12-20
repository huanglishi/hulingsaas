<template>
  <nav
    class="headerNav"
    :style="{
      height: `${pageConfig.templateJson.headerConfig.headerHeight}px`,
    }"
  >
    <div class="leftBtn">
      <i
        class="iconfont icon-jiantou-zuo"
        v-if="pageConfig.templateJson.headerConfig.showLeftBtn && pageConfig.ishome !== 1"
        :style="{
          fontSize: `${pageConfig.templateJson.headerConfig.backBtnFontSize}px`,
        }"
      ></i>
    </div>
    <p class="pageName">{{ pageConfig.name }}</p>
    <div class="rightBtn">
      <span
        class="text"
        v-if="pageConfig.templateJson.headerConfig.showRightBtn"
        :style="{
          color: pageConfig.templateJson.headerConfig.rightTextColor,
          fontSize: `${pageConfig.templateJson.headerConfig.rightTextFontSize}px`,
        }"
        >{{ pageConfig.templateJson.headerConfig.rightText }}</span
      >
    </div>
  </nav>
</template>

<script>
export default {
  name: "pageHeaderNav",
  props: {
    pageConfig: Object,
  },
};
</script>

<style lang="less" scoped>
.headerNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 40px;
  border-bottom: 1px solid rgb(234, 234, 234);
  .pageName {
    display: inline-block;
    flex: 1;
    font-size: 18px;
    margin: 0;
    text-align: center;
  }
  .leftBtn,
  .rightBtn {
    width: 60px;
    font-size: 14px;
    color: blue;
    white-space: nowrap;
    overflow: hidden;
  }
  .rightBtn {
    text-align: right;
  }
}
</style>
