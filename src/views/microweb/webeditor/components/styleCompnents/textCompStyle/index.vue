<!-- 设置文本样式组件 -->
<template>
  <div class="wrap">
    <div class="navs">
      <div>文本</div>
    </div>
    <div class="form">
      <el-form label-position="left" label-width="80px" v-if="activeName == 'text'">
        <el-form-item label="字号">
          <el-select placeholder="选择字号" v-model="datas.datas.fontSize">
            <el-option v-for="item in fontSize" :key="item" :value="item"
              >{{ item }}px</el-option
            >
          </el-select>
        </el-form-item>

        <el-form-item label="链接" class="set-url">
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
        </el-form-item>

        <el-form-item label="颜色">
          <el-color-picker v-model="datas.datas.color" />
        </el-form-item>
      </el-form>
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
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElButton,
  ElColorPicker,
  ElCheckbox,
  ElInput,
} from "element-plus";
import publicComps from "../../publicComponents";
import { reactive, ref } from "vue";
export default {
  name: "textCompStyle",
  components: {
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElButton,
    ElColorPicker,
    ElCheckbox,
    ElInput,
    ...publicComps,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const activeName = ref("text");
    const urlModal = ref(false);
    const fontSize = reactive([]);
    const colors = reactive([
      "rgb(255,114,20)",
      "rgb(242,48,48)",
      "rgb(255,71,141)",
      "rgb(6,193,174)",
      "rgb(251,190,64)",
      "rgb(66,189,86)",
    ]);

    for (let i = 12; i <= 120; i++) {
      fontSize.push(i);
    }

    const change = ({ type }) => {
      activeName.value = type;
    };

    const dialogClosed = (e) => {
      urlModal.value = false;
      if (e.closeType === "cancel") return;
      const { content, type } = e;
      props.datas.datas.jumpType = type;
      props.datas.datas.urlInfo.url = content.url;
      props.datas.datas.urlInfo.pageName = content.pageName;
      props.datas.datas.urlInfo.pageId = content.pageId;
    };

    return {
      activeName,
      change,
      fontSize,
      colors,
      urlModal,
      dialogClosed,
    };
  },
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
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
}
::v-deep .form {
  padding: 20px 20px 0;
  .set-url {
    .el-form-item__content {
      display: flex;
      justify-content: space-between;
      .el-input {
        flex: 1;
        margin-right: 10px;
      }
    }
  }
  .module-title {
    .el-form-item__content {
      display: flex;
      justify-content: space-between;
      .el-input {
        flex: 1;
        margin-right: 10px;
      }
    }
  }
}
</style>
