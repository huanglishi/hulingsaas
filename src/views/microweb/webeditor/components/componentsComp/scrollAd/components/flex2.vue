<template>
  <div class="wrapper">
    <img class="icon" v-if="iconUrl != ''" :src="iconUrl" alt="" />
    <div class="text">
      <div
        class="scroll-contents"
        :style="{
          'animation-duration': `${scrollTime}s`,
        }"
      >
        <span class="empty"></span>
        <a v-for="item in config.notice" :href="item.url" :key="item.id">{{
          item.content
        }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, computed, reactive, ref, watch } from "vue";
export default {
  name: "flex2",
  props: {
    config: Object,
  },
  setup(props) {
    const scrollStyle = reactive({});
    const scrollTime = ref(0);

    const iconUrl = computed(() => {
      if (props.config.iconStyle === 0) return "";
      return new URL(
        `../../../../assets/images/noticeIco${props.config.iconStyle}.gif`,
        import.meta.url
      ).href;
    });

    // 计算滚动时间
    const calcScrollTime = () => {
      const scrollContent = document.getElementsByClassName("scroll-contents")[0];
      const { width } = scrollContent.getBoundingClientRect();
      scrollTime.value = (width / 100) * 3; // 每100px滚动3s
    };

    // 计算滚动时间
    nextTick(() => calcScrollTime());

    watch(
      () => props.config.notice,
      (val) => {
        calcScrollTime();
      },
      { deep: true }
    );

    return {
      iconUrl,
      scrollTime,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  padding: 10px 0;
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  .text {
    display: inline-block;
    width: calc(100% - 25px);
    overflow: hidden;

    .scroll-contents {
      display: inline-block;
      white-space: nowrap;
      animation-timing-function: linear;
      animation-name: notice-scroll;
      animation-iteration-count: infinite;
      animation-delay: 0.3s;
      .empty {
        display: inline-block;
        width: 350px;
      }
      a {
        display: inline-block;
        padding-left: 15px;
        color: #333;
        font-size: 15px;
        line-height: 20px;
        white-space: nowrap;
      }
    }
  }
}

@keyframes notice-scroll {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}
</style>
