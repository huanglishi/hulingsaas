<template>
  <header class="header">
    <space size="large">
      <a-button type="primary" size="middle" @click="save">保存</a-button>
      <a-button type="primary" size="middle" @click="preview">预览</a-button>
      <a-button type="primary" size="middle" @click="saveAssumesTemplate"
        >另存为模板</a-button
      >
    </space>
  </header>

  <!-- 预览model -->
  <el-dialog
    v-model="showpreview"
    custom-class="reset-style"
    width="50%"
    destroy-on-close
  >
    <div class="content-wrapper">
      <div class="left">
        <iframe :src="`${previewUrl}`" frameborder="0"></iframe>
      </div>
      <div class="right">
        <div class="code">
          <p>二维码分享</p>
          <div id="qrcode" class="code-img"></div>
        </div>
        <div class="copy">
          <el-input readonly :model-value="`${previewUrl}`" />
          <el-button @click="copyCode">复制</el-button>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 当页面保存为模板 -->
  <el-dialog
    v-model="saveTemplateModal"
    custom-class="reset-style"
    width="50%"
    destroy-on-close
  >
    <div class="save-template-modal">
      <div class="left-content">
        <iframe :src="previewUrl" frameborder="0"></iframe>
      </div>
      <div class="right-content">
        <el-form label-width="80px">
          <el-form-item label="保存方式">
            <el-radio-group v-model="saveUse">
              <el-radio label="page" value="page">另存页面为模板</el-radio>
              <el-radio label="site" value="site">另存站点为模板</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="模板名称">
            <el-input placeholder="模板名称" v-model="templateName" />
          </el-form-item>

          <template v-if="saveUse === 'page'">
            <el-form-item label="所属分类">
              <el-select
                @change="changeIndustry"
                v-model="industry"
                placeholder="请选择模板所属分类"
              >
                <el-option label="行业" value="1" />
                <el-option label="场景" value="2" />
                <el-option label="主体" value="3" />
              </el-select>
            </el-form-item>

            <el-form-item label="模板类型">
              <el-select placeholder="请选择模板所属类型" v-model="classify">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="item in classifyList.value"
                  :key="item.id"
                />
              </el-select>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="站点分类">
              <el-cascader
                v-model="siteClassify"
                :options="siteClassifyList.value"
                placeholder="请选择站点分类"
                :props="{ label: 'name', value: 'id' }"
              />
            </el-form-item>
          </template>

          <el-form-item label="预览图">
            <div class="img" v-if="previewImg" @click="selectpreviewimg">
              <img :src="previewImg" />
            </div>
            <div class="preview-img" v-else @click="selectpreviewimg">
              <i class="iconfont icon-upload"></i>
            </div>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="saveTemplate">保存模板</el-button>
      </div>
    </div>
  </el-dialog>
  <FileManage @register="registerFileManage" @success="selectImg"></FileManage>
</template>

<script>
import {
  saveMicwebPabe,
  saveFooterTabBar,
  saveTplpage,
  getTplPageGroup,
  getTplGroup,
  saveWebTpl,
} from "/@/api/microweb/webeditor";
import { useModal } from "/@/components/Modal";
import { FileManage } from "/@/components/FileManage";
import _ from "lodash-es";
import QRCode from "qrcode";
import {
  ElDialog,
  ElMessage,
  ElSelect,
  ElOption,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElCascader,
} from "element-plus";
import { siteData } from "../store";
import { Button, Space } from "ant-design-vue";
import { ref, reactive, watch, nextTick, computed } from "vue";
import { ReplaceUrl } from "/@/utils/imgurl";
import { useUserStore } from "/@/store/modules/user";

