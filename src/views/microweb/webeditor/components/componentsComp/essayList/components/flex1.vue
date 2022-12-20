<template>
  <div class="wrapper">
    <div
      class="top-image"
      v-if="datas.headerstyle === 2"
      @click.stop="jumpDetail(topImg.value)"
    >
      <img :src="ReplaceUrl(topImg.value.image)" alt="" />
      <div class="essay-title">{{ topImg.value.title }}</div>
    </div>

    <div class="list" :class="`list-${datas.arrangeUse}`" v-if="list.value.length">
      <div
        class="item"
        v-for="item in list.value"
        :key="item.id"
        @click.stop="jumpDetail(item)"
      >
        <a>{{ item.title }}</a>
        <p class="content" v-if="datas.showContent && item.des">{{ item.des }}</p>
        <div class="essay-info">
          <p class="author" v-if="datas.showAuthor">{{ item.author }}</p>
          <p
            class="classify"
            v-if="datas.showEssayClassify && item.catename && item.catename[0]"
          >
            {{ item.catename[0] }}
          </p>
          <p class="time" v-if="datas.showPublishTime">
            {{ day.unix(item.releasetime).format("YYYY/MM/DD") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watch } from "vue";
import _ from "lodash-es";
import { ReplaceUrl } from "/@/utils/imgurl";
import day from "dayjs";

export default {
  name: "flex1",
  props: {
    datas: Object,
  },
  setup(props) {
    const list = reactive({ value: [] }); // 列表内容
    const topImg = reactive({ value: {} }); // 顶部大图

    const jumpDetail = ({ id }) => {
      history.pushState(
        {},
        "",
        `${location.href}?type=page&compName=essayDetail&id=${id}`
      );
    };

    watch(
      () => props.datas,
      (val) => {
        const headerstyle = val.headerstyle;
        const essayList = val.essayList;
        list.value = [];
        topImg.value = {};
        if (headerstyle === 2) {
          // 顶部大图模式
          topImg.value = essayList[0];
          list.value = essayList.slice(1);
        } else {
          list.value = essayList;
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return {
      topImg,
      list,
      ReplaceUrl,
      day,
      jumpDetail,
    };
  },
};
</script>

<style lang="less" scoped>
.list {
  padding: 0 15px 15px;
  box-sizing: border-box;
}
.wrapper {
  padding: 15px 0;
}
.top-image {
  position: relative;
  display: block;
  width: 340px;
  height: 170px;
  background-color: rgb(233, 233, 233);
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
  .essay-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #ffff;
    padding: 10px 5px;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    z-index: 999;
  }
  .img {
    width: 100%;
  }
}
.list-1 {
  padding-top: 10px;
  .item {
    display: block;
    &:not(:first-of-type) {
      padding-top: 15px;
      border-top: 1px solid rgb(228, 228, 228);
    }
    margin-bottom: 15px;
    a {
      display: block;
      width: 100%;
      font-size: 15px;
      color: #222;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .content {
      font-size: 13px;
      line-height: 20px;
      margin-top: 10px;
      color: #848e98;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

.essay-info {
  display: flex;
  align-items: center;
  .author,
  .classify,
  .time {
    color: #848e98;
    font-size: 12px;
    margin-top: 10px;
  }
  .classify,
  .author {
    margin-right: 6px;
  }
}
.list-2 {
  display: flex;
  flex-wrap: wrap;
  .item {
    display: block;
    flex: 0 0 50%;
    padding: 8px 6px;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(228, 228, 228);

    &:nth-of-type(odd) {
      border-right: 1px solid rgb(228, 228, 228);
    }

    &:nth-of-type(1):nth-of-type(2) {
      border-top: 1px solid rgb(228, 228, 228);
    }

    a {
      font-size: 15px;
      color: #333;
      line-height: 20px;
      margin-bottom: 10px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .content {
      color: #848e98;
      font-size: 13px;
      line-height: 18px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
