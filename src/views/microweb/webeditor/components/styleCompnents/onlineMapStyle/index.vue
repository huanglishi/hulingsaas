<template>
  <div class="wrapper">
    <div id="map-substitute"></div>
    <right-nav-header
      :navs="[
        {
          text: '在线地图',
          type: 'onlineMap',
        },
        {
          text: '编辑模块',
          type: 'edit',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />

    <div class="content">
      <template v-if="activeName === 'onlineMap'">
        <div class="form-item">
          <div class="title">模块标题：</div>
          <div class="form-item-content">
            <input type="text" class="title-text" v-model="datas.containerConfig.title" />
            <div
              class="check-box"
              :class="{ active: !datas.containerConfig.showTitle }"
              @click="
                () => (datas.containerConfig.showTitle = !datas.containerConfig.showTitle)
              "
            >
              <span></span>
              隐藏
            </div>
          </div>
        </div>
        <!-- 地图版本 -->
        <div class="form-item">
          <div class="title">地图版本：</div>
          <div class="form-item-content">
            <div class="radio active">
              <span></span>
              百度地图
            </div>
          </div>
        </div>
        <!-- 地址操作 -->
        <div class="form-item">
          <div class="title">地址列表：</div>
          <div class="form-item-content add-address">
            <el-button @click="addAddress">添加地址</el-button>
          </div>
        </div>
        <!-- 地址列表 -->
        <div class="address-list">
          <div class="address-header">
            <div class="content">地址</div>
            <div class="controll">操作</div>
          </div>
          <div
            class="address-item"
            v-for="item in addressList.value"
            :key="item.id"
            @click="changeAddress(item)"
          >
            <div class="item">{{ item.addressName }}</div>
            <div class="btns">
              <i class="iconfont icon-bianji" @click.stop="editAddressHandle(item)"></i>
              <i class="iconfont icon-shanchu" @click.stop="deleteAddress(item)"></i>
            </div>
          </div>
        </div>

        <template v-if="false">
          <!-- 模块样式 -->
          <fold-comp
            title="模块样式"
            :open="foldControll.modultStyle"
            @change="changeFold('modultStyle')"
          >
            <ul class="flex-list">
              <li class="active" style="background-position: -1550px -936px"></li>
              <li style="background-position: -1550px -1009px"></li>
            </ul>
          </fold-comp>
          <!-- 基本设置 -->
          <fold-comp
            title="基本设置"
            :open="foldControll.baseSet"
            @change="changeFold('baseSet')"
          >
            <div class="form-item">
              <div class="title">联系电话：</div>
              <div class="form-item-content">
                <div class="radio active">
                  <span></span>
                  显示
                </div>
                <div class="radio">
                  <span></span>
                  隐藏
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="title">地址名称：</div>
              <div class="form-item-content">
                <div class="radio active">
                  <span></span>
                  换行
                </div>
                <div class="radio">
                  <span></span>
                  不换行
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="title">地址详情：</div>
              <div class="form-item-content">
                <div class="radio active">
                  <span></span>
                  换行
                </div>
                <div class="radio">
                  <span></span>
                  不换行
                </div>
              </div>
            </div>
            <div class="form-item">
              <div class="title">其他信息：</div>
              <div class="form-item-content">
                <div class="radio active">
                  <span></span>
                  换行
                </div>
                <div class="radio">
                  <span></span>
                  不换行
                </div>
              </div>
            </div>
          </fold-comp>
        </template>
      </template>

      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>

  <!-- 地址新增（编辑）弹窗 -->
  <el-dialog v-model="show" :title="type" width="30%" destroy-on-close append-to-body>
    <el-form>
      <el-form-item label="地址名称">
        <el-input v-model="editAddress.value.addressName" />
      </el-form-item>
      <el-form-item label="添加地址">
        <div class="add-address">
          <el-input v-model="editAddress.value.address" />
          <el-button @click="searchAddress">搜索位置</el-button>
        </div>
      </el-form-item>
      <el-form-item label="地址详情">
        <el-input v-model="editAddress.value.addressDetail" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="editAddress.value.phone" />
      </el-form-item>
      <el-form-item label="其他信息">
        <el-input type="textarea" v-model="editAddress.value.otherInfo" />
      </el-form-item>
    </el-form>
    <div class="address-btn">
      <el-button size="larg" type="primary" @click="confirmAddAddress">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getAddressList,
  saveAddress,
  delAddress,
  getAddress,
} from "/@/api/microweb/webeditor";
import { ref, reactive, onMounted, nextTick } from "vue";
import publicComp from "../../publicComponents";
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage } from "element-plus";
import _ from "lodash-es";
export default {
  name: "onlineMapStyle",
  components: {
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ...publicComp,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const show = ref(false);
    const type = ref("新增地址");
    const activeName = ref("onlineMap");
    const foldControll = reactive({
      modultStyle: true,
      baseSet: true,
    });
    const addressList = reactive({
      value: [],
    });
    const editAddress = reactive({ value: {} });
    const mapRef = ref("");

    onMounted(() => {
      nextTick(() => {
        mapRef.value = new BMapGL.Map("map-substitute");
      });
    });

    const searchAddress = () => {
      if (!editAddress.value.address) {
        ElMessage({
          type: "warning",
          message: "请输入地址信息",
        });
        return;
      }
      let local = new BMapGL.LocalSearch(mapRef.value);
      local.search(editAddress.value.address);
      let timer;
      let count = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        count += 1;
        if (local._arrPois.length > 0) {
          clearInterval(timer);
          const { point, address } = local._arrPois[0];
          editAddress.value.lat = point.lat;
          editAddress.value.lng = point.lng;
          editAddress.value.addressDetail = address;
        }
        if (count >= 6) {
          clearInterval(timer);
          ElMessage({
            type: "warning",
            message: "无法解析地址",
          });
        }
      }, 1000);
    };

    // 控制折叠面板
    const changeFold = (type) => {
      _.keys(foldControll).forEach((key) => {
        if (key === type) {
          foldControll[key] = !foldControll[key];
        } else {
          foldControll[key] = false;
        }
      });
    };

    // 编辑地址
    const editAddressHandle = async ({ id }) => {
      type.value = "编辑地址";
      const address = await getAddress({ id });
      _.keys(address).forEach((key) => {
        editAddress.value[key] = address[key];
      });
      show.value = true;
    };

    // 删除地址
    const deleteAddress = async ({ id }) => {
      console.log(addressList.value);
      if (_.size(addressList.value) <= 1) {
        ElMessage({
          type: "info",
          message: "至少保留一项",
        });
        return;
      }
      await delAddress({ id });
      const allAddress = await getAddressList();
      addressList.value.length = 0;
      allAddress.forEach((item) => {
        addressList.value.push(_.cloneDeep(item));
      });
    };

    const addAddress = () => {
      type.value = "新增地址";
      show.value = true;
      editAddress.value = {};
    };

    // 确认新增（编辑）地址
    const confirmAddAddress = async () => {
      if (type.value === "编辑地址") {
        console.log(editAddress.value);
        await saveAddress(editAddress.value);
      } else {
        await saveAddress(editAddress.value);
      }
      const allAddress = await getAddressList();
      addressList.value.length = 0;
      allAddress.forEach((item) => {
        addressList.value.push(_.cloneDeep(item));
      });
      show.value = false;
    };

    // 切换地址
    const changeAddress = (data) => {
      _.keys(data).forEach((key) => {
        props.datas.datas[key] = data[key];
      });
    };

    // 获取地址列表
    const fetchAddressList = async () => {
      const res = await getAddressList();
      // 地址为空则初始化一个地址
      if (_.size(res) === 0) {
        await saveAddress({
          lng: 102.749989,
          lat: 25.125831,
          addressName: "新增地址",
          address: "昆明市盘龙区德润中心",
          addressDetail: "昆明市盘龙区德润中心",
          phone: "",
          otherInfo: "",
        });
        fetchAddressList();
      } else {
        if (_.isEmpty(props.datas.datas)) {
          const address = res[0];
          _.keys(address).forEach((key) => {
            props.datas.datas[key] = address[key];
          });
        }
        res.forEach((item) => {
          addressList.value.push(_.cloneDeep(item));
        });
      }
    };
    fetchAddressList();

    return {
      activeName,
      foldControll,
      changeFold,
      show,
      addressList,
      editAddress,
      editAddressHandle,
      deleteAddress,
      type,
      addAddress,
      searchAddress,
      confirmAddAddress,
      changeAddress,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100%;
  background-color: #fff;
  > .content {
    flex: 1;
    padding: 30px 20px 0;
  }
  .form-item-content {
    display: flex;
  }
  .add-address {
    flex: 1;
    justify-content: flex-end;
  }
  .flex-list {
    display: flex;
    margin-bottom: 20px;
    li {
      position: relative;
      width: 64px;
      height: 50px;
      border: 1px solid #ccc;
      background-image: url("../../../assets/images/bg.png");
      background-repeat: no-repeat;
      &:not(:first-of-type) {
        margin-left: 15px;
      }
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
          background-image: url("../../../assets/images/icon-list.png");
          background-position: -207px -34px;
        }
      }
    }
  }

  .address-list {
    border: 1px solid #e3e2e8;
    margin-bottom: 20px;
    .address-header {
      display: flex;
      background-color: rgb(248, 249, 251);
      .content {
        flex: 1;
        padding-left: 20px;
        box-sizing: border-box;
      }
      .controll {
        width: 100px;
        text-align: center;
        border-left: 1px solid #e3e2e8;
      }
      .content,
      .controll {
        line-height: 50px;
        font-size: 13px;
        color: #333;
      }
    }
    .address-item {
      display: flex;
      background-color: #fff;
      &:nth-of-type(odd) {
        background-color: rgb(248, 249, 251);
      }
      .item {
        flex: 1;
        font-size: 13px;
        color: #333;
        padding-left: 20px;
        line-height: 50px;
        box-sizing: border-box;
      }
      .btns {
        display: flex;
        justify-content: space-around;
        line-height: 50px;
        width: 100px;
        box-sizing: border-box;
        padding: 0 20px;
      }
    }
  }
}
.address-btn {
  width: 100%;
  display: flex;
  justify-content: center;
}
::v-deep .el-form-item__content {
  .add-address {
    display: flex;
    width: 100%;
    .el-input {
      flex: 1;
      margin-right: 15px;
    }
  }
}
</style>
