<template>
  <div>
    <ul class="list-wrapper" :class="`list-${datas.moduleStyle.columnNum}`">
      <li v-for="item in curImgList" :key="item.id">
        <div class="img-wrapper">
          <img :src="item.imgUrl" alt="" />
        </div>
        <div class="text">
          <p class="name" v-if="datas.moduleStyle.showImgName &&  item.name !== ''">{{ item.name }}</p>
          <p class="detail" v-if="datas.moduleStyle.showImgDetail && item.detail !== ''">{{ item.detail }}</p>
        </div>
      </li>
    </ul>

    <pagination :curPage="curIdx" :pageAll="len" @change="(res) => (curIdx = res)" />
  </div>
</template>

<script lang="ts">
import _ from "lodash-es";
import { computed, reactive, ref, watch } from "vue";
import pagination from "./pagination.vue";
export default {
  name: "flex1",
  components: {
    pagination,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const len = ref(0); // 拆分以后的图片长度
    const curIdx = ref(1); // 页码
    const list = reactive<{ list: any[] }>({ list: [] }); // 图片列表

    watch(
      () => props.datas.imgList,
      (val) => {
        list.list = _.chunk(val, 4);
        len.value = _.size(list.list);
      },
      { deep: true, immediate: true }
    );

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
  flex: 1;
  .name {
    font-size: 14px;
    font-weight: 700;
    margin: 6px 6px 10px;
  }
  .detail {
    color: rgb(102, 102, 102);
    font-size: 13px;
    margin: 10px 6px 15px;
  }
}

.list-1 {
  li {
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: rgb(0 0 0 / 10%) 0px 5px 10px 0px;
    margin-bottom: 15px;
    .img-wrapper {
      width: 100%;
      height: 230px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
}

.list-2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    margin-bottom: 15px;
    width: calc(50% - 5px);
    box-shadow: rgb(0 0 0 / 10%) 0px 5px 10px 0px;
    border-radius: 8px;
    overflow: hidden;
    .img-wrapper {
      width: 100%;
      height: 110px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
}

.list-3 {
  display: flex;
  flex-wrap: wrap;
  li {
    margin-bottom: 15px;
    width: calc((100% / 3) - 5px);
    box-shadow: rgb(0 0 0 / 10%) 0px 5px 10px 0px;
    border-radius: 8px;
    overflow: hidden;
    .img-wrapper {
      width: 100%;
      height: 70px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    &:nth-of-type(2) {
      margin-left: 6px;
      margin-right: 6px;
    }
  }
}
</style>
