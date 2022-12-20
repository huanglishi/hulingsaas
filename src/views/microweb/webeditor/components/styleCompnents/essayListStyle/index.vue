<template>
  <div class="warpper">
    <right-nav-header
      :navs="[
        {
          text: '文章列表',
          type: 'essayListStyle',
        },
        {
          text: '编辑模块',
          type: 'editModule',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />

    <div class="content">
      <template v-if="activeName === 'essayListStyle'">
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
          <div class="title">选择文章：</div>
          <div class="form-item-content">
            <div class="radio-group">
              <div class="radio active">
                <span class="radio-item"></span>
                直接添加
              </div>
            </div>
          </div>
        </div>

        <div class="admin-essay">
          <div class="all-essay">
            <div class="search">
              <input type="text" placeholder="搜索文章" @input="searchEssay" />
              <span class="add" @click="openArticleModel"></span>
            </div>
            <div class="list">
              <div
                v-for="item in searchedList.list"
                :key="item.id"
                @click="addEssay(item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
          <div class="icon">
            <i></i>
          </div>
          <div class="added-essay">
            <div class="item" v-for="item in datas.datas.essayList" :key="item.id">
              <p>{{ item.title }}</p>
              <span @click="deleteEssay(item)"></span>
            </div>
          </div>
        </div>

        <fold-comp
          title="模块样式"
          :open="foldControll.moduleStyle"
          @change="setFold('moduleStyle')"
        >
          <ul class="flex-list">
            <li
              style="background-position: -1552px 0"
              :class="{
                active: datas.datas.moduleStyle === 1,
              }"
              @click="changeStatus('moduleStyle', 1)"
            ></li>
            <li
              style="background-position: -1552px -435px"
              :class="{
                active: datas.datas.moduleStyle === 2,
              }"
              @click="changeStatus('moduleStyle', 2)"
            ></li>
          </ul>

          <div class="form-item" v-if="datas.datas.moduleStyle === 1">
            <div class="title">排列方式：</div>
            <div class="form-item-content">
              <div class="radio-group">
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.arrangeUse === 1,
                  }"
                  @click="changeStatus('arrangeUse', 1)"
                >
                  <span class="radio-item"></span>
                  一列
                </div>
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.arrangeUse === 2,
                  }"
                  @click="changeStatus('arrangeUse', 2)"
                >
                  <span class="radio-item"></span>
                  两列
                </div>
              </div>
            </div>
          </div>

          <div class="form-item">
            <div class="title">头条样式：</div>
            <div class="form-item-content">
              <div class="radio-group">
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.headerstyle === 1,
                  }"
                  @click="changeStatus('headerstyle', 1)"
                >
                  <span class="radio-item"></span>
                  默认
                </div>
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.headerstyle === 2,
                  }"
                  @click="changeStatus('headerstyle', 2)"
                >
                  <span class="radio-item"></span>
                  大图
                </div>
              </div>
            </div>
          </div>

          <div class="form-item" v-if="datas.datas.moduleStyle === 2">
            <div class="title">题图位置：</div>
            <div class="form-item-content">
              <div class="radio-group">
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.imgPosition === 'left',
                  }"
                  @click="changeStatus('imgPosition', 'left')"
                >
                  <span class="radio-item"></span>
                  左侧
                </div>
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.imgPosition === 'right',
                  }"
                  @click="changeStatus('imgPosition', 'right')"
                >
                  <span class="radio-item"></span>
                  右侧
                </div>
              </div>
            </div>
          </div>
        </fold-comp>

        <fold-comp
          title="基本设置"
          :open="foldControll.baseSeting"
          @change="setFold('baseSeting')"
        >
          <div class="form-item">
            <div class="title">文章作者：</div>
            <div class="form-item-content">
              <div class="radio-group">
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.showAuthor,
                  }"
                  @click="changeStatus('showAuthor', true)"
                >
                  <span class="radio-item"></span>
                  显示
                </div>
                <div
                  class="radio"
                  :class="{
                    active: !datas.datas.showAuthor,
                  }"
                  @click="changeStatus('showAuthor', false)"
                >
                  <span class="radio-item"></span>
                  隐藏
                </div>
              </div>
            </div>
          </div>

          <div class="form-item">
            <div class="title">发表时间：</div>
            <div class="form-item-content">
              <div class="radio-group">
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.showPublishTime,
                  }"
                  @click="changeStatus('showPublishTime', true)"
                >
                  <span class="radio-item"></span>
                  显示
                </div>
                <div
                  class="radio"
                  :class="{
                    active: !datas.datas.showPublishTime,
                  }"
                  @click="changeStatus('showPublishTime', false)"
                >
                  <span class="radio-item"></span>
                  隐藏
                </div>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="title">文章分类：</div>
            <div class="form-item-content">
              <div class="radio-group">
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.showEssayClassify,
                  }"
                  @click="changeStatus('showEssayClassify', true)"
                >
                  <span class="radio-item"></span>
                  显示
                </div>
                <div
                  class="radio"
                  :class="{
                    active: !datas.datas.showEssayClassify,
                  }"
                  @click="changeStatus('showEssayClassify', false)"
                >
                  <span class="radio-item"></span>
                  隐藏
                </div>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="title">文章摘要：</div>
            <div class="form-item-content">
              <div class="radio-group">
                <div
                  class="radio"
                  :class="{
                    active: datas.datas.showContent,
                  }"
                  @click="changeStatus('showContent', true)"
                >
                  <span class="radio-item"></span>
                  显示
                </div>
                <div
                  class="radio"
                  :class="{
                    active: !datas.datas.showContent,
                  }"
                  @click="changeStatus('showContent', false)"
                >
                  <span class="radio-item"></span>
                  隐藏
                </div>
              </div>
            </div>
          </div>
        </fold-comp>
      </template>
      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>
  <FormModal @register="registerModal" @success="handleSuccess" />
