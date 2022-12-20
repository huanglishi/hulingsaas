<template>
  <div class="wrapper">
    <div class="navs">
      <div>按钮</div>
    </div>
    <div class="content">
      <div class="set-item">
        <div class="title">文本：</div>
        <div class="text-item-content">
          <el-input v-model="datas.datas.text" />
        </div>
      </div>

      <div class="set-item">
        <div class="title">字号：</div>
        <div class="text-item-content">
          <el-select placeholder="选择字号" v-model="datas.datas.fontSize">
            <el-option v-for="item in fontSize" :key="item" :value="item"
              >{{ item }}px</el-option
            >
          </el-select>
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
        <div class="title">颜色：</div>
        <div class="color-content">
          <el-color-picker v-model="datas.datas.textColor" />
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
    </div>
  </div>
  <set-jump-url
    :jumpType="datas.datas.jumpType"
    :urlInfo="datas.datas.urlInfo"
    :dialogVisible="urlModal"
    @hide="dialogClosed"
  />
</template>

<script>
import { ElInput, ElButton, ElSelect, ElOption, ElColorPicker } from "element-plus";
import { reactive, ref } from "vue";
import compList from "../../publicComponents";

export default {
  name: "buttonCompStyle",
  components: {
    ElInput,
    ElButton,
    ElSelect,
    ElOption,
    ElColorPicker,
    ...compList,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const urlModal = ref(false);
    const fontSize = reactive([]);
    for (let i = 12; i <= 120; i++) {
      fontSize.push(i);
    }

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
    return {
      fontSize,
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
  .text-item-content {
    width: 100%;
  }
  .link-content {
    display: flex;
    .el-input {
      margin-right: 15px;
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
