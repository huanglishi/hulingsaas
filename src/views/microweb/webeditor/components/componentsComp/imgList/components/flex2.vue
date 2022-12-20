<template>
  <div>
    <ul class="list-wrapper" :class="`img-position-${datas.moduleStyle.imgPosition}`">
      <li v-for="item in curImgList" :key="item.id">
        <div class="img-wrap">
          <img :src="item.imgUrl" alt="" />
        </div>
        <div class="text">
          <p class="name">{{ item.name }}</p>
          <p class="detail">{{ item.detail }}</p>
        </div>
      </li>
    </ul>

    <pagination :curPage="curIdx" :pageAll="len" @change="(res) => (curIdx = res)" />
  </div>
</template>

<script>
import _ from "lodash-es";
import { ref, computed, reactive } from "vue";
import pagination from "./pagination.vue";
export default {
  name: "flex2",
  props: {
    datas: {
      type: Object,
      default: () => [],
    },
  },
  components: {
    pagination,
  },
  setup(props) {
    const len = ref(0); // 拆分以后的图片长度
    const curIdx = ref(1); // 页码
    const list = reactive({ list: [] }); // 图片列表

    list.list = _.chunk(props.datas.imgList, 4);
    len.value = _.size(list.list);

    // 当前展示的图片列表
    const curImgList = computed(() => list.list[curIdx.value - 1]);

    return {
      curIdx,
      len,
      curImgList,
    };
  },
};
</script>

<style lang="less" scoped>
.list-wrapper {
  padding: 15px;
}
.text {
  width: 60%;
  padding: 5px 10px 10px 0;
  .name {
    font-size: 15px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .detail {
    margin-top: 10px;
    color: rgb(102, 102, 102);
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.img-position-right,
.img-position-left {
  li {
    display: flex;
    width: 100%;
    margin-bottom: 15px;
    .img-wrap {
      width: 130px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 5px;
    }
    img {
      width: 100%;
    }
    &:not(:first-of-type) {
      border-top: 1px solid #94949430;
      padding-top: 20px;
    }
  }
}
.img-position-right li {
  flex-direction: row-reverse !important;
}
</style>