</template>

<script>
import { getEssayList } from "/@/api/microweb/webeditor";
import { reactive, ref } from "vue";
import publicComponents from "../../publicComponents";
import FormModal from "/@/views/article/articleManage/FormModal.vue";
import { useModal } from "/@/components/Modal";
import { ReplaceUrl } from "/@/utils/imgurl";
import { siteData } from "../../../store";
import _ from "lodash-es";
export default {
  name: "essayListStyle",
  components: {
    FormModal,
    ...publicComponents,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const store = siteData();
    const activeName = ref("essayListStyle");
    const searchedList = reactive({ list: [] });
    const foldControll = reactive({
      moduleStyle: false,
      baseSeting: false,
    });
    const [registerModal, { openModal }] = useModal();

    // 修改部分状态
    const changeStatus = (key, val) => {
      props.datas.datas[key] = val;
    };

    // 关键词搜索文章
    const searchEssay = _.debounce((e) => {
      const title = e.target.value;
      fetchEssayList(title);
    }, 500);

    // 过滤已经添加的文章
    const filterShowEssay = (essayList = []) => {
      const essay = []; // 去重以后的文章
      const showEssayId = []; // 已经展示的文章id
      props.datas.datas.essayList.forEach((item) => showEssayId.push(item.id));
      essayList.forEach((item) => {
        if (!showEssayId.includes(item.id)) {
          essay.push(item);
        }
      });
      return essay;
    };

    // 控制折叠面板
    const setFold = (type) => {
      Object.keys(foldControll).forEach((key) => {
        if (type === key) {
          foldControll[key] = !foldControll[key];
        } else {
          foldControll[key] = false;
        }
      });
    };

    // 展示文章
    const addEssay = (item) => {
      searchedList.list = _.filter(searchedList.list, (essay) => essay.id !== item.id);
      const cloneItem = _.cloneDeep(item);
      if (!_.startsWith(cloneItem.image, "http")) {
        cloneItem.image = ReplaceUrl(cloneItem.image);
      }
      props.datas.datas.essayList.push({
        ..._.cloneDeep(cloneItem),
        micweb_id: store.pageConfig.id,
      });
    };

    // 删除文章
    const deleteEssay = (essay) => {
      props.datas.datas.essayList = _.filter(
        props.datas.datas.essayList,
        (item) => item.id !== essay.id
      );
      searchedList.list.push(essay);
    };

    // 新增文章成功回调
    const handleSuccess = (essay) => {
      fetchEssayList();
    };

    // 打开新增文章面板
    const openArticleModel = () => {
      openModal(true, {
        isUpdate: false,
      });
    };

    // 请求文章
    const fetchEssayList = (title = "") => {
      getEssayList({ title }).then((res) => {
        searchedList.list = filterShowEssay(res.items);
      });
    };

    fetchEssayList();

    return {
      activeName,
      changeStatus,
      searchEssay,
      searchedList,
      foldControll,
      setFold,
      addEssay,
      deleteEssay,
      registerModal,
      handleSuccess,
      openArticleModel,
    };
  },
};
</script>

<style lang="less" scoped>
.warpper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
}
.content {
  padding: 15px 20px 0;
}
.form-item {
  display: flex;
  margin-bottom: 15px;
  .title {
    width: 70px;
    text-align: right;
    margin-right: 10px;
    line-height: 30px;
  }
  .form-item-content {
    display: flex;
    .radio-group {
      display: flex;
      align-items: center;
      height: 100%;
    }
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
.admin-essay {
  display: flex;
  margin-bottom: 20px;
  .all-essay,
  .added-essay {
    border: 1px solid #d0d4d7;
    width: 186px;
    height: 270px;
  }
  .icon {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0 6px;
    box-sizing: border-box;
    i {
      display: block;
      width: 17px;
      height: 32px;
      background-image: url("../../../assets/images/icon-list.png");
      background-position: -431px -33px;
      margin: 0 auto;
    }
  }
  .all-essay {
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;

    .search {
      display: flex;
      justify-content: space-between;
      height: 32px;
      input {
        width: 85%;
        height: 100%;
        padding: 6px;
        font-size: 13px;
        box-sizing: border-box;
        border: 1px solid #d0d4d7;
      }
      span {
        width: 14px;
        height: 100%;
        margin-left: 6px;
        background-image: url("../../../assets/images/icon-list.png");
        background-position: -234px -24px;
        cursor: pointer;
      }
    }
    .list {
      flex: 1;
      overflow-y: auto;
      margin-top: 10px;
      div {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 8px 4px;
        user-select: none;
        cursor: pointer;
        &:hover {
          color: #fff;
          background-color: #5874d8;
        }
      }
    }
  }
  .added-essay {
    overflow-y: auto;
    padding: 15px 10px 0 15px;
    .item {
      display: flex;
      align-items: center;
      line-height: 26px;
      p {
        display: inline-block;
        flex: 1;
        margin-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        cursor: pointer;
        background-image: url("../../../assets/images/icon-list.png");
        background-position: -854px 0;
      }
    }
  }
}
</style>
