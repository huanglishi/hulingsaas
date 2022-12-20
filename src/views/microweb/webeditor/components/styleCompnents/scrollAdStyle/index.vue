<template>
  <div class="wrapper">
    <right-nav-header
      :navs="[
        {
          text: '滚动公告',
          type: 'scrollAd',
        },
        {
          text: '编辑模块',
          type: 'edit',
        },
      ]"
      @change="change"
    />

    <div class="content">
      <template v-if="active === 'scrollAd'">
        <div class="title">
          <span class="label">模块标题:</span>
          <input type="text" v-model="datas.containerConfig.title" />
          <div
            class="check-box"
            :class="{
              active: !datas.containerConfig.showTitle,
            }"
            @click="
              () => (datas.containerConfig.showTitle = !datas.containerConfig.showTitle)
            "
          >
            <span class="radio-item"></span>
            隐藏
          </div>
        </div>
        <div class="table">
          <div class="header">
            <span class="label">公告列表：</span>
            <el-button @click="addAd">添加公告</el-button>
          </div>
        </div>

        <el-table
          :data="datas.datas.notice"
          border
          style="width: 100%; margin-bottom: 20px"
        >
          <el-table-column prop="content" label="公告内容">
            <template #default="scope">
              <el-input v-model="scope.row.content" />
            </template>
          </el-table-column>
          <el-table-column prop="url" label="链接" align="center" width="100px">
            <template #default="scope">
              <p v-if="scope.row.jumpType === 'not'" @click="addLink(scope.row)">无</p>
              <p
                style="cursor: pointer"
                v-else-if="scope.row.jumpType === 'interior'"
                @click="addLink(scope.row)"
              >
                {{ scope.row.urlInfo.pageName }}
              </p>
              <p
                v-else-if="scope.row.jumpType === 'exterior'"
                @click="addLink(scope.row)"
              >
                {{ scope.row.urlInfo.url }}
              </p>
              <p style="cursor: pointer" v-else @click="addLink(scope.row)">添加链接</p>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="80px">
            <template #default="scope">
              <i
                class="iconfont icon-shanchu"
                style="cursor: pointer"
                @click="deleteAd(scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>

        <fold-comp title="模块样式" :open="folds" @change="(res) => (folds = res)">
          <ul class="flex-list">
            <li
              :class="{
                'active-flex': datas.datas.moduleFlex === 1,
              }"
              @click="changeModuleStyle(1)"
              style="background-position: -120px -1063px"
            ></li>
            <li
              style="background-position: -120px -1132px"
              :class="{
                'active-flex': datas.datas.moduleFlex === 2,
              }"
              @click="changeModuleStyle(2)"
            ></li>
          </ul>

          <template v-if="datas.datas.moduleFlex === 1">
            <form-item title="图标颜色：">
              <picker-color
                :colorList="colors"
                :activeColor="datas.datas.color"
                @select="(res) => (datas.datas.color = res)"
              />
            </form-item>

            <form-item title="公告图标：">
              <ul class="icon-list-1">
                <li @click="selectIcon(1)">
                  <span
                    :class="{
                      active: datas.datas.iconStyle === 1,
                    }"
                  ></span>
                  <div
                    class="icon-bg bg"
                    :style="{
                      'background-color': datas.datas.color,
                    }"
                  >
                    公告
                  </div>
                </li>
                <li @click="selectIcon(2)">
                  <span
                    :class="{
                      active: datas.datas.iconStyle === 2,
                    }"
                  ></span>
                  <div
                    class="icon-bg bg"
                    :style="{
                      'background-color': datas.datas.color,
                    }"
                  >
                    <i class="iconfont icon-laba"></i>
                  </div>
                </li>
                <li @click="selectIcon(3)">
                  <span
                    :class="{
                      active: datas.datas.iconStyle === 3,
                    }"
                  ></span>
                  <div
                    class="icon-bg border"
                    :style="{
                      'border-color': datas.datas.color,
                      color: datas.datas.color,
                    }"
                  >
                    公告
                  </div>
                </li>
                <li @click="selectIcon(4)">
                  <span
                    :class="{
                      active: datas.datas.iconStyle === 4,
                    }"
                  ></span>
                  <div class="icon-bg">
                    <i
                      class="iconfont icon-yangshengqi"
                      :style="{
                        color: datas.datas.color,
                      }"
                    ></i>
                  </div>
                </li>
              </ul>
            </form-item>
          </template>

          <form-item title="公告图标：" v-else>
            <ul class="icon-list-1">
              <li @click="selectIcon(1)">
                <span
                  :class="{
                    active: datas.datas.iconStyle === 1,
                  }"
                ></span>
                <div class="icon-bg">
                  <img src="../../../assets/images/noticeIco1.gif" alt="" />
                </div>
              </li>
              <li @click="selectIcon(2)">
                <span
                  :class="{
                    active: datas.datas.iconStyle === 2,
                  }"
                ></span>
                <div class="icon-bg">
                  <img src="../../../assets/images/noticeIco2.gif" alt="" />
                </div>
              </li>
              <li @click="selectIcon(3)">
                <span
                  :class="{
                    active: datas.datas.iconStyle === 3,
                  }"
                ></span>
                <div class="icon-bg">
                  <img src="../../../assets/images/noticeIco3.gif" alt="" />
                </div>
              </li>
              <li @click="selectIcon(0)">
                <span
                  :class="{
                    active: datas.datas.iconStyle === 0,
                  }"
                ></span>
                <div class="icon-bg">无</div>
              </li>
            </ul>
          </form-item>
        </fold-comp>
      </template>

      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>
  <set-jump-url
    :jumpType="editAd.value.jumpType"
    :urlInfo="editAd.value.urlInfo"
    :dialogVisible="urlModal"
    @hide="dialogClosed"
  />
