<template>
  <div class="wrap">
    <h2 class="title">页面配置</h2>
    <el-form class="form">
      <el-form-item label="页面名称">
        <el-input
          placeholder="请填写页面名称"
          v-model="datas.name"
          @input="inputPageName"
        />
      </el-form-item>
      <el-form-item label="页面描述">
        <el-input
          type="textarea"
          placeholder="请填写页面描述"
          v-model="datas.pageDetail"
        />
      </el-form-item>
      <el-form-item label="微站入口">
        <el-switch v-model="isHome" @change="changHome" />
        <p style="font-size: 12px; color: red; margin-left: 10px">
          是微站入口，即网站首页(仅一个入口)
        </p>
      </el-form-item>
      <el-divider />
      <el-form-item label="显示头部">
        <el-switch v-model="datas.templateJson.headerConfig.showHeader" />
      </el-form-item>

      <el-form-item label="头部高度" class="transverse">
        <el-slider
          size="small"
          v-model="datas.templateJson.headerConfig.headerHeight"
          :min="40"
          :max="100"
        />
        <el-input-number
          size="small"
          v-model="datas.templateJson.headerConfig.headerHeight"
          :min="40"
          :max="100"
        />
      </el-form-item>
      <el-form-item label="右边按钮">
        <el-switch v-model="datas.templateJson.headerConfig.showRightBtn" />
      </el-form-item>

      <template v-if="datas.templateJson.headerConfig.showRightBtn">
        <el-form-item label="按钮文字">
          <el-input
            placeholder="右侧按钮文字"
            v-model="datas.templateJson.headerConfig.rightText"
          />
        </el-form-item>
        <el-form-item label="颜色大小" class="colorSize">
          <el-color-picker v-model="datas.templateJson.headerConfig.rightTextColor" />
          <el-slider
            v-model="datas.templateJson.headerConfig.rightTextFontSize"
            :min="10"
            :max="35"
          />
        </el-form-item>

        <el-form-item
          label="右边按钮跳转连接（内部连接请先保存页面才能用）"
          class="jumpUrl"
        >
          <el-select v-model="datas.templateJson.headerConfig.jumpType">
            <el-option label="不跳转" value="not" />
            <el-option label="内部链接" value="interior" />
            <el-option label="外部链接" value="exterior" />
          </el-select>
          <el-input
            placeholder="https://"
            v-model="datas.templateJson.headerConfig.urlInfo.url"
            v-if="datas.templateJson.headerConfig.jumpType === 'exterior'"
          />

          <el-select
            placeholder="选择跳转页面"
            v-else-if="datas.templateJson.headerConfig.jumpType === 'interior'"
            :model-value="datas.templateJson.headerConfig.urlInfo.pageId"
            @change="selectPage"
          >
            <el-option
              v-for="item in pageList"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid"
            />
          </el-select>
          <el-input disabled placeholder="无" v-else />
        </el-form-item>
      </template>

      <el-form-item label="返回按钮" v-if="!isHome">
        <el-switch v-model="datas.templateJson.headerConfig.showLeftBtn" />
      </el-form-item>

      <template v-if="datas.templateJson.headerConfig.showLeftBtn">
        <el-form-item label="按钮大小" class="transverse">
          <el-slider
            size="small"
            v-model="datas.templateJson.headerConfig.backBtnFontSize"
            :min="12"
            :max="50"
          />
          <el-input-number
            size="small"
            v-model="datas.templateJson.headerConfig.backBtnFontSize"
            :min="12"
            :max="50"
          />
        </el-form-item>
      </template>
      <el-divider />

      <el-form-item label="页面背景颜色">
        <el-color-picker v-model="datas.templateJson.backgroundColor" />
      </el-form-item>

      <el-form-item label="显示底部导航">
        <el-switch v-model="datas.templateJson.showFooterNav" />
      </el-form-item>

      <el-form-item label="页面背景图片背景颜色" class="bg">
        <div class="btns">
          <el-button @click="changBg('change')">更换图片</el-button>
          <el-button type="primary" @click="changBg('clear')">清空图片</el-button>
        </div>
        <img :src="datas.templateJson.backgroundImage" alt="" />
      </el-form-item>
    </el-form>
  </div>
  <FileManage @register="registerFileManage" @success="selectImg"></FileManage>
