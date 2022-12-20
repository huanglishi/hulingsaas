<template>
  <div class="wrapper">
    <right-nav-header
      :navs="[
        {
          text: '轮播多图',
          type: 'swiper',
        },
        {
          text: '编辑模块',
          type: 'editModule',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />
    <div class="cotent">
      <div class="img-list-form" v-if="activeName === 'swiper'">
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
          <div class="title">添加图片：</div>
          <div class="add-image">
            <div class="active radio">
              <span class="radio-item"></span>
              添加图片
            </div>
            <p v-if="datas.datas.imgList.length !== 0">
              图片已上传{{ datas.datas.imgList.length }}张
            </p>
          </div>
        </div>

        <div class="image-list">
          <div
            class="image-empty"
            v-if="datas.datas.imgList.length === 0"
            @click="addImage"
          ></div>
          <template v-else>
            <i></i>
            <div class="content">
              <ul class="images">
                <li class="add-icon" @click="addImage"></li>
                <li
                  :class="{
                    active: curImage.imgObj.id && item.id === curImage.imgObj.id,
                  }"
                  @click="editImg(item)"
                  v-for="item in datas.datas.imgList"
                  class="img-item"
                  :key="item.id"
                >
                  <img :src="item.imgUrl" alt="" />
                  <span class="delet-icon" @click="deletImg(item)"></span>
                </li>
              </ul>
            </div>
            <i></i>
          </template>
        </div>

        <template v-if="!_.isEmpty(curImage.imgObj)">
          <div class="form-item">
            <div class="title">链接：</div>
            <div class="set-item">
              <input
                type="text"
                disabled
                model-value="无"
                v-if="curImage.imgObj.jumpType === 'not'"
              />
              <input
                type="text"
                disabled
                v-model="curImage.imgObj.urlInfo.pageName"
                v-else-if="curImage.imgObj.jumpType === 'interior'"
              />
              <input type="text" v-else v-model="curImage.imgObj.urlInfo.url" />

              <el-button @click="() => (urlModal = true)">设置链接</el-button>
            </div>
          </div>
          <div class="form-item">
            <div class="title">名称：</div>
            <div class="set-item">
              <input type="text" v-model="curImage.imgObj.name" />
            </div>
          </div>
          <div class="form-item">
            <div class="title">描述：</div>
            <div class="set-item">
              <input type="text" v-model="curImage.imgObj.detail" />
            </div>
          </div>
        </template>

        <fold-comp
          title="模块样式"
          @change="(val) => changeFold('moduleStyle', val)"
          :open="foldControll.moduleStyle"
        >
          <ul class="flex-list">
            <li
              :class="{
                active: datas.datas.flexUse === 1,
              }"
              @click="() => (datas.datas.flexUse = 1)"
              style="background-position: -1461px -144px"
            ></li>
            <li
              style="background-position: -1461px -216px"
              :class="{
                active: datas.datas.flexUse === 2,
              }"
              @click="() => (datas.datas.flexUse = 2)"
            ></li>
          </ul>
        </fold-comp>

        <fold-comp
          title="基础设置"
          @change="(val) => changeFold('baseSet', val)"
          :open="foldControll.baseSet"
        >
          <div class="form-item">
            <div class="title">图片名称：</div>
            <div class="add-image">
              <div
                class="radio"
                :class="{
                  active: datas.datas.showImgName,
                }"
                @click="() => (datas.datas.showImgName = true)"
              >
                <span class="radio-item"></span>
                显示
              </div>
              <div
                class="radio"
                :class="{
                  active: !datas.datas.showImgName,
                }"
                @click="() => (datas.datas.showImgName = false)"
              >
                <span class="radio-item"></span>
                隐藏
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="title">图片描述：</div>
            <div class="add-image">
              <div
                class="radio"
                :class="{
                  active: datas.datas.showImgDetail,
                }"
                @click="() => (datas.datas.showImgDetail = true)"
              >
                <span class="radio-item"></span>
                显示
              </div>
              <div
                class="radio"
                :class="{
                  active: !datas.datas.showImgDetail,
                }"
                @click="() => (datas.datas.showImgDetail = false)"
              >
                <span class="radio-item"></span>
                隐藏
              </div>
            </div>
          </div>
        </fold-comp>
      </div>

      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>

  <FileManage @register="registerFileManage" @success="selectImg"></FileManage>
  <set-jump-url
    :jumpType=" curImage.imgObj.jumpType"
    :urlInfo=" curImage.imgObj.urlInfo"
    :dialogVisible="urlModal"
    @hide="dialogClosed"
  />
</template>

