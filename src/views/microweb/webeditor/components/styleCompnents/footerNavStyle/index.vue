<template>
  <div class="wrapper">
    <div class="navs">
      <div>底部导航</div>
    </div>

    <div class="form">
      <el-form label-width="120px" label-position="left">
        <el-form-item label="默认文字颜色">
          <el-color-picker v-model="navList.defaultTextColor" />
        </el-form-item>
        <el-form-item label="选中文字颜色">
          <el-color-picker v-model="navList.activeTextColor" />
        </el-form-item>

        <el-form-item label="导航项" class="nav-wrapper">
          <ul class="nav-list">
            <li class="nav-item" v-for="(item, index) in navList.navs" :key="index">
              <div class="left">
                <img
                  :src="matchIconUrl(item.icon)"
                  alt=""
                  @click="selectIcon(item, 'icon')"
                />
                <img
                  :src="matchIconUrl(item.activeIcon)"
                  alt=""
                  @click="selectIcon(item, 'activeIcon')"
                />
              </div>
              <div class="right">
                <el-input v-model="item.navName" />
                <div class="select-url">
                  <el-input disabled v-if="item.jumpType === 'not'" />
                  <el-input
                    disabled
                    v-else-if="item.jumpType === 'interior'"
                    v-model="item.urlInfo.pageName"
                  />
                  <el-input v-else v-model="item.urlInfo.url" />
                  <el-button @click="setJump(item)">设置链接</el-button>
                </div>
              </div>
              <span class="delete" @click="deleteNav(item)">
                <i class="iconfont icon-guanbi"></i>
              </span>
            </li>
            <li class="add-nav" @click="addNavItem">添加导航项</li>
          </ul>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <set-jump-url
    :jumpType="curFooterNavItem.value.jumpType"
    :urlInfo="curFooterNavItem.value.urlInfo"
    :dialogVisible="openUrlModal"
    @hide="jumpUrlInfo"
  />
  <FileManage @register="registerFileManage" @success="selectImg" />
</template>

<script lang="ts">
import _ from "lodash";
import {
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElSlider,
  ElSelect,
  ElOption,
  ElColorPicker,
  ElInput,
  ElButton,
  ElMessage,
} from "element-plus";
import comps from "../../publicComponents";
import { storeToRefs } from "pinia";
import { siteData } from "../../../store";
import { footerNavItem } from "../../../initData/index.js";
import { reactive, ref } from "vue";
import { ReplaceUrl } from "/@/utils/imgurl";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";

export default {
  name: "footerNavStyle",
  components: {
    ElForm,
    ElFormItem,
    ElInputNumber,
    ElSlider,
    ElSelect,
    ElOption,
    ElColorPicker,
    ElInput,
    ElButton,
    FileManage,
    ...comps,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const store = siteData();
    const { navList } = storeToRefs(store);
    const openUrlModal = ref(false); // 跳转设置弹窗
    const curFooterNavItem = reactive({ value: {} }); // 当前编辑的地步导航id
    const setIcon = ref(""); // 设置的icon

    const [registerFileManage, { openModal: openImageModal }] = useModal();

    // 删除导航项
    const deleteNav = ({ id }) => {
      navList.value.navs = _.filter(navList.value.navs, (item) => item.id != id);
    };

    // 添加导航项
    const addNavItem = () => {
      if (_.size(navList.value.navs) >= 5) {
        ElMessage({
          type: "warning",
          message: "最多添加5个导航，请删除其他导航后新增",
        });
        return;
      }
      navList.value.navs.push(_.cloneDeep(footerNavItem));
    };

    // 匹配icoon地址
    const matchIconUrl = (url) => {
      if (_.startsWith(url, "http")) {
        return url;
      } else {
        return new URL(`../../../assets/images/${url}`, import.meta.url).href;
      }
    };

    // 回传跳转地址信息
    const jumpUrlInfo = (data) => {
      openUrlModal.value = false;
      if (data.closeType === "cancel") return;
      const { type, content } = data;
      const item = _.find(navList.value.navs, ["id", curFooterNavItem.value.id]);
      item.jumpType = type;
      Object.keys(content).forEach((key) => {
        item.urlInfo[key] = content[key];
      });
    };

    // 设置跳转
    const setJump = (item) => {
      curFooterNavItem.value = item;
      openUrlModal.value = true;
    };

    // 选择图片回调
    const selectImg = (data) => {
      const { url } = data;
      const item = _.find(navList.value.navs, ["id", curFooterNavItem.value.id]);
      item[setIcon.value] = ReplaceUrl(url);
    };

    // 选择图标
    const selectIcon = (item, type) => {
      setIcon.value = type;
      curFooterNavItem.value = item;
      openImageModal(true, {
        getnumber: "one",
      });
    };

    return {
      deleteNav,
      navList,
      addNavItem,
      jumpUrlInfo,
      openUrlModal,
      setJump,
      matchIconUrl,
      registerFileManage,
      selectImg,
      selectIcon,
      curFooterNavItem,
    };
  },
};
</script>

<style lang="less" scoped>
.navs {
  width: 100%;
  background-color: #f0f0f0;
  > div {
    width: 50%;
    line-height: 50px;
    text-align: center;
    color: #5874d8;
    background-color: #fff;
  }
}
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  .form {
    padding: 10px 20px 0;
  }
}
.nav-list {
  width: 100%;
  .nav-item {
    position: relative;
    display: flex;
    padding: 10px;
    margin: 10px 0 20px 0;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 100%;

    .left {
      display: flex;
      flex-direction: column;

      img {
        position: relative;
        width: 35px;
        height: 35px;
        border-radius: 4px;
        overflow: hidden;
        margin: 4px 0;
        cursor: pointer;
      }
    }
    .right {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .select-url {
        display: flex;
        justify-content: space-between;
        .el-input {
          flex: 1;
          margin-right: 10px;
        }
      }
    }
    .delete {
      position: absolute;
      right: -6px;
      top: -6px;
      display: block;
      width: 16px;
      height: 16px;
      line-height: 20px;
      text-align: center;
      color: #000;
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
      user-select: none;
      text-align: center;
      border: 1px solid rgba(0, 0, 0, 0.5);
      i {
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
      }
    }
  }
  .add-nav {
    text-align: center;
    line-height: 40px;
    border: 1px dashed #ccc;
    user-select: none;
    cursor: pointer;
  }
}
::v-deep .nav-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
