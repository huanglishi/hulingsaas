<template>
  <div class="content">
    <div class="form-item">
      <div class="title">模块标题：</div>
      <div class="form-item-content">
        <input type="text" class="title-text" v-model="datas.containerConfig.title" />
        <div
          class="check-box"
          :class="{ active: !datas.containerConfig.showTitle }"
          @click="datas.containerConfig.showTitle = !datas.containerConfig.showTitle"
        >
          <span></span>
          隐藏
        </div>
      </div>
    </div>

    <div class="form-item">
      <div class="title">选择产品：</div>
      <div class="form-item-content">
        <div class="radio-group">
          <div class="radio active">
            <span class="radio-item"></span>
            直接添加
          </div>
        </div>
      </div>
    </div>

    <div class="admin-essay">
      <div class="all-essay">
        <div class="search">
          <input type="text" placeholder="搜索产品" @input="searchProduct" />
          <span class="add" @click="openArticleModel"></span>
        </div>
        <div class="list">
          <div
            v-for="item in searchedList.value"
            :key="item.id"
            @click="addProduct(item)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="icon">
        <i></i>
      </div>
      <div class="added-essay">
        <div class="item" v-for="item in datas.datas.productsList" :key="item.id">
          <p>{{ item.title }}</p>
          <span @click="deleteProduct(item)"></span>
        </div>
      </div>
    </div>

    <fold-comp
      title="模块样式"
      :open="foldControll.moduleStyle"
      @change="setFold('moduleStyle')"
    >
      <ul class="flex-list">
        <li
          style="background-position: -121px -991px"
          :class="{
            active: datas.datas.moduleStyle === 1,
          }"
          @click="changeStatus('moduleStyle', 1)"
        ></li>
        <li
          style="background-position: -121px -1207px"
          :class="{
            active: datas.datas.moduleStyle === 2,
          }"
          @click="changeStatus('moduleStyle', 2)"
        ></li>
      </ul>

      <div class="form-item" v-if="datas.datas.moduleStyle === 1">
        <div class="title" style="width: 45px">列数：</div>
        <div class="form-item-content">
          <div class="radio-group">
            <div
              class="radio"
              :class="{
                active: datas.datas.columnnUum === 1,
              }"
              @click="changeStatus('columnnUum', 1)"
            >
              <span class="radio-item"></span>
              一列
            </div>
            <div
              class="radio"
              :class="{
                active: datas.datas.columnnUum === 2,
              }"
              @click="changeStatus('columnnUum', 2)"
            >
              <span class="radio-item"></span>
              两列
            </div>
            <div
              class="radio"
              :class="{
                active: datas.datas.columnnUum === 3,
              }"
              @click="changeStatus('columnnUum', 3)"
            >
              <span class="radio-item"></span>
              三列
            </div>
          </div>
        </div>
      </div>
    </fold-comp>

    <fold-comp
      title="基本设置"
      :open="foldControll.baseSeting"
      @change="setFold('baseSeting')"
    >
      <div class="form-item">
        <div class="title">产品名称：</div>
        <div class="form-item-content">
          <div class="radio-group">
            <div
              class="radio"
              :class="{
                active: datas.datas.showProductName,
              }"
              @click="changeStatus('showProductName', true)"
            >
              <span class="radio-item"></span>
              显示
            </div>
            <div
              class="radio"
              :class="{
                active: !datas.datas.showProductName,
              }"
              @click="changeStatus('showProductName', false)"
            >
              <span class="radio-item"></span>
              隐藏
            </div>
          </div>
        </div>
      </div>
    </fold-comp>
  </div>
  <FormModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts">
