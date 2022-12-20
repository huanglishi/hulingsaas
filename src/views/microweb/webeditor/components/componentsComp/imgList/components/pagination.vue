<template>
  <div class="page">
    <i class="iconfont icon-jiantou-zuo" @click.stop="changePage('minus')"></i>
    <div class="page-num">
      <span>{{ curPage }}</span>
      /
      <span>{{ pageAll }}</span>
    </div>
    <i class="right iconfont icon-jiantou-zuo" @click.stop="changePage('add')"></i>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    curPage: Number,
    pageAll: Number,
  },
  setup(props, { emit }) {
    const changePage = (type) => {
      let value = 0;
      switch (type) {
        case "add":
          if (props.curPage === props.pageAll) return;
          value = props.curPage + 1;
          break;
        case "minus":
          if (props.curPage === 1) return;
          value = props.curPage - 1;
          break;
      }
      emit("change", value);
    };

    return {
      changePage,
    };
  },
};
</script>

<style lang="less" scoped>
.page {
  display: flex;
  justify-content: center;
  padding: 15px 0 24px;
  i {
    font-size: 16px;
    color: #666;
    &.iconfont {
      color: #333;
    }
    &.right {
      transform: rotate(180deg);
    }
  }
  .page-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26%;
    font-size: 16px;
    color: #666;
    span {
      padding: 0 6px;
      &:nth-of-type(1) {
        color: #ff7214;
      }
    }
  }
}
</style>
