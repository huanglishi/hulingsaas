<template>
  <div class="wrapper">
    <!-- 大图模式 -->
    <div
      class="top-image"
      v-if="datas.headerstyle === 2"
      @click.stop="jumpDetail(topImg.value)"
    >
      <img :src="ReplaceUrl(topImg.value.image)" alt="" />
      <div class="essat-title" v-if="topImg.value.title">{{ topImg.value.title }}</div>
    </div>

    <!-- 三图模式（暂时不添加） -->
    <div class="three-image" v-if="datas.headerstyle === 3">
      <p class="essay-title">随便吧</p>
      <div class="image-list">
        <div class="img" v-for="item in 3">
          <img src="" alt="" />
        </div>
      </div>
      <p class="essay-content">djakjdlkajskdasjkdlasjl</p>
      <div class="essay-info">
        <p class="author">不知道</p>
        <p class="classify">全部</p>
        <p class="time">2019/11/20</p>
      </div>
    </div>

    <div class="list">
      <div
        @click.stop="jumpDetail(item)"
        class="item"
        v-for="item in list.value"
        :key="item.id"
        :class="{ reverse: datas.imgPosition === 'right' }"
      >
        <img :src="ReplaceUrl(item.image)" alt="" />
        <div class="info">
          <p class="title">{{ item.title }}</p>
          <p class="content" v-if="item.title && datas.showContent">{{ item.des }}</p>
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
  </div>
</template>

<script>
import { computed, reactive, watch } from "vue";
import _ from "lodash-es";
import { ReplaceUrl } from "/@/utils/imgurl";
import day from "dayjs";
export default {
  name: "flex2",
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
  .essat-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #ffff;
    padding: 10px 5px;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  }
}
.three-image {
  display: block;
  padding: 0 15px;
  .essay-title {
    font-size: 15px;
    color: #222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .image-list {
    display: flex;
    margin: 8px 0;
    .img {
      width: 110px;
      height: 82px;
      background-color: gray;
      overflow: hidden;
      &:nth-of-type(2) {
        margin: 0 6px;
      }
      img {
        width: 100%;
      }
    }
  }
  .essay-content {
    font-size: 14px;
    line-height: 18px;
    color: #848e98;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.list {
  padding: 0 15px;
  .item {
    display: flex;
    padding: 15px 0;
    &.reverse {
      flex-direction: row-reverse;
    }
    &:not(:first-of-type) {
      border-top: 1px solid rgb(228, 228, 228);
    }

    img {
      width: 94px;
      height: 70px;
    }
    .info {
      flex: 1;
      padding-left: 10px;
      box-sizing: border-box;
      .title {
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
        color: #848e98;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 10px;
      }
    }
  }
}

.essay-info {
  display: flex;
  align-items: center;
  margin-top: 10px;

  .author,
  .classify,
  .time {
    color: #848e98;
    font-size: 12px;
    margin-right: 6px;
  }
}
</style>
