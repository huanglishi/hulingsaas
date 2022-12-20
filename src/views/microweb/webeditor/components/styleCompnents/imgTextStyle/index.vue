<template>
  <div class="wrapper">
    <rightNavHeader
      :navs="[
        {
          text: '图文展示',
          type: 'imgText',
        },
        {
          text: '编辑模块',
          type: 'edit',
        },
      ]"
      @change="change"
    />

    <div class="form">
      <template v-if="activeType === 'imgText'">
        <div class="form-item">
          <div class="title">模块标题：</div>
          <div class="form-item-content">
            <input class="title-text" v-model="datas.containerConfig.title" />
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
          <div class="title">文本内容：</div>
          <div class="form-item-content">
            <el-input type="textarea" v-model="datas.datas.text" />
          </div>
        </div>

        <div class="form-item">
          <div class="title">图片：</div>
          <div class="form-item-content">
            <div class="img-content">
              <el-button @click="selectIcon">修改图片</el-button>
              <img :src="datas.datas.imgUrl" alt="" />
            </div>
          </div>
        </div>

        <div class="form-item">
          <div class="title">链接:</div>
          <div class="form-item-content">
            <div class="link-content">
              <el-input type="text" v-if="datas.datas.jumpType === ''" />
              <el-input
                type="text"
                disabled
                model-value="无"
                v-else-if="datas.datas.jumpType === 'not'"
              />
              <el-input
                type="text"
                disabled
                v-model="datas.datas.urlInfo.pageName"
                v-else-if="datas.datas.jumpType === 'interior'"
              />
              <el-input type="text" v-else v-model="datas.datas.urlInfo.url" />
              <el-button @click="urlModal = true">设置链接</el-button>
            </div>
          </div>
        </div>

        <div
          class="form-item"
          v-if="['wrapper-3', 'wrapper-4'].includes(datas.datas.styleClass)"
        >
          <div class="title">宽度:</div>
          <div class="form-item-content">
            <div class="width-content">
              <el-slider
                :min="5"
                :max="100"
                v-model="datas.datas.width"
                :format-tooltip="(value) => `${value}%`"
              />
            </div>
          </div>
        </div>

        <fold-comp title="模块样式" :open="true">
          <ul class="styl-list">
            <li
              :class="[
                'style-item',
                datas.datas.styleClass === `wrapper-${item}` ? 'active' : '',
              ]"
              v-for="item in 4"
              :key="item"
              @click="changeStyle(`wrapper-${item}`)"
            ></li>
          </ul>
        </fold-comp>
      </template>
      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>

  <set-jump-url
    :jumpType="datas.datas.jumpType"
    :urlInfo="datas.datas.urlInfo"
    :dialogVisible="urlModal"
    @hide="dialogClosed"
  />
  <FileManage @register="registerFileManage" @success="selectImg"></FileManage>
</template>

<script>
import {
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElCheckbox,
  ElImage,
  ElRadio,
  ElSlider,
} from "element-plus";
import comps from "../../publicComponents";
import { reactive, ref } from "vue";

import { ReplaceUrl } from "/@/utils/imgurl";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";
export default {
  name: "imgTextStyle",
  components: {
    ElForm,
    ElFormItem,
    ElButton,
    ElInput,
    ElCheckbox,
    ElImage,
    ElRadio,
    ElSlider,
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
    const activeType = ref("imgText");
    const urlModal = ref(false);

    const [registerFileManage, { openModal }] = useModal();

    // 切换顶部
    const change = ({ type }) => {
      activeType.value = type;
    };

    // 修改布局样式
    const changeStyle = (classStyle) => {
      let width = 0;
      if (["wrapper-3", "wrapper-4"].includes(classStyle)) {
        width = 50;
      } else if (["wrapper-2"].includes(classStyle)) {
        width = 100;
      }
      props.datas.datas.width = width;
      props.datas.datas.styleClass = classStyle;
    };

    // 打开选择图片弹窗
    const selectIcon = () => {
      openModal(true, {
        getnumber: "one",
      });
    };

    // 修改图片回调
    const selectImg = ({ url }) => {
      props.datas.datas.imgUrl = ReplaceUrl(url);
    };

    // 设置链接回调
    const dialogClosed = (data) => {
      const { type, content, closeType } = data;
      urlModal.value = false;
      if (closeType == "cancel") return;
      props.datas.datas.jumpType = type;
      Object.keys(content).forEach((key) => {
        props.datas.datas.urlInfo[key] = content[key];
      });
    };

    // 格式化tip
    const formatTip = (value) => {
      return `${value}%`;
    };

    return {
      change,
      changeStyle,
      activeType,
      registerFileManage,
      selectIcon,
      selectImg,
      urlModal,
      dialogClosed,
      formatTip,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;

  .styl-list {
    display: flex;
    .style-item {
      display: block;
      width: 60px;
      height: 52px;
      background: url("../../../assets/images/bg.png") no-repeat;
      border: 1px solid rgb(226, 226, 226);
      margin-right: 10px;
      cursor: pointer;
      &.active {
        border-color: #409eff;
      }
      &:nth-of-type(1) {
        background-position: -1553px 0;
      }
      &:nth-of-type(2) {
        background-position: -1553px -434px;
      }
      &:nth-of-type(3) {
        background-position: -1553px -720px;
      }
      &:nth-of-type(4) {
        background-position: -1553px -792px;
      }
    }
  }

  .form {
    padding: 15px 20px 0;
    .form-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      .title {
        width: 70px;
        text-align: right;
        margin-right: 10px;
        line-height: 30px;
      }
      .form-item-content {
        flex: 1;
        display: flex;
        align-items: center;
        .title-text {
          border: 1px solid #e3e2e8;
          color: #333;
          height: 30px;
          text-overflow: ellipsis;
          border-radius: 2px;
          padding: 0 8px;
          box-sizing: border-box;
          font-size: 13px;
          margin-right: 15px;
        }
        .check-box {
          position: relative;
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #333;
          user-select: none;
          cursor: pointer;
          &.active {
            span::after {
              content: "";
              display: inline-block;
              position: absolute;
              top: 0;
              left: 0;
              width: 16px;
              height: 16px;
              background-image: url("../../../assets/images/icon-list.png");
              background-position: -516px 1px;
            }
          }
          span {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid #d0d4d7;
            border-radius: 1px;
            margin-right: 10px;
          }
        }
        .img-content {
          img {
            margin-top: 15px;
            width: 105px;
            height: 70px;
          }
        }
        .link-content {
          display: flex;
          ::v-deep .el-input {
            flex: 1;
            margin-right: 10px;
          }
        }
        ::v-deep .width-content {
          width: 100%;
          padding: 0 15px;
          box-sizing: border-box;
          .el-slider__button {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
}
</style>
