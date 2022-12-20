<template>
  <el-dialog v-model="modelValue" width="765px" destroy-on-close>
    <div class="wrapper">
      <div class="left">
        <iframe
          :src="`${tplpreviewurl}?templateId=${templateInfo.templateId}`"
          frameborder="0"
        ></iframe>
      </div>
      <div class="right">
        <div class="info">
          <h3>{{ templateInfo.templateClassify }}</h3>
          <p>页面模板名称：{{ templateInfo.templateName }}</p>
          <div class="use-btn">使用此页面</div>
        </div>

        <div class="btns">
          <el-button @click="pre" :disabled="templateInfo.index === 0">
            <i class="iconfont icon-jiantou-zuo"></i>
          </el-button>
          <el-button
            @click="next"
            :disabled="templateInfo.index === templateInfo.templateTotal - 1"
          >
            <i class="iconfont icon-jiantou-you"></i>
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref } from "vue";
import { ElDialog, ElButton } from "element-plus";
import { useUserStore } from "/@/store/modules/user";

export default {
  name: "previewPage",
  components: {
    ElDialog,
    ElButton,
  },
  props: {
    templateInfo: {
      type: Object,
      default: () => ({
        index: 0,
        templateId: "",
        templateClassify: "",
        templateName: "",
        templateTotal: 0,
      }),
    },
    modelValue: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ["changPre", "changNext"],
  setup(props, { emit }) {
    const userStore = useUserStore();
    const tplpreviewurl = ref(userStore.getUserInfo?.tplpreviewurl || "");

    const pre = () => {
      emit("changPre");
    };
    const next = () => {
      emit("changNext");
    };
    return {
      pre,
      next,
      tplpreviewurl,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
}
.left {
  flex: 1;
  iframe {
    width: 375px;
    height: 700px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    margin: 0 auto;
  }
}
.right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 310px;
  padding: 50px 0;
  box-sizing: border-box;
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h3 {
    font-size: 18px;
    font-weight: 700;
  }
  p {
    font-size: 14px;
    color: #666;
    margin: 20px 0;
  }
  .use-btn {
    height: 46px;
    color: #fff;
    text-align: center;
    line-height: 46px;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    width: 184px;
    background-color: #5874d8;
    margin-bottom: 100px;
  }
}
</style>
