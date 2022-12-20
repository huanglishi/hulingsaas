<template>
  <div class="wrapper">
    <div class="header-nav" @click="back">
      <i class="iconfont icon-jiantou-zuo"></i>
    </div>

    <div class="content">
      <div class="img-list">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="item in imgs" :key="item">
            <div class="img-item">
              <img :src="item" alt="" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="prices">
          <p class="price" v-if="priceObj.price">¥{{ priceObj.price }}.00</p>
          <p class="mprice" v-if="priceObj.mprice">¥{{ priceObj.mprice }}.00</p>
        </div>
        <p class="title">{{ detail.value.title }}</p>
      </div>

      <div class="product-detail">
        <div class="product-tab">
          <div
            class="tab-item"
            :class="{ active: type === 'detail' }"
            @click="() => (type = 'detail')"
          >
            产品详情
          </div>
          <div
            class="tab-item"
            :class="{ active: type === 'params' }"
            @click="() => (type = 'params')"
          >
            产品参数
          </div>
        </div>

        <div class="detail" v-show="type === 'detail'" v-html="content"></div>
        <ul class="params" v-show="type === 'params'">
          <li v-for="item in detail.value.prolist" :key="item.id">
            <div class="key">{{ item.name }}</div>
            <div class="value">{{ item.val }}</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <div class="icon">
        <i class="iconfont icon-home"></i>
        首页
      </div>
      <div class="icon service">
        <div class="edit" @click="() => (showService = true)">编辑客服</div>
        <div class="service-icon" @click="() => (servicePopup = true)">
          <i class="iconfont icon-kefu"></i>
          客服
        </div>
      </div>
      <div class="consultation">立即购买</div>
    </div>
  </div>

  <van-popup v-model:show="showCode.open">
    <div class="wechat-code">
      <img :src="showCode.code" alt="" />
    </div>
  </van-popup>

  <van-popup v-model:show="servicePopup" position="bottom">
    <ul class="service-list">
      <li v-for="item in serviceList.value" :key="item.id" @click="consultation(item)">
        <img :src="matchIcon(item)" alt="" />
        <div>
          <template v-if="item.type === 'mobile'">
            <p class="name">{{ item.label }}</p>
            <p class="code">{{ item.value }}</p>
          </template>
          <template v-else>
            <p style="text-align: center">点击咨询</p>
          </template>
        </div>
        <i class="iconfont icon-jiantou-you"></i>
      </li>
    </ul>
    <div class="cancel-btn" @click="() => (servicePopup = false)">取消</div>
  </van-popup>

  <customer-service-modal :open="showService" @closed="modelClosed" />
</template>

<script lang="ts">
import _ from "lodash";
import { computed, reactive, ref } from "vue";
import { getProduct } from "/@/api/microweb/webeditor";
import customerServiceModal from "/@/views/microweb/webeditor/components/publicComponents/customerServiceModal/index.vue";
import { getServiceList } from "/@/api/microweb/webeditor";
import { ElMessage } from "element-plus";
import { parseUrlParams } from '../utils'