import { reactive } from "vue";
import { ReplaceUrl } from "/@/utils/imgurl";
import { getProductList } from "/@/api/microweb/webeditor";
import publicComponents from "../../../publicComponents";
import FormModal from "/@/views/article/articleManage/FormModal.vue";
import { useModal } from "/@/components/Modal";
import _ from "lodash-es";
export default {
  name: "base",
  components: {
    FormModal,
    ...publicComponents,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const searchedList = reactive({ value: [] }); // 搜出来产品列表
    const foldControll = reactive({
      moduleStyle: false,
      baseSeting: false,
    }); // 控制折叠面板
    const [registerModal, { openModal }] = useModal();

    // 修改部分状态
    const changeStatus = (key, val) => {
      props.datas.datas[key] = val;
    };

    // 关键词搜索产品
    const searchProduct = _.debounce((e) => {
      const title = e.target.value;
      fetchProductList(title);
    }, 500);

    // 过滤已经添加的文章
    const filterShowProduct = (essayList = []) => {
      const products = []; // 去重以后的文章
      const showProductId = []; // 已经展示的文章id
      props.datas.datas.productsList.forEach((item) => showProductId.push(item.id));
      essayList.forEach((item) => {
        if (!showProductId.includes(item.id)) {
          products.push(item);
        }
      });
      return products;
    };

    // 控制折叠面板
    const setFold = (type) => {
      Object.keys(foldControll).forEach((key) => {
        if (type === key) {
          foldControll[key] = !foldControll[key];
        } else {
          foldControll[key] = false;
        }
      });
    };

    // 添加商品
    const addProduct = (item) => {
      searchedList.value = _.filter(
        searchedList.value,
        (product) => product.id !== item.id
      );
      props.datas.datas.productsList.push(_.cloneDeep(item));
    };

    // 删除文章
    const deleteProduct = (product: any) => {
      props.datas.datas.productsList = _.filter(
        props.datas.datas.productsList,
        (item) => item.id !== product.id
      );
      searchedList.value.push(product);
    };

    // 新增文章成功回调
    const handleSuccess = () => {
      fetchProductList();
    };

    // 打开新增文章面板
    const openArticleModel = () => {
      openModal(true, {
        isUpdate: false,
      });
    };

    // 处理数据(补全图片路径，添加参数显示隐藏)
    const disposeData = (list) => {
      const newList: any[] = [];
      _.cloneDeep(list).forEach((item) => {
        // 补全图片路径
        if (_.isArray(item.images) && !_.isEmpty(item.images)) {
          item.images = item.images.map((ite) => ReplaceUrl(ite));
        }

        // 控制参数显示/隐藏
        if (_.isArray(item.prolist) && !_.isEmpty(item.prolist)) {
          item.prolist = item.prolist.map((ite) => {
            ite["show"] = false;
            return ite;
          });
        }
        newList.push(item);
      });
      if (_.size(props.datas.datas.paramsPane) == 0) {
        if (newList[0].prolist && _.size(newList[0].prolist)) {
          newList[0].prolist.forEach((item: any) => {
            props.datas.datas.paramsPane.push(item);
          });
        }
      }
      return newList;
    };

    // 请求产品
    const fetchProductList = (title = "") => {
      getProductList({ title, getall: 1 }).then((res) => {
        searchedList.value = disposeData(filterShowProduct(res.items));
      });
    };

    fetchProductList();

    return {
      changeStatus,
      searchProduct,
      searchedList,
      foldControll,
      setFold,
      addProduct,
      deleteProduct,
      registerModal,
      handleSuccess,
      openArticleModel,
    };
  },
};
</script>

<style lang="less" scoped>
.form-item {
  display: flex;
  margin-bottom: 15px;
  .title {
    width: 70px;
    text-align: right;
    margin-right: 10px;
    line-height: 30px;
  }
  .form-item-content {
    display: flex;
    .radio-group {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
}
.flex-list {
  display: flex;
  margin-bottom: 15px;
  li {
    position: relative;
    width: 64px;
    height: 50px;
    border: 1px solid #ccc;
    background-image: url("../../../../assets/images/bg.png");
    background-repeat: no-repeat;
    &.active {
      border-color: #5874d8;
      &::after {
        position: absolute;
        right: 0;
        bottom: 0;
        display: inline-block;
        content: "";
        width: 18px;
        height: 14px;
        background-image: url("../../../../assets/images/icon-list.png");
        background-position: -207px -34px;
      }
    }
    &:not(:last-of-type) {
      margin-right: 10px;
    }
  }
}

.admin-essay {
  display: flex;
  margin-bottom: 20px;
  .all-essay,
  .added-essay {
    border: 1px solid #d0d4d7;
    width: 186px;
    height: 270px;
  }
  .icon {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0 6px;
    box-sizing: border-box;
    i {
      display: block;
      width: 17px;
      height: 32px;
      background-image: url("../../../../assets/images/icon-list.png");
      background-position: -431px -33px;
      margin: 0 auto;
    }
  }
  .all-essay {
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;

    .search {
      display: flex;
      justify-content: space-between;
      height: 32px;
      input {
        width: 85%;
        height: 100%;
        padding: 6px;
        font-size: 13px;
        box-sizing: border-box;
        border: 1px solid #d0d4d7;
      }
      span {
        width: 14px;
        height: 100%;
        margin-left: 6px;
        background-image: url("../../../../assets/images/icon-list.png");
        background-position: -234px -24px;
        cursor: pointer;
      }
    }
    .list {
      flex: 1;
      overflow-y: auto;
      margin-top: 10px;
      div {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 8px 4px;
        user-select: none;
        cursor: pointer;
        &:hover {
          color: #fff;
          background-color: #5874d8;
        }
      }
    }
  }
  .added-essay {
    overflow-y: auto;
    padding: 15px 10px 0 15px;
    .item {
      display: flex;
      align-items: center;
      line-height: 26px;
      p {
        display: inline-block;
        flex: 1;
        margin-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        cursor: pointer;
        background-image: url("../../../../assets/images/icon-list.png");
        background-position: -854px 0;
      }
    }
  }
}
</style>