</template>

<script>
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSwitch,
  ElSlider,
  ElColorPicker,
  ElDivider,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElButton,
} from "element-plus";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";
import { ReplaceUrl } from "/@/utils/imgurl";
import { siteData } from "../../store";
import _ from "lodash-es";
import { upPageIshome } from "/@/api/microweb/webeditor";
import { computed } from "vue";
import { storeToRefs } from "pinia";
export default {
  name: "setingPage",
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElSwitch,
    ElSlider,
    ElColorPicker,
    ElDivider,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElButton,
    FileManage,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const store = siteData();
    const { pageList } = storeToRefs(store);

    const [registerFileManage, { openModal }] = useModal();

    const changBg = (mode) => {
      if (mode === "clear") {
        props.datas.templateJson.backgroundImage = "";
      } else {
        openModal(true, {
          getnumber: "one",
        });
      }
    };

    const selectPage = (uuid) => {
      const page = _.find(pageList.value, ["uuid", uuid]);
      if (page) {
        const { name, uuid } = page;
        props.datas.templateJson.headerConfig.urlInfo.pageName = name;
        props.datas.templateJson.headerConfig.urlInfo.pageId = uuid;
      }
    };

    const selectImg = ({ url }) => {
      props.datas.templateJson.backgroundImage = ReplaceUrl(url);
    };

    // 更新首页
    const changHome = async (e) => {
      const { id } = props.datas;
      // 找到上次设置的home页，重置
      const prePageHome = _.find(pageList.value, ["ishome", 1]);
      if (prePageHome && id !== prePageHome.id) {
        await upPageIshome({ id: prePageHome.id, ishome: 0 });
      }

      // 设置当前页
      await upPageIshome({ id: id, ishome: e ? 1 : 0 });

      // 设置本地数据
      pageList.value.forEach((item) => {
        if (item.id === id) {
          item.ishome = e ? 1 : 0;
        }
        if (item.id !== id) {
          item.ishome = 0;
        }
      });
    };

    const isHome = computed({
      get: () => props.datas.ishome == 1,
      set: (val) => {
        props.datas.templateJson.headerConfig.showLeftBtn = !val;
        props.datas.ishome = val ? 1 : 0;
      },
    });

    // 同步编辑页面名称
    const inputPageName = _.debounce((e) => {
      const { id } = props.datas;
      const page = _.find(pageList.value, ["id", id]);
      page["name"] = e;
    }, 500);

    return {
      changBg,
      registerFileManage,
      selectImg,
      inputPageName,
      changHome,
      isHome,
      pageList,
      selectPage,
    };
  },
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  min-height: 100%;
  padding-bottom: 30px;
  background: #fff;
}
.title {
  font-size: 18px;
  font-weight: 700;
  line-height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(221, 221, 221, 0.5);
}
.form {
  padding: 0 20px;
}
::v-deep .el-form {
  .el-divider {
    margin: 0 0 16px 0;
  }
  .transverse {
    .el-form-item__content {
      display: flex;
      justify-content: space-between;
      .el-slider {
        flex: 0.6;
        padding-left: 10px;
      }
      .el-input-number {
        flex: 0.3;
      }
    }
  }
  .colorSize {
    .el-form-item__content {
      display: flex;
      justify-content: space-between;
      .el-slider {
        flex: 0.9;
      }
    }
  }
  .jumpUrl {
    display: flex;
    flex-direction: column;
    .el-form-item__label {
      text-align: left;
    }
    .el-form-item__content {
      display: flex;
      .el-select {
        &:nth-of-type(1) {
          flex: 0.3;
          margin-right: 10px;
        }
        &:nth-of-type(2) {
          flex: 0.7;
        }
      }
      .el-input {
        flex: 0.7;
      }
    }
  }
  .bg {
    flex-direction: column;
    .el-form-item__label {
      text-align: left;
    }
    .el-form-item__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      img {
        display: block;
        width: 60px;
        margin-top: 15px;
      }
    }
  }
}
</style>