export default {
  name: "headerNav",
  components: {
    AButton: Button,
    Space,
    ElDialog,
    ElSelect,
    ElOption,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    FileManage,
    ElRadioGroup,
    ElRadio,
    ElCascader,
  },
  setup() {
    const userStore = useUserStore();
    const store = siteData();
    const showpreview = ref(false);
    const saveTemplateModal = ref(false);

    const industry = ref("");
    const classifyList = reactive({ value: [] });
    const classify = ref("");
    const previewImg = ref("");
    const templateName = ref("");
    const saveUse = ref("page");
    const siteClassify = ref("");
    const siteClassifyList = reactive({
      value: [],
    });

    const [registerFileManage, { openModal }] = useModal();

    const previewUrl = computed(
      () =>
        `${userStore.getUserInfo?.tplpreviewurl || ""}?pageId=${
          store.pageConfig.uuid
        }&siteId=${store.micwebInfo.id}`
    );

    watch(
      () => showpreview.value,
      (val) => {
        if (val) {
          nextTick(() => {
            QRCode.toCanvas(
              previewUrl.value,
              {
                width: 180,
                height: 180,
                margin: 0,
              },
              function (err, string) {
                document.getElementById("qrcode")?.appendChild(string);
              }
            );
          });
        }
      }
    );

    watch(saveUse, async (val) => {
      if (val === "site" && _.size(siteClassifyList.value) === 0) {
        const data = await getTplGroup();
        siteClassifyList.value = data;
      }
    });

    const saveAssumesTemplate = () => {
      save();
      saveTemplateModal.value = true;
    };

    const copyCode = () => {
      let clipboardObj = navigator.clipboard;
      console.log(clipboardObj)
      if (clipboardObj) {
        clipboardObj.writeText(previewUrl);
      } else {
        ElMessage({
          type: "warngin",
          message: "复制失败",
        });
      }
    };

    // 保存
    const save = async () => {
      const {
        pageConfig,
        navList,
        micwebInfo: { id },
        pageList,
      } = store;
      let isHasHome = false;

      pageList.forEach((item) => {
        if (item.ishome === 1) {
          isHasHome = item.ishome == 1;
        }
      });
      if (!isHasHome) {
        ElMessage({
          type: "warning",
          message: "当前站点没有设置首页，请先设置在保存！",
        });
        return false;
      }

      await saveMicwebPabe(pageConfig);
      await saveFooterTabBar({ footer_tabbar: navList, id });
      ElMessage({
        type: "success",
        message: "保存成功",
      });
    };

    // 预览
    const preview = async () => {
      await saveMicwebPabe(store.pageConfig);
      showpreview.value = true;
    };

    // 保存为模板
    const saveTemplate = async () => {
      let params = {};
      if (saveUse.value === "page") {
        params = {
          component: store.pageConfig.component,
          templateJson: store.pageConfig.templateJson,
          group_id: classify.value,
          title: templateName.value,
          image: previewImg.value,
        };
        await saveTplpage(params);
      } else {
        params = {
          micweb_id: store.micwebInfo.id,
          image: previewImg.value,
          title: templateName.value,
          cid: _.last(siteClassify.value),
          footer_tabbar: store.navList,
        };
        await saveWebTpl(params);
      }
      ElMessage({
        type: "success",
        message: "保存成功",
      });
    };

    const changeIndustry = async (type) => {
      const res = await getTplPageGroup({ type });
      classifyList.value = res;
    };

    const selectpreviewimg = () => {
      openModal(true, {
        getnumber: "one",
      });
    };

    const selectImg = ({ url }) => {
      previewImg.value = ReplaceUrl(url);
    };

    return {
      save,
      showpreview,
      preview,
      previewUrl,
      store,
      saveTemplate,
      saveTemplateModal,
      changeIndustry,
      industry,
      classifyList,
      classify,
      previewImg,
      registerFileManage,
      selectImg,
      selectpreviewimg,
      templateName,
      saveUse,
      siteClassifyList,
      siteClassify,
      saveAssumesTemplate,
      copyCode,
    };
  },
};
</script>

<style lang="less">
#box {
  position: fixed;
  top: 100px;
  left: 300px;
  right: 0;
  width: 375px;
  height: 498x;
  background-color: rgba(0, 0, 0, 0.2);
}
.reset-style {
  .el-dialog__header {
    padding: 0;
    .el-dialog__headerbtn {
      font-size: 30px;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>

<style lang="less" scoped>
.header {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 20px 0 0;
  z-index: 1;
  box-shadow: 0 1px 10px 1px rgba(129, 129, 129, 0.4);
  background-color: #fff;
}

.content-wrapper {
  display: flex;
  .left {
    display: flex;
    justify-content: center;
    padding: 40px 0;
    width: 550px;
    background-color: rgb(244, 244, 244);
    iframe {
      width: 375px;
      height: 600px;
      box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    }
  }
  .right {
    flex: 1;
    box-sizing: border-box;
    padding: 80px 60px 0;

    .code {
      border: 1px solid rgb(222, 222, 222);
      border-radius: 4px;
      p {
        color: rgb(88, 116, 216);
        text-align: center;
        line-height: 40px;
        border-bottom: 1px solid rgb(222, 222, 222);
      }
      .code-img {
        width: 180px;
        height: 180px;
        margin: 20px auto;
      }
    }
    .copy {
      display: flex;
      margin-top: 20px;
      .el-input {
        margin-right: 10px;
      }
    }
  }
}
.save-template-modal {
  display: flex;
  background-color: #fff;
  .left-content {
    width: 50%;
    padding: 30px 40px;
    background-color: #f4f4f4;
    iframe {
      width: 375px;
      height: 600px;
      box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    }
  }
  ::v-deep .right-content {
    width: 50%;
    padding: 70px 0 0 30px;
    box-sizing: border-box;
    .el-input {
      width: 200px;
    }
    .img,
    .preview-img {
      width: 80px;
      height: 80px;
      overflow: hidden;
      user-select: none;
      cursor: pointer;
    }
    .img img {
      width: 100%;
    }
    .preview-img {
      border: 1px dashed #666;
      text-align: center;
      i {
        font-size: 60px;
        line-height: 80px;
      }
    }
  }
}
</style>
