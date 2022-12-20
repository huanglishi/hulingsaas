<template>
  <div class="template">
    <ul class="classify">
      <li
        class="item"
        :class="{ active: firstClassifyIndex === 0 }"
        @click="changeClassify(0)"
      >
        全部
      </li>
      <li
        class="item"
        :class="{ active: firstClassifyIndex === 1 }"
        @click="changeClassify(1)"
      >
        行业
      </li>
      <li
        class="item"
        :class="{ active: firstClassifyIndex === 2 }"
        @click="changeClassify(2)"
      >
        场景
      </li>
      <li
        class="item"
        :class="{ active: firstClassifyIndex === 3 }"
        @click="changeClassify(3)"
      >
        主体
      </li>
    </ul>

    <ul class="second-classify">
      <li
        class="item"
        v-for="item in classifyList.value"
        :key="item.id"
        :class="{ active: secondClassId === item.id }"
        @click="changeSecondClassicy(item)"
      >
        {{ item.name }}
      </li>
    </ul>

    <div class="template-list">
      <div class="empty-data" v-if="templateList.value.length === 0">
        <i class="iconfont icon-kong"></i>
        <p>暂无可用模板</p>
      </div>
      <template v-else>
        <div
          class="item"
          v-for="(item, index) in templateList.value"
          :key="item.id"
          @mouseenter="moveEnter"
          @mouseleave="moveLeave"
        >
          <div class="content">
            <div class="img">
              <img class="main-image" :src="item.image" alt="" style="top: 0px" />
            </div>
            <div class="btns">
              <template v-if="is_admin">
                <el-popconfirm
                  title="确认删除该模板？"
                  @confirm="deleteTemplate(item)"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                >
                  <template #reference>
                    <span class="delete">删除</span>
                  </template>
                </el-popconfirm>
              </template>
              <span class="use" @click="useTemplate(item)">使用</span>
            </div>
            <span class="preview" @click="preview(item, index)">预览</span>
          </div>
          <p class="name">{{ item.title }}</p>
        </div>
      </template>
    </div>
  </div>
  <preview-page
    v-model="previewModal"
    :templateInfo="curPreviewTemp.value"
    @changPre="pre"
    @changNext="next"
  />
</template>

<script>
import { initPageData } from "../../../initData";
import { siteData } from "../../../store";
import _ from "lodash-es";
import {
  getTplPageGroup,
  getTplpage,
  saveMicwebPabe,
  delTplpage,
} from "/@/api/microweb/webeditor";
import { ref, reactive } from "vue";
import previewPage from "./previewPage.vue";
import { ElMessage, ElPopconfirm } from "element-plus";
import { useUserStore } from "/@/store/modules/user";
export default {
  name: "template",
  components: {
    previewPage,
    ElPopconfirm,
  },
  setup() {
    const userStore = useUserStore();
    const { is_admin } = userStore.getUserInfo;
    const store = siteData();
    const firstClassifyIndex = ref(0);
    const secondClassId = ref("");
    const classifyList = reactive({ value: [] });
    const templateList = reactive({ value: [] });
    const previewModal = ref(false);
    const curPreviewTemp = reactive({ value: {} });

    const changeClassify = async (index) => {
      firstClassifyIndex.value = index;
      let res = await getTplPageGroup({ type: index });
      if (_.size(res)) {
        classifyList.value = res;
        secondClassId.value = res[0].id;
        const data = await getTplpage({ group_id: res[0].id });
        templateList.value = data;
      }
    };

    const changeSecondClassicy = async ({ id }) => {
      secondClassId.value = id;
      templateList.value = [];
      const data = await getTplpage({ group_id: id });
      templateList.value = data;
    };

    const preview = ({ id, title, group_id }, index) => {
      const { name } = _.find(classifyList.value, ["id", group_id]);
      let params = {
        index,
        templateName: title,
        templateId: id,
        templateClassify: name,
        templateTotal: _.size(templateList.value),
      };
      curPreviewTemp.value = params;
      previewModal.value = true;
    };

    const pre = () => {
      const { index } = curPreviewTemp.value;
      if (index === 0) return;
      const { id, title } = templateList.value[index - 1];
      curPreviewTemp.value.index = index - 1;
      curPreviewTemp.value.templateId = id;
      curPreviewTemp.value.templateName = title;
    };

    const next = () => {
      const { index, templateTotal } = curPreviewTemp.value;
      if (index === templateTotal - 1) return;
      const { id, title } = templateList.value[index + 1];
      curPreviewTemp.value.index = index + 1;
      curPreviewTemp.value.templateId = id;
      curPreviewTemp.value.templateName = title;
      console.log(curPreviewTemp);
    };

    const useTemplate = async (data) => {
      const { component, templateJson } = data;
      const cloneInitData = _.cloneDeep(initPageData);
      cloneInitData["ishome"] = 0;
      cloneInitData.component = JSON.parse(component);
      cloneInitData.templateJson = JSON.parse(templateJson);
      const { id, uuid } = await saveMicwebPabe(cloneInitData);
      store.pageList.push({ id, uuid, ishome: 0, name: cloneInitData.name });
      store.pageConfig = cloneInitData;
      store.activePageId = id;
      ElMessage({
        type: "success",
        message: "添加成功",
      });
    };

    const deleteTemplate = async ({ id }) => {
      const res = await delTplpage({ id });
      templateList.value = _.filter(templateList.value, (item) => item.id !== id);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    };

    const timer = ref("");
    const distance = ref(0);
    const endDistance = ref(0);
    const moveEnter = (e) => {
      const img = e.target.getElementsByClassName("main-image")[0];
      const scrollHeight = img.offsetHeight - 224;
      endDistance.value = scrollHeight;
      timer.value = setInterval(() => {
        distance.value -= 8;
        img.style.top = `${distance.value}px`;
        if (Math.abs(distance.value) >= endDistance.value) {
          clearInterval(timer.value);
        }
      }, 100);
    };

    const moveLeave = (e) => {
      const img = e.target.getElementsByClassName("main-image")[0];
      img.style.top = "0px";
      clearInterval(timer.value);
      distance.value = 0;
    };

    const init = async () => {
      let res = await getTplPageGroup({ type: 0 });
      if (_.size(res)) {
        classifyList.value = res;
        secondClassId.value = res[0].id;
        const data = await getTplpage({ group_id: res[0].id });
        templateList.value = data;
      }
    };
    init();

    return {
      firstClassifyIndex,
      changeClassify,
      classifyList,
      secondClassId,
      templateList,
      changeSecondClassicy,
      previewModal,
      curPreviewTemp,
      preview,
      next,
      pre,
      useTemplate,
      deleteTemplate,
      moveEnter,
      moveLeave,
      is_admin,
    };
  },
};
</script>

