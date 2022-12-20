<template>
  <div class="product-list">
    <div
      class="product-item"
      v-for="item in datas.productsList"
      :key="item.id"
      @click.stop="jumpDetail(item)"
    >
      <div
        class="product-item-img"
        :style="{
          'background-image': `url(${item.images.length !== 0 ? item.images[0] : ''})`,
        }"
      ></div>
      <div class="product-info">
        <div class="product-name" v-if="datas.showProductName">
          {{ item.title }}
        </div>

        <template v-for="ite in item.prolist" :key="ite.id">
          <template v-if="ite.keyname == 'price'">
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
  </div>
</template>

<script>
import _ from "lodash-es";
import { computed, reactive } from "vue";
export default {
  name: "flex2",
  props: {
    datas: Object,
  },
  setup(props) {
    const params = (data) => {
      let arr = [];
      data.forEach((item) => {
        if (!["mprice", "price"].includes(item.keyname)) {
          arr.push(item);
        }
      });
      return arr;
    };

    const priceInfo = (data) => {
      let obj = {};
      data.forEach((item) => {
        if (["price"].includes(item.keyname)) {
          obj = item;
        }
      });
      return obj;
    };

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
      params,
      priceInfo,
      jumpDetail,
      isShowParams,
    };
  },
};
</script>

<style lang="less" scoped>
.product-list {
  display: flex;
  flex-direction: column;
  padding-top: 15px;
}
.product-item {
  display: flex;
  width: 100%;
  margin-bottom: 15px;
  padding-left: 15px;
  .product-item-img {
    width: 100px;
    height: 100px;
    background-image: url("https://20881522.s61i.faiusr.com/4/AD0I8sD6CRAEGAAg5eDT7gUokOmrhQIw7gU47gU!450x450.png");
    background-size: 100%;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .product-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 15px;
    margin-left: 15px;
    .product-name {
      font-size: 15px;
      font-weight: 700;
    }
  }
}

.price {
  display: flex;
  align-items: flex-end;
  margin-top: 15px;
  order: 999;
  .amount {
    display: flex;
    align-items: flex-end;
    color: #ff7214;
    font-weight: 700;
    line-height: 18px;
    font-size: 20px;
    i {
      font-style: normal;
      font-size: 13px;
    }
    .currency {
      font-size: 20px;
    }
  }
  .origin-priuce {
    margin-left: 10px;
  }
}
.price .origin-priuce {
  color: #797979;
  font-size: 12px;
  text-decoration: line-through;
}
.price .name,
.params-item {
  font-size: 13px;
  line-height: 18px;
  color: #797979;
}
</style>