</template>

<script>
import { ref, reactive } from "vue";
import { ElButton, ElTable, ElTableColumn, ElInput } from "element-plus";
import comps from "../../publicComponents";

import _ from "lodash";

export default {
  name: "scrollAdStyle",
  components: {
    ElButton,
    ElTable,
    ElTableColumn,
    ElInput,
    ...comps,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const urlModal = ref(false);
    const editAd = reactive({ value: {} }); // 当前编辑中的公告

    const active = ref("scrollAd");

    const colors = reactive([
      "rgb(255,114,20)",
      "rgb(242,48,48)",
      "rgb(255,71,141)",
      "rgb(6,193,174)",
      "rgb(251,190,64)",
      "rgb(66,189,86)",
      "rgb(6, 193, 174)",
      "rgb(50, 133, 255)",
      "rgb(191, 160, 115)",
    ]);

    // 控制折叠面板
    const folds = ref(false);

    // 切换顶部模块
    const change = ({ type }) => {
      active.value = type;
    };

    const deleteAd = ({ id }) => {
      props.datas.datas.notice = _.filter(
        props.datas.datas.notice,
        (item) => item.id !== id
      );
    };

    // 添加公告
    const addAd = () => {
      props.datas.datas.notice.push({
        content: "请输入公告内容",
        id: _.uniqueId("ad_"),
        jumpType: "not",
        urlInfo: {
          pageName: "",
          pageId: "",
          url: "",
        },
      });
    };

    // 切换模块样式
    const changeModuleStyle = (item) => {
      props.datas.datas.moduleFlex = item;
      props.datas.datas.iconStyle = 1;
    };

    const selectIcon = (item) => {
      props.datas.datas.iconStyle = item;
    };

    // 弹窗回调
    const dialogClosed = (data) => {
      urlModal.value = false;
      if (data.closeType === "cancel") return;
      const { id } = editAd.value;
      const adItem = _.find(props.datas.datas.notice, ["id", id]);
      adItem.jumpType = data.type;
      adItem.urlInfo.pageName = data.content.pageName;
      adItem.urlInfo.pageId = data.content.pageId;
      adItem.urlInfo.url = data.content.url;
    };

    // 添加链接
    const addLink = (adItem) => {
      editAd.value = adItem;
      urlModal.value = true;
    };

    return {
      change,
      active,
      deleteAd,
      colors,
      addAd,
      folds,
      changeModuleStyle,
      selectIcon,
      urlModal,
      dialogClosed,
      addLink,
      editAd,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100%;
  background-color: #fff;
  .content {
    padding: 20px 20px 0;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      input {
        border: 1px solid #e3e2e8;
        padding: 5px 10px;
        margin: 0 20px;
        border-radius: 4px;
        &:focus {
          border: 1px solid #5874d8;
          outline: none;
        }
      }
    }

    .table {
      width: 100%;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        flex: 1;
      }
    }
    .flex-list {
      display: flex;
      margin: 20px 0;
      li {
        width: 64px;
        height: 52px;
        border: 1px solid #e7e7eb;
        margin-right: 20px;
        background: url("../../../assets/images/bg.png") no-repeat;
        &::after {
          width: 24px;
          height: 20px;
        }
      }
    }

    .icon-list-1 {
      display: flex;
      height: 100%;
      li {
        display: flex;
        align-items: center;
        height: 100%;
        margin-right: 15px;
        cursor: pointer;
        span {
          position: relative;
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 1px solid #d8d8d8;
          border-radius: 50%;
          margin-right: 6px;
          &.active::after {
            content: "";
            display: inline-block;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 50%;
            height: 50%;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            background-color: #828282;
          }
        }
        .icon-bg {
          width: 27px;
          height: 25px;
          font-size: 12px;
          line-height: 25px;
          text-align: center;
          border-radius: 4px;
          &.bg {
            color: #fff;
            background-color: red;
          }
          &.border {
            box-sizing: border-box;
            border: 1px solid transparent;
          }
          .icon-yangshengqi {
            font-size: 20px;
          }
        }
      }
    }

    ::v-deep .el-table--fit {
      .el-table__header .el-table__cell {
        background-color: #f8f9fb;
        .cell {
          color: #333;
          font-size: 12px;
        }
      }
    }

    .label {
      font-size: 13px;
      color: #333;
    }
  }
}
</style>