<script lang="ts">
import { ElButton } from "element-plus";
import { ref, reactive } from "vue";
import compList from "../../publicComponents";
import { ReplaceUrl } from "/@/utils/imgurl";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";
import _ from "lodash-es";
export default {
  name: "imgListStyle",
  components: {
    ElButton,
    FileManage,
    ...compList,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const activeName = ref("swiper");
    const curImage = reactive({ imgObj: {} }); // 当前编辑的图片
    const urlModal = ref(false);
    const foldControll = reactive({
      moduleStyle: false,
      baseSet: false,
    }); // 控制折叠面板
    const [registerFileManage, { openModal }] = useModal();

    // 选择图片回调
    const selectImg = ({ list }: any) => {
      list.forEach((url: String) => {
        props.datas.datas.imgList.push({
          imgUrl: ReplaceUrl(url as string),
          jumpType: "not",
          urlInfo: {
            pageName: "",
            pageId: "",
            url: "",
          },
          name: "",
          detail: "",
          id: _.uniqueId("img_"),
        });
      });
    };

    // 选择图片
    const addImage = () => {
      openModal(true, {
        getnumber: "more",
      });
    };

    // 选择图片并编辑
    const editImg = (imgInfo: any) => {
      curImage.imgObj = imgInfo;
    };

    // 设置跳转链接回调
    const dialogClosed = (data: any) => {
      const { type, content, closeType } = data;
      urlModal.value = false;
      if (closeType === "cancel") return;
      curImage.imgObj["jumpType"] = type;
      curImage.imgObj["urlInfo"].pageName = content.pageName;
      curImage.imgObj["urlInfo"].pageId = content.pageId;
      curImage.imgObj["urlInfo"].url = content.url;
    };

    // 切换折叠面板
    const changeFold = (mode, value) => {
      _.keys(foldControll).forEach((key) => {
        if (mode !== key) {
          foldControll[key] = false;
        } else {
          foldControll[key] = value;
        }
      });
    };

    // 删除图片
    const deletImg = ({ id }) => {
      props.datas.datas.imgList = _.filter(
        props.datas.datas.imgList,
        (item) => item.id !== id
      );
    };

    return {
      activeName,
      registerFileManage,
      selectImg,
      addImage,
      curImage,
      editImg,
      urlModal,
      dialogClosed,
      foldControll,
      changeFold,
      deletImg,
      _,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  .cotent {
    padding: 15px 10px 0;
  }
  .img-list-form {
    .form-item {
      display: flex;
      margin-bottom: 20px;
      .form-item-content {
        display: flex;
      }
      .add-image {
        display: flex;
        align-items: center;
        height: 30px;
        flex: 1;

        p {
          justify-self: flex-end;
          color: #828282;
          margin-left: 30px;
        }
      }
    }
  }
  .image-list {
    display: flex;
    width: 100%;
    margin-bottom: 20px;
    .image-empty {
      position: relative;
      height: 100px;
      width: 100%;
      border: 1px dashed #ccc;
      user-select: none;
      cursor: pointer;
      &:hover {
        border-color: #5874d8;
      }
      &::after {
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        content: "";
        width: 32px;
        height: 35px;
        background-image: url("../../../assets/images/icon-list.png");
        background-position: -323px -33px;
        background-repeat: no-repeat;
      }
    }
    i {
      width: 16px;
      height: 20px;
    }
    .content {
      flex: 1;
      .images {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;

        li {
          position: relative;
          width: 72px;
          height: 72px;
          margin-bottom: 10px;
          text-align: center;
          font-size: 0;
          line-height: 0;
          border: 1px solid #ccc;
          &:not(:nth-of-type(5)):not(:nth-of-type(10)) {
            margin-right: 8px;
          }
        }
        .img-item {
          position: relative;
          &:hover .delet-icon {
            display: block;
          }
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
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
        .add-icon {
          position: relative;
          border: 1px dashed #ccc;
          box-sizing: border-box;
          cursor: pointer;
          &::after {
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            content: "";
            width: 32px;
            height: 35px;
            background-image: url("../../../assets/images/icon-list.png");
            background-position: -323px -33px;
            background-repeat: no-repeat;
          }
          &:hover {
            border-color: #5874d8;
          }
        }
        .delet-icon {
          position: absolute;
          top: -5px;
          right: -5px;
          display: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-image: url("../../../assets/images/icon-list.png");
          background-position: -435px 0;
          cursor: pointer;
        }
      }
    }
  }
  .set-item {
    display: flex;
    align-items: center;
    width: 100%;
    > input {
      flex: 1;
      color: #333;
      border: 1px solid #e3e2e8;
      font-size: 13px;
      padding: 0 8px;
      height: 34px;
      box-sizing: border-box;
    }
    ::v-deep .el-button {
      margin-left: 15px;
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
      background-image: url("../../../assets/images/bg.png");
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
          background-image: url("../../../assets/images/icon-list.png");
          background-position: -207px -34px;
        }
      }
      &:not(:last-of-type) {
        margin-right: 10px;
      }
    }
  }
}
</style>