export default {
  name: "productDetail",
  components: {
    customerServiceModal,
  },
  setup() {
    const detail = reactive({ value: {} });
    const type = ref("detail");
    const showService = ref(false);
    const servicePopup = ref(false);
    const serviceList = reactive({ value: [] });
    const showCode = reactive({
      open: false,
      code: "",
    });
    const {id} = parseUrlParams(location.href.split('?')[1])
    getProduct({ id }).then((res) => {
      detail.value = res;
    });

    const imgs = computed(() => detail.value.images);

    const content = computed(() =>
      detail.value.content
        ? detail.value.content.replace("<img ", '<img style="width:100%"')
        : ""
    );

    const priceObj = computed(() => {
      const obj = {};
      const price = _.find(detail.value.prolist, ["keyname", "price"]);
      const mprice = _.find(detail.value.prolist, ["keyname", "mprice"]);
      if (price) {
        obj["price"] = price.val;
      }
      if (mprice) {
        obj["mprice"] = mprice.val;
      }
      return obj;
    });

    const back = () => {
      history.back();
    };

    const modelClosed = () => {
      showService.value = false;
      getServeList();
    };

    const getServeList = async () => {
      let res = await getServiceList({ product_id: id });
      console.log(res)
      serviceList.value = res;
    };
    getServeList();

    const consultation = (data) => {
      const { type } = data;
      if (type === "mobile") {
        ElMessage({
          type: "warning",
          message: "该功能无法在桌面浏览器中启动",
        });
        return;
      }
      showCode.open = true;
      showCode.code = data.value;
    };

    const matchIcon = (item) => {
      const { type, image } = item;
      switch (type) {
        case "wx":
          if (image === "") {
            return new URL("../assets/images/wechat.png", import.meta.url).href;
          }
          return image;
        case "mobile":
          if (image === "") {
            return new URL("../assets/images/phone.png", import.meta.url).href;
          }
          return image;
      }
    };

    return {
      imgs,
      content,
      type,
      detail,
      priceObj,
      back,
      showService,
      modelClosed,
      servicePopup,
      serviceList,
      consultation,
      showCode,
      matchIcon,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .header-nav {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    line-height: 50px;
    padding: 0 15px;
    z-index: 999;
  }

  .content {
    flex: 1;
    overflow: auto;
    background-color: #f5f5f5;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .img-list {
    .img-item {
      width: 100%;
      height: 375px;
      img {
        width: 100%;
      }
    }
  }
  .product-info {
    padding: 10px;
    background: #fff;
    .prices {
      display: flex;
      align-items: flex-end;
      margin-bottom: 10px;
      .price {
        font-size: 19px;
        font-weight: 700;
        color: #ff7214;
        margin-right: 10px;
      }
      .mprice {
        font-size: 13px;
        color: #666;
        text-decoration: line-through;
      }
    }
    .title {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .product-detail {
    background-color: #fff;
    padding-bottom: 15px;
    margin-top: 15px;
    .product-tab {
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #f3f3f3;
      margin-bottom: 10px;
      .tab-item {
        padding: 10px 5px;
        font-size: 13px;
        color: #666;
        &.active {
          color: #ff7214;
          border-bottom: 2px solid #ff7214;
        }
      }
    }
  }
  .params {
    li {
      display: flex;
      padding: 10px 50px;
      border-bottom: 1px solid #f3f3f3;
      font-size: 13px;
      color: #666;
      .key {
        width: 50%;
      }
    }
  }
  .footer {
    display: flex;
    .icon {
      position: relative;
      height: 50px;
      width: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      border-top: 1px solid #f3f3f3;
      color: #333;
      user-select: none;
      cursor: pointer;
      &:hover .edit {
        display: block;
      }
      i {
        margin-bottom: 5px;
      }
      .edit {
        display: none;
        position: absolute;
        top: -36px;
        width: 70px;
        text-align: center;
        line-height: 35px;
        border-radius: 6px;
        background-color: #fff;
        color: #666;
        user-select: none;
        cursor: pointer;
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        &:hover {
          color: #5874d8;
        }
      }
      .service-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
    .consultation {
      flex: 1;
      line-height: 50px;
      text-align: center;
      color: #fff;
      background-color: #ff7214;
    }
  }
}
.service-list {
  > li {
    display: flex;
    align-items: center;
    padding: 10px 25px;
    img {
      width: 25px;
      height: 25px;
      margin-right: 20px;
    }
    > div {
      flex: 1;
      display: flex;
      align-items: center;
      p {
        flex: 1;
      }
      .name {
        margin-right: 15px;
      }
      i {
        margin-left: 20px;
      }
    }
  }
}
.cancel-btn {
  text-align: center;
  line-height: 40px;
  color: #666;
  font-size: 15px;
  background-color: #f5f5f5;
}
.wechat-code {
  width: 200px;
  height: 200px;
  img {
    width: 100%;
  }
}
</style>
