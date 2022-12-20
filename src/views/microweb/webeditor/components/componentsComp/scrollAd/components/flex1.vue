<template>
  <div class="style-1">
    <div
      v-if="config.iconStyle === 1"
      class="icon-1"
      :style="{
        backgroundColor: config.color,
      }"
    >
      公告
    </div>

    <div
      v-else-if="config.iconStyle === 2"
      class="icon-2"
      :style="{
        backgroundColor: config.color,
      }"
    >
      <i class="iconfont icon-laba"></i>
    </div>

    <div
      v-else-if="config.iconStyle === 3"
      class="icon-3"
      :style="{
        borderColor: config.color,
        color: config.color,
      }"
    >
      公告
    </div>

    <div class="icon-4" v-else>
      <i
        class="iconfont icon-yangshengqi"
        :style="{
          color: config.color,
        }"
      ></i>
    </div>

    <van-swipe class="scroll-wrapper" :autoplay="2500" vertical>
      <van-swipe-item class="notice-list" v-for="(item, index) in adList" :key="index">
        <a v-for="ad in item" :href="ad.url" :key="ad.id">
          {{ ad.content }}
        </a>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from "vue";
import _ from "lodash";
export default {
  name: "flex1",
  props: {
    config: Object,
  },
  setup(props) {
    const adList = computed(() => _.chunk(props.config.notice, 2));

    return {
      adList,
    };
  },
};
</script>

<style lang="less" scoped>
.scroll-wrapper {
  height: 60px;
  overflow: hidden;
  .notice-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 60px !important;
    padding: 10px 0 10px 20px;
    a {
      position: relative;
      color: #333;

      &:nth-of-type(2) {
        margin-top: 10px;
      }

      &::before {
        position: absolute;
        top: 50%;
        left: -10px;
        transform: translateY(-50%);
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #333;
        z-index: 999;
      }
    }
  }
  ::v-deep .van-swipe__indicators {
    display: none !important;
  }
}
.style-1 {
  display: flex;
  align-items: center;
  padding: 0 14px;
  background-color: #fff;
  .icon-1,
  .icon-2,
  .icon-3,
  .icon-4 {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
  }
  .icon-1 {
    background-color: #ff7214;
    border-radius: 4px;
    font-size: 16px;
    color: #fff;
  }

  .icon-2 {
    background-color: #ff7214;
    border-radius: 4px;
    font-size: 16px;
    color: #fff;
    i {
      font-size: 20px;
      color: #fff;
    }
  }

  .icon-3 {
    border: 1px solid #ff7214;
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 16px;
    color: #ff7214;
  }

  .icon-4 {
    font-size: 16px;
    i {
      color: #ff7214;
      font-size: 28px;
    }
  }
}
</style>
