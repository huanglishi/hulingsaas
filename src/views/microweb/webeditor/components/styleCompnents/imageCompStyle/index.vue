<template>
  <div class="wrapper">
    <div class="navs">
      <div>图片</div>
    </div>
    <div class="content">
      <div class="set-item">
        <div class="title">图片：</div>
        <div class="set-item-content">
          <el-button @click="chanImage">修改图片</el-button>
          <a target="__blank" :href="datas.datas.image">
            <el-image
              style="width: 120px; height: 70px"
              fit="contain"
              :src="datas.datas.image"
            />
          </a>
        </div>
      </div>

      <div class="set-item">
        <div class="title">宽高：</div>
        <div class="size-item-content">
          <el-input v-model="datas.datas.width" />
          <i></i>
          <el-input v-model="datas.datas.height" />
        </div>
      </div>

      <div class="set-item">
        <div class="title">链接：</div>
        <div class="link-content">
          <el-input
            v-if="datas.datas.jumpType === 'exterior'"
            v-model="datas.datas.urlInfo.url"
          />
          <el-input
            v-else-if="datas.datas.jumpType === 'interior'"
            disabled
            v-model="datas.datas.urlInfo.pageName"
          />
          <el-input v-else disabled />
          <el-button @click="() => (urlModal = true)">设置链接</el-button>
        </div>
      </div>

      <div class="set-item">
        <div class="title">描述：</div>
        <div class="alt-content">
          <el-input
            type="textarea"
            v-model="datas.datas.alt"
            placeholder="添加图片描述（alt）有利于网站关键词排名"
          />
        </div>
      </div>

      <div class="set-item">
        <div class="title">图形：</div>
        <ul class="img-content">
          <li
            class="not"
            :class="{
              active: datas.datas.graphics === 0,
            }"
            @click="changGraphics(0, '0')"
          >
            无
          </li>
          <li
            class="item"
            style="background-position: 0 -1307px"
            :class="{
              active: datas.datas.graphics === 1,
            }"
            @click="changGraphics(1, '30px 30px 30px 30px')"
          ></li>
          <li
            class="item"
            :class="{
              active: datas.datas.graphics === 2,
            }"
            style="background-position: 0 -1375px"
            @click="changGraphics(2, '50%')"
          ></li>
        </ul>
      </div>
    </div>
  </div>
  <FileManage @register="registerFileManage" @success="selectImg" />
  <set-jump-url
    :jumpType="datas.datas.jumpType"
    :urlInfo="datas.datas.urlInfo"
    :dialogVisible="urlModal"
    @hide="dialogClosed"
  />
</template>

<script>
import { ElImage, ElButton, ElInput } from "element-plus";
import { ReplaceUrl } from "/@/utils/imgurl";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";
import compList from "../../publicComponents";
import { ref } from "vue";
export default {
  name: "imageCompStyle",
  components: {
    ElImage,
    ElButton,
    ElInput,
    FileManage,
    ...compList,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const urlModal = ref(false);
    const [registerFileManage, { openModal }] = useModal();

    const selectImg = ({ url }) => {
      props.datas.datas.image = ReplaceUrl(url);
    };

    const chanImage = () => {
      openModal(true, {
        getnumber: "one",
      });
    };

    const dialogClosed = (data) => {
      urlModal.value = false;
      const { closeType, type, content } = data;
      if (closeType !== "cancel") {
        props.datas.datas.jumpType = type;
        props.datas.datas.urlInfo.pageName = content.pageName;
        props.datas.datas.urlInfo.pageId = content.pageId;
        props.datas.datas.urlInfo.url = content.url;
      }
    };

    const changGraphics = (graphics, data) => {
      props.datas.datas.graphics = graphics;
      props.datas.datas.borderRadius = data;
    };

    return {
      registerFileManage,
      selectImg,
      chanImage,
      changGraphics,
      urlModal,
      dialogClosed,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
}
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
.content {
  padding: 20px 20px 0;
}
.set-item {
  display: flex;
  margin-bottom: 20px;
  .title {
    width: 70px;
    line-height: 34px;
  }
  .set-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .el-image {
      margin-top: 20px;
      border: 1px solid rgb(222, 222, 222);
    }
  }
  .link-content {
    display: flex;
    .el-input {
      margin-right: 15px;
    }
  }
  .alt-content {
    flex: 1;
    .el-textarea {
      flex: 1;
    }
  }
  .img-content {
    display: flex;
    li {
      width: 62px;
      height: 48px;
      border: 1px solid #e7e7eb;
      margin-right: 15px;
      cursor: pointer;
      &.not {
        line-height: 48px;
        text-align: center;
        color: #666;
      }
      &.item {
        background-image: url("../../../assets/images/bg.png");
        background-repeat: no-repeat;
      }
      &.active {
        position: relative;
        border-color: #5874d8;
        &::after {
          position: absolute;
          right: 0;
          bottom: 0;
          display: block;
          content: "";
          width: 28px;
          height: 24px;
          background-image: url("../../../assets/images/icon-list.png");
          background-position: -197px -24px;
          background-repeat: no-repeat;
        }
      }
    }
  }
  .size-item-content {
    display: flex;
    align-items: center;
    .el-input {
      width: 50px;
      text-align: center;
    }
    i {
      display: block;
      width: 26px;
      height: 7px;
      background-image: url("../../../assets/images/icon-list.png");
      background-position: -1118px 0;
    }
  }
}
</style>
