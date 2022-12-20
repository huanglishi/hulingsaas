<template>
  <el-dialog 
    v-model="open" 
    append-to-body 
    title="设置客服" 
    custom-class="service-modal"
    destroy-on-close
>
    <div class="header-controll">
      <p>客服列表：</p>
      <el-button @click="addContact">新增客服</el-button>
    </div>

    <div class="table">
      <div class="table-header">
        <div>客服类型</div>
        <div>客服账号</div>
        <div>显示文字</div>
        <div>图片</div>
        <div>显示</div>
        <div>操作</div>
      </div>
      <ul class="table-content">
        <li class="item" v-for="item in serviceList.value" :key="item.id">
          <div class="service-use">
            <el-select v-model="item.type" @change="changeFields('type', $event, item)">
              <el-option value="wx" label="微信客服" />
              <el-option value="mobile" label="电话咨询" />
            </el-select>
          </div>
          <template v-if="item.type === 'wx'">
            <div @click="editCode(item)" class="code">
              {{ item.value.startsWith("http") ? "查看" : "添加二维码" }}
            </div>
          </template>
          <input
            v-else
            type="text"
            placeholder="请输入号码"
            v-model="item.value"
            @change="changeFields('value', $event.target.value, item)"
          />
          <input
            type="text"
            placeholder="请输入显示文字"
            v-model="item.label"
            @change="changeFields('label', $event.target.value, item)"
          />
          <div class="icon">
            <div class="icon-wraper" @click="changIcon(item)">
              <img :src="matchIcon(item)" alt="" />
              <span class="mask">编辑</span>
            </div>
          </div>
          <div class="icon" @click="changeFields('status', item)">
            <span :class="[item.status === 1 ? 'hide' : 'show']"></span>
          </div>
          <div class="icon" @click="deleteService(item)">
            <i class="iconfont icon-shanchu"></i>
          </div>
        </li>
      </ul>
    </div>

    <div class="remark">
      备注：QQ号码需开通<a href="" target="__blank">“QQ推广”</a> ，无需复制代码。
    </div>

    <el-dialog v-model="showCode" width="20%" destroy-on-close append-to-body>
      <div class="show-code-wrwapper">
        <div class="code-wrapper">
          <img :src="curEditservice.value.value" alt="" />
        </div>
        <el-button @click="resetCode">重新上传</el-button>
      </div>
    </el-dialog>

    <FileManage @register="registerFileManage" @success="selectImg"></FileManage>
  </el-dialog>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import { FileManage } from "/@/components/FileManage";
