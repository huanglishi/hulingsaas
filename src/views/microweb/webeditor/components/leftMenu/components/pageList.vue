<template>
  <div class="wrapper">
    <right-nav-header
      :activeName="activeName"
      :navs="[
        {
          text: '模板页面',
          type: 'template',
        },
        {
          text: '我的页面',
          type: 'myPage',
        },
        {
          text: '系统页面',
          type: 'systemPage',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />
    <div class="content">
      <!-- 模板页面 -->
      <div class="template" v-if="activeName === 'template'">
        <template-list />
      </div>

      <!-- 我的页面 -->
      <div class="wrap" v-else-if="activeName === 'myPage'">
        <div class="btns">
          <el-button type="primary" color="#5874d8" @click="addNewPage"
            >添加页面</el-button
          >
        </div>
        <ul class="page-list">
          <li
            :class="[
              'page',
              item.id === activePageId ? 'active' : '',
              item.ishome === 1 ? 'home' : '',
            ]"
            v-for="item in pageList"
            :key="item.id"
          >
            <span class="pageName" @click="selectPage(item)">{{ item.name || "-" }}</span>
            <div class="page-btns">
              <i
                class="iconfont icon-bianji"
                v-if="item.id === activePageId"
                @click="editPage(item)"
              ></i>
              <el-popconfirm
                title="确认删除该页面？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="confirmDeletePage(item)"
                v-if="item.id !== activePageId"
              >
                <template #reference>
                  <i class="iconfont icon-shanchu"></i>
                </template>
              </el-popconfirm>
            </div>
          </li>
        </ul>
      </div>

      <!-- 系统页面 -->
      <div class="wrap" v-else>
        <ul class="page-list">
          <li
            class="page"
            v-for="item in systemPage.list"
            :key="item.id"
            :class="{ active: systemPage.activeId === item.id }"
            @click="selectSystemPage(item)"
          >
            <span class="pageName">{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMicweb,
  saveMicwebPabe,
  getMicwebPage,
  deletePage,
  getTplPageGroup,
} from "/@/api/microweb/webeditor";
import { ElButton, ElPopconfirm, ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import { siteData } from "../../../store";
import { computed } from "vue-demi";
import { initPageData } from "../../../initData";
import _ from "lodash-es";
import { ref, watch } from "vue";
import rightNavHeader from "../../publicComponents/rightNavHeader/index.vue";
import { useRoute } from "vue-router";
import templateList from "./templateList.vue";
export default {
  name: "pageList",
  components: {
    ElButton,
    ElPopconfirm,
    templateList,
    rightNavHeader,
  },
  setup() {
    const activeName = ref("myPage");
    const store = siteData();
    const { activePageId, systemPage } = storeToRefs(store);

    const router = useRoute();
    const { systemPageId } = router.query;

    if (systemPageId) {
      systemPage.value.activeId = systemPageId;
    }

    // 新增页面
    const addNewPage = async () => {
      let pageData = _.cloneDeep({ ...initPageData, ishome: 0 });
      const res = await saveMicwebPabe(pageData);
      store.pageList.push({ name: pageData.name, ishome: 0, ...res });
      console.log(store.pageList);
      ElMessage({
        type: "success",
        message: "新建成功",
      });
    };

    // 编辑页面
    const editPage = async ({ id }) => {
      // 获取页面数据
      // let res = await getMicwebPage({ id });
      store.editMode = "page";
    };

    // 切换页面
    const selectPage = async ({ uuid, id }) => {
      // 保存当前页面数据
      let pageData = _.cloneDeep(store.pageConfig);
      await saveMicwebPabe(pageData);
      // 获取新页面数据
      const pageInfo = await getMicwebPage({ uuid, micweb_id: store.micwebInfo.id });
      _.keys(pageInfo).forEach((key) => {
        store.pageConfig[key] = pageInfo[key];
      });
      store.activePageId = id;
      let urlArr = location.href.split("?");
      if (urlArr.length > 1) {
        location.href = urlArr[0];
      }
    };

    // 删除页面
    const confirmDeletePage = async ({ id }) => {
      await deletePage({ id });
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      await getMicweb();
      store.deletePage(id);
    };
    const pageList = computed(() => store.pageList);
    const selectSystemPage = ({ id, component }) => {
      systemPage.value.activeId = id;
      const locationOrigin = location.href.split("?")[0];
      history.pushState(
        {},
        "",
        `${locationOrigin}?type=page&compName=${component}&systemPageId=${id}`
      );
    };

    watch(activeName, (val) => {
      if (val === "template") {
        getTplPageGroup;
      }
      console.log(val);
    });

    return {
      pageList,
      activePageId,
      addNewPage,
      selectPage,
      confirmDeletePage,
      editPage,
      activeName,
      systemPage,
      selectSystemPage,
    };
  },
};
</script>

<style lang="less" scoped>
.wrap {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.page-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  margin: 0;
  .page {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid rgb(227, 227, 227);
    border-radius: 4px;
    padding: 0 10px;
    cursor: pointer;
    user-select: none;
    margin: 10px 0;
    &.active {
      border-color: #d0dafc;
      color: #5874d8;
      background-color: #f3f6ff;
    }
    &.home::before {
      position: absolute;
      left: 0;
      top: 0;
      content: "";
      display: block;
      width: 12px;
      height: 12px;
      background-image: url("../../../assets/images/home.png");
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }
}
.btns {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.pageName {
  display: inline-block;
  width: 80%;
  line-height: 40px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
.page:hover i {
  display: block;
}
.page-btns {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  i {
    display: none;
    font-size: 22px;
    margin-left: 14px;
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  > .content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
