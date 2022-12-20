<template>
  <el-dialog
    v-model="dialogVisible"
    width="30%"
    destroy-on-close
    append-to-body
    :show-close="false"
  >
    <template #title>
      <p class="dialog">设置跳转链接地址</p>
    </template>

    <div class="item">
      <div class="title">链接类型：</div>
      <ul class="url-types">
        <li
          :class="{
            active: urlType === 'not',
          }"
          @click="urlType = 'not'"
        >
          <span></span>无
        </li>
        <li
          :class="{
            active: urlType === 'interior',
          }"
          @click="urlType = 'interior'"
        >
          <span></span>站内链接
        </li>
        <li
          :class="{
            active: urlType === 'exterior',
          }"
          @click="urlType = 'exterior'"
        >
          <span></span>站外链接
        </li>
      </ul>
    </div>

    <div class="item" v-if="urlType === 'interior'">
      <div class="title">站内页面：</div>
      <el-select placeholder="页面" v-model="interiorPage">
        <el-option
          v-for="item in pageList"
          :key="item.uuid"
          :label="item.name"
          :value="item.uuid"
        />
      </el-select>
    </div>

    <div class="item" v-if="urlType === 'exterior'">
      <div class="title">自定义地址：</div>
      <el-input placeholder="http://" v-model="url" />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handle('confirm')"> 确认 </el-button>
        <el-button @click="handle('cancel')">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, watch } from "vue";
import { ElButton, ElDialog, ElSelect, ElOption, ElInput } from "element-plus";
import { siteData } from "../../../store";
import { storeToRefs } from "pinia";
import _ from "lodash-es";
export default {
  name: "setJumpUrl",
  components: {
    ElDialog,
    ElSelect,
    ElOption,
    ElInput,
    ElButton,
  },
  props: {
    dialogVisible: {
      typeof: Boolean,
      default: () => false,
    },
    jumpType: String,
    urlInfo: Object,
  },
  setup(props, { emit }) {
    const urlType = ref(""); // not interior exterior
    const url = ref(""); // 站外地址
    const interiorPage = ref(""); // 站内页面id
    const store = siteData();
    const { pageList } = storeToRefs(store);
    watch(
      () => props.dialogVisible,
      (val) => {
        if (!val) return;
        const { jumpType, urlInfo } = props;
        urlType.value = jumpType;
        url.value = urlInfo.url;
        interiorPage.value = urlInfo.pageId;
      }
    );

    // 关闭弹窗回调
    const handle = (res) => {
      let result = {
        type: urlType.value,
        content: {
          pageName: "",
          pageId: "",
          url: "",
        },
      };
      if (res === "confirm" && urlType.value === "interior") {
        result.content.pageName = _.find(pageList.value, [
          "uuid",
          interiorPage.value,
        ]).name;
        result.content.pageId = interiorPage.value;
        result.content.url = ``;
      } else if (res === "confirm" && urlType.value === "exterior") {
        result.content.url = url.value;
      }
      emit("hide", { ...result, closeType: res });
    };
    return {
      urlType,
      handle,
      url,
      interiorPage,
      pageList,
    };
  },
};
</script>

<style lang="less" scoped>
.dialog {
  font-size: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e3e2e8;
}
.item {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  .title {
    width: 100px;
    text-align: right;
    font-size: 13px;
    color: #333;
    margin-right: 10px;
  }
  .url-types {
    display: flex;
    li {
      display: flex;
      align-items: center;
      margin-right: 15px;
      &.active {
        span::after {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: inline-block;
          content: "";
          width: 8px;
          height: 8px;
          background-color: #828282;
          border-radius: 50%;
        }
      }
      span {
        position: relative;
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #d8d8d8;
        margin-right: 6px;
      }
    }
  }
  ::v-deep .el-input {
    width: 300px;
  }
}
</style>
