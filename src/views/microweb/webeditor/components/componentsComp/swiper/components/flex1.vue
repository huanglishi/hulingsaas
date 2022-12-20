<template>
  <div class="wrapper">
    <swipe class="my-swipe" :autoplay="3000" indicator-color="white" :loop="true">
      <swipe-item v-for="item in datas.imgList" :key="item.id">
        <a class="item-content" :href="disposeJump(item)">
          <img :src="item.imgUrl" alt="" />
          <div
            class="footer-text"
            v-if="
              (datas.showImgName || datas.showImgDetail) && (item.name || item.detail)
            "
          >
            <p class="title" v-if="item.name && datas.showImgName">{{ item.name }}</p>
            <p class="content" v-if="item.detail && datas.showImgDetail">
              {{ item.detail }}
            </p>
          </div>
        </a>
      </swipe-item>
    </swipe>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "vant";
import { disposeJump } from "../../../../utils";
export default {
  name: "flex1",
  components: {
    Swipe,
    SwipeItem,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    return {
      disposeJump,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
}
.my-swipe {
  .item-content {
    position: relative;
    display: block;
    height: 300px;
    overflow: hidden;
    img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .footer-text {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0px;
      padding: 10px;
      color: #fff;
      background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.6));
      .title {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .content {
        font-size: 12px;
      }
      .title,
      .content {
        display: block;
        width: 70%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  ::v-deep .van-swipe__indicators {
    left: auto;
    right: 20px;
  }
}
</style>