<style lang="less" scoped>
.template {
  position: relative;
  .classify {
    padding: 3px;
    display: flex;
    margin: 20px 20px;
    border-radius: 30px;
    background-color: #f0f0f0;
    .item {
      line-height: 30px;
      width: calc(100% / 4);
      text-align: center;
      color: #666;
      border-radius: 30px;
      user-select: none;
      cursor: pointer;
      &.active {
        background-color: #fff;
        color: #5874d8;
      }
    }
  }
  .second-classify {
    display: flex;
    flex-wrap: wrap;
    margin: 0 20px 20px;
    .item {
      margin-right: 15px;
      margin-bottom: 12px;
      color: #666;
      user-select: none;
      font-size: 13px;
      cursor: pointer;
      user-select: none;
      &.active {
        font-weight: 700;
        color: #5874d8;
      }
    }
  }
  .template-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 20px 0;
    padding-bottom: 30px;
    .empty-data {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;
      i {
        font-size: 80px;
        margin-bottom: 10px;
      }
    }
    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 140px;
      height: 270px;
      margin-bottom: 20px;
      &:hover {
        .content {
          height: 270px;
          .preview {
            opacity: 1;
          }
        }
      }
      .content {
        position: relative;
        padding: 3px;
        border-radius: 4px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        z-index: 2;
        height: 230px;
        overflow: hidden;
        background-color: #fff;
        transition: height 0.3s ease;
        .img {
          position: relative;
          height: 224px;
          overflow: hidden;
          border-radius: 2px;
          img {
            position: absolute;
            left: 0;
            right: 0;
            width: 100%;
            transition: all 0.3s linear;
          }
        }

        .preview,
        .use,
        .delete {
          user-select: none;
          cursor: pointer;
        }
        .use,
        .delete {
          display: block;
          margin: 8px auto 0;
          width: 60px;
          text-align: center;
          line-height: 25px;
          color: #fff;
          border-radius: 30px;
          font-size: 12px;
        }

        .use {
          background-color: #5874d8;
        }
        .delete {
          background-color: rgb(215, 30, 30);
        }

        .btns {
          display: flex;
          justify-content: space-around;
        }
        .preview {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 12px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 30px;
          color: #fff;
          font-size: 12px;
          opacity: 0;
        }
      }
      .name {
        z-index: 1;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
      }
    }
  }
}
</style>