import { ElDialog, ElButton, ElSelect, ElOption } from "element-plus";
import { getServiceList, saveService, delService } from "/@/api/microweb/webeditor";
import { useModal } from "/@/components/Modal";
import { ReplaceUrl } from "/@/utils/imgurl";
import { parseUrlParams } from '../../../utils'
export default {
  name: "customerServiceModal",
  components: {
    ElDialog,
    ElButton,
    ElSelect,
    ElOption,
    FileManage,
  },
  props: {
    open: Boolean,
  },
  setup() {
    const showCustomer = ref(true);
    const serviceList = reactive({ value: [] });
    const [registerFileManage, { openModal }] = useModal();
    const curEditservice = reactive({ value: {} });
    const setType = ref("");
    const showCode = ref(false);
    const {id} = parseUrlParams(location.href.split('?')[1])
    // 添加联系方式
    const addContact = async () => {
      await saveService({
        product_id: id,
        type: "mobile",
        value: "",
        label: "客服",
        image: "",
      });
      getAllServices();
    };

    const getAllServices = async () => {
      const res = await getServiceList({ product_id: id });
      serviceList.value = res;
    };
    getAllServices();

    const deleteService = async ({ id }) => {
      await delService({ id });
      getAllServices();
    };

    const changeFields = async (field, val, row) => {
      let item = null;
      switch (field) {
        case "status":
          item = { ...val, status: val.status === 1 ? 0 : 1 };
          break;
        case "label":
        case "value":
        case "image":
        case "type":
          item = { ...row, [field]: val };
          break;
      }
      await saveService(item);
      getAllServices();
    };

    const matchIcon = (item) => {
      const { type, image } = item;
      switch (type) {
        case "wx":
          if (image === "") {
            return new URL("../../../assets/images/wechat.png", import.meta.url).href;
          }
          return image;
        case "mobile":
          if (image === "") {
            return new URL("../../../assets/images/phone.png", import.meta.url).href;
          }
          return image;
      }
    };

    const changIcon = (item) => {
      setType.value = "image";
      curEditservice.value = item;
      openModal(true, {
        getnumber: "one",
      });
    };

    const selectImg = async ({ url }) => {
      if (setType.value === "code") {
        await saveService({
          ...curEditservice.value,
          value: ReplaceUrl(url),
        });
        getAllServices();
        return;
      }
      changeFields("image", ReplaceUrl(url), curEditservice.value);
    };

    const editCode = (item) => {
      curEditservice.value = item;
      const { value } = item;
      if (!value.startsWith("http")) {
        setType.value = "code";
        openModal(true, {
          getnumber: "one",
        });
      } else {
        showCode.value = true;
      }
    };

    const resetCode = () => {
      showCode.value = false;
      setType.value = "code";
      openModal(true, {
        getnumber: "one",
      });
    };

    const close = () =>{
        console.log('关闭')
    }

    return {
      showCustomer,
      addContact,
      serviceList,
      deleteService,
      changeFields,
      matchIcon,
      registerFileManage,
      changIcon,
      selectImg,
      editCode,
      showCode,
      curEditservice,
      resetCode,
    };
  },
};
</script>

<style lang="less">
.ant-modal-root {
  z-index: 999;
}
// .el-overlay {
//   z-index: 1 !important;
// }
</style>
<style lang="less" scoped>
.service-modal {
  z-index: 999;
  .header-controll {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
}
.show-code-wrwapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .code-wrapper {
    width: 200px;
    height: 200px;
    border: 1px solid rgb(202, 202, 202);
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
.table {
  width: 100%;
  margin-bottom: 15px;
  border: 1px solid #e3e2e8;
  box-sizing: border-box;
  .table-header {
    display: flex;
    background-color: #f8f9fb;
    padding: 15px 0;

    div {
      width: 153px;
      text-align: center;
      line-height: 20px;
      &:not(:first-of-type) {
        border-left: 1px solid #e3e2e8;
      }
    }
  }
  .table-content {
    background-color: #fff;
    max-height: 270px;
    overflow: auto;
    .item {
      display: flex;
      padding: 5px;
      &:nth-of-type(even) {
        background-color: #f8f9fb;
      }
      .service-use {
        width: 153px;
        padding: 6px;
        box-sizing: border-box;
      }
      .code {
        line-height: 44px;
        text-align: center;
        width: 153px;
        user-select: none;
        cursor: pointer;
      }
      input {
        width: 153px;
        text-align: center;
        height: 30px;
        margin: 6px 0;
        background-color: transparent;
        &:focus {
          border: 1px solid #e3e2e8;
        }
      }
      .icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 153px;
        height: 44px;
        cursor: pointer;

        .icon-wraper {
          position: relative;
          width: 25px;
          height: 25px;
          &:hover .mask {
            opacity: 1;
          }
          img {
            width: 100%;
            height: 100%;
          }
          .mask {
            opacity: 0;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 25px;
            height: 25px;
            display: block;
            color: #fff;
            font-size: 12px;
            line-height: 25px;
            z-index: 999;
            background-color: rgba(0, 0, 0, 0.35);
          }
        }
        i {
          font-size: 22px;
        }
        span {
          display: block;
          width: 12px;
          height: 10px;
          background-image: url("../../../assets/images/mbg01.png");
          &.show {
            background-position: -1855px -47px;
          }
          &.hide {
            background-position: -1885px -48px;
          }
        }
      }
    }
  }
}
</style>
