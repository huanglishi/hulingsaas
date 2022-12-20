<template>
  <div :class="`products-list-${datas.columnnUum}`">
    <div
      class="item"
      v-for="item in datas.productsList"
      :key="item.id"
      @click.stop="jumpDetail(item)"
    >
      <div
        class="wrapper-img"
        :style="{
          'background-image': `url(${item.images.length !== 0 ? item.images[0] : ''})`,
        }"
      ></div>
      <p class="product-name" v-if="datas.showProductName">{{ item.title }}</p>

      <template v-for="(ite, index) in item.prolist" :key="index">
        <template v-if="['price'].includes(ite.keyname)">
          <div class="price" v-if="isShowParams(ite)">
            <span class="amount">
              <i class="currency">¥</i>
              {{ ite.val }}
              <i class="currency">.00</i>
            </span>
          </div>
        </template>

        <template v-else>
          <p class="params-item" v-if="isShowParams(ite)">
            {{ datas.paramsName ? `${ite.name}：` : "" }}{{ ite.val || "-" }}
          </p>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import _ from "lodash-es";
import { reactive, computed } from "vue";
export default {
  name: "flex1",
  props: {
    datas: Object,
  },
  setup(props) {
    console.log(props.datas);
    const paramsObj = reactive({});
    const paramsConfig = computed(() => {});

    const jumpDetail = ({ id }) => {
      history.pushState(
        {},
        "",
        `${location.href}?type=page&compName=productDetail&id=${id}`
      );
    };

    const isShowParams = ({ id }) => {
      const paramsItem = _.find(props.datas.paramsPane, ["id", id]);
      return paramsItem.show || false;
    };

    return {
      paramsConfig,
      jumpDetail,
      isShowParams,
    };
  },
};
</script>

<style lang="less" scoped>
.products-list-1 {
  padding: 15px;
  > .item {
    padding-bottom: 15px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 14px 2px rgb(0 0 0 / 15%);
    border-radius: 4px;
    overflow: hidden;
    &:not(:last-of-type) {
      margin-bottom: 15px;
    }
    .wrapper-img {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-image: url("	https://20881522.s61i.faiusr.com/4/AD0I8sD6CRAEGAAg5eDT7gUokOmrhQIw7gU47gU!450x450.png");
      background-repeat: no-repeat;
      background-size: 80%;
      background-position: center center;
    }
    .product-name {
      color: #000;
      padding: 10px 0 0;
      font-size: 15px;
      margin-left: 10px;
    }
    .price {
      display: flex;
      align-items: flex-end;
      font-size: 14px;
      margin-top: 6px;
      order: 999;
      .amount {
        font-size: 18px;
        font-weight: 700;
        color: #ff7214;
        margin-left: 10px;
        .currency {
          font-style: normal;
          font-size: 14px;
        }
      }
      .origin-price {
        font-size: 14px;
        text-decoration: line-through;
        color: #797979;
        margin-left: 10px;
      }
    }
    .params-item,
    .price .name {
      display: block;
      margin-left: 10px;
      line-height: 18px;
      font-size: 12px;
      color: #797979;
    }
  }
}
.products-list-2 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 15px 10px;
  > .item {
    display: flex;
    flex-direction: column;
    width: calc((100% / 2) - 5px);
    box-shadow: 0 0 14px 2px rgb(0 0 0 / 15%);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 15px;
    padding-bottom: 15px;
    &:nth-of-type(Odd) {
      margin-right: 10px;
    }
    .wrapper-img {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-image: url("https://20881522.s61i.faiusr.com/4/AD0I8sD6CRAEGAAg5eDT7gUokOmrhQIw7gU47gU!450x450.png");
      background-size: 100%;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .product-name {
      padding: 10px 10px 0;
      font-size: 14px;
      color: #000;
    }
    .price {
      display: flex;
      align-items: flex-end;
      font-size: 14px;
      margin-top: 6px;
      order: 999;
      .amount {
        font-size: 18px;
        font-weight: 700;
        color: #ff7214;
        margin-left: 10px;
        .currency {
          font-style: normal;
          font-size: 14px;
        }
      }
      .origin-price {
        font-size: 14px;
        text-decoration: line-through;
        color: #797979;
        margin-left: 10px;
      }
    }
    .params-item,
    .price .name {
      display: block;
      margin-left: 10px;
      line-height: 18px;
      font-size: 12px;
      color: #797979;
    }
  }
}
.products-list-3 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 15px 10px 0;
  .item {
    display: flex;
    flex-direction: column;
    width: calc((100% / 3) - 8px);
    box-shadow: 0 0 14px 2px rgb(0 0 0 / 15%);
    border-radius: 4px;
    overflow: hidden;
    padding-bottom: 15px;
    margin-bottom: 15px;
    .wrapper-img {
      width: 100%;
      height: 100px;
      overflow: hidden;
      background-image: url("https://20881522.s61i.faiusr.com/4/AD0I8sD6CRAEGAAg5eDT7gUokOmrhQIw7gU47gU!450x450.png");
      background-size: 100%;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .product-name {
      padding: 10px 10px 0;
      font-size: 14px;
      color: #000;
    }
    .price {
      display: flex;
      align-items: flex-end;
      font-size: 14px;
      margin-top: 6px;
      order: 999;
      .amount {
        font-size: 18px;
        font-weight: 700;
        color: #ff7214;
        margin-left: 10px;
        .currency {
          font-style: normal;
          font-size: 14px;
        }
      }
      .origin-price {
        font-size: 14px;
        text-decoration: line-through;
        color: #797979;
        margin-left: 10px;
      }
    }
    .params-item,
    .price .name {
      display: block;
      margin-left: 10px;
      line-height: 18px;
      font-size: 12px;
      color: #797979;
    }
  }
}
</style>
