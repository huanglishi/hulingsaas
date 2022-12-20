<template>
  <div class="wrapper">
    <nav class="headerNav">
      <div class="leftBtn" @click="back">
        <i class="iconfont icon-jiantou-zuo"></i>
      </div>
      <div class="rightBtn">
        <i class="iconfont icon-home" @click="jumpHome"></i>
      </div>
    </nav>

    <div class="content">
      <h1>{{ essayContent.value.title }}</h1>
      <div class="essay-info">
        <p class="author">{{ essayContent.value.author }}</p>
        <p class="time">
          {{ day.unix(essayContent.value.releasetime).format("YYYY/MM/DD") }}
        </p>
      </div>
      <div v-html="essayContent.value.content"></div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { getEssayDetailById } from "/@/api/microweb/webeditor";
import day from "dayjs";
import { parseUrlParams } from "../utils";

export default {
  name: "essayDetail",
  setup() {
    const essayContent = reactive({ value: {} });
    const router = useRoute();
    const { id } = parseUrlParams(location.href.split("?")[1]);

    if (id) {
      getEssayDetailById({ id }).then((res) => {
        console.log(res);
        essayContent.value = res;
      });
    }

    const back = () => {
      history.back();
    };

    const jumpHome = () => {
      location.href = `${location.href.split("?")[0]}`;
    };

    return {
      essayContent,
      day,
      jumpHome,
      back,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .headerNav {
    display: flex;
    justify-content: space-between;
    line-height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid rgb(238, 238, 238);
  }
  .content {
    flex: 1;
    overflow: auto;
    padding: 20px 10px;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      display: none;
    }
    > h1 {
      font-size: 18px;
      margin-bottom: 15px;
      font-weight: 700;
    }
    .essay-info {
      display: flex;
      margin-bottom: 20px;
      p {
        font-size: 13px;
        color: #b3b3b3;
        margin-right: 10px;
      }
    }
  }
}
</style>
