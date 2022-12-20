<template>
  <!-- 直接播放 -->
  <div
    class="wrapper"
    :style="{
      height: datas.playUse === 'play' ? 'auto' : '180px',
    }"
  >
    <video
      class="video"
      controls
      v-if="datas.playUse === 'play'"
      :loop="datas.loop"
      :poster="
        datas.customVideImg && datas.customVideoMainImg
          ? datas.customVideoMainImg
          : datas.videoMainImg
      "
    >
      <source :src="datas.videoUrl" />
    </video>

    <div
      v-if="datas.playUse === 'modal'"
      class="bg"
      :style="{
        'background-image': `url(${
          datas.customVideImg && datas.customVideoMainImg
            ? datas.customVideoMainImg
            : datas.videoMainImg
        })`,
      }"
    >
      <div class="icon" @click="controlVideo(true)">
        <i class="iconfont icon-icon_play"></i>
      </div>
    </div>
  </div>

  <!-- 弹层播放 -->
  <div class="play-video" v-if="openVide && datas.playUse === 'modal'">
    <span class="icon" @click="controlVideo(false)">
      <i class="iconfont icon-guanbi"></i>
    </span>
    <div class="video-content">
      <video
        class="video"
        controls
        :loop="datas.loop"
        :poster="datas.customVideImg ? datas.customVideoMainImg : datas.videoMainImg"
      >
        <source :src="datas.videoUrl" />
      </video>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "onlineVideo",
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const openVide = ref(false);

    const controlVideo = (val) => {
      openVide.value = val;
    };

    return {
      openVide,
      controlVideo,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  .bg {
    position: relative;
    height: 100%;
    background-image: url("https://28065906.s142i.faiusr.com/2/AI4BCPKAsQ0QAhgAIJyhh5sGKKy09ZUDMIAKONAF!640x640.jpg.webp");
    background-size: cover;
    background-repeat: no-repeat;
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.4);
      text-align: center;
      i {
        color: #fff;
        line-height: 50px;
        font-size: 23px;
      }
    }
  }
}
.play-video {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 999;
  background-color: #000;
  .icon {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    i {
      color: #fff;
      line-height: 30px;
      font-size: 24px;
    }
  }
  .video-content {
    width: 100%;
    height: auto;
  }
}
video {
  width: 100%;
  height: 100%;
}
</style>
