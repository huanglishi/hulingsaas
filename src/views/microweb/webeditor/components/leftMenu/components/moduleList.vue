<template>
  <div class="container">
    <rightNavHeader
      :navs="[
        {
          text: '新增模块',
          type: 'addModule',
        },
        {
          text: '我的模块',
          type: 'moduleList',
        },
      ]"
      :activeName="active"
      @change="change"
    />

    <ul class="moduleList" v-if="active === 'moduleList'">
      <li v-for="(item, index) in compomemtList" :key="index">
        <div class="item">
          <i
            class="arrowhead iconfont icon-jiantou-you"
            v-if="
              item.componentName === 'freeContainer' && item.datas.component.length > 0
            "
            @click="switchDataList"
          ></i>
          <p>{{ item.text }}</p>

          <el-popconfirm
            title="确认删除该组件？"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm.stop="deleteComp(item)"
          >
            <template #reference>
              <i class="iconfont icon-shanchu"></i>
            </template>
          </el-popconfirm>
        </div>

        <div class="free-container-data" v-if="item.componentName === 'freeContainer'">
          <div
            class="free-container-data-item"
            v-for="ite in item.datas.component"
            :key="ite.id"
          >
            <p>{{ ite.text }}</p>
            <el-popconfirm
              title="确认删除该组件？"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="deleteFreeContainerItem(item, ite)"
            >
              <template #reference>
                <i class="iconfont icon-shanchu"></i>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </li>
    </ul>

    <template v-else>
      <el-collapse v-model="activeName" class="collapse">
        <el-collapse-item
          v-for="item in comps"
          :key="item.id"
          :name="item.type"
          :title="item.type"
        >
          <div class="icon-list">
            <div
              draggable="true"
              v-for="ite in item.components"
              :key="ite.id"
              class="icon"
              @dragstart="start($event, ite)"
            >
              <i :class="['iconfont', ite.icon]"></i>
              <p>{{ ite.text }}</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <template v-if="false">
        <el-collapse v-model="activeName" class="collapse">
          <el-collapse-item
            v-for="item in comps"
            :key="item.id"
            :name="item.type"
            :title="item.type"
          >
            <draggable
              :list="item.components"
              :group="{ pull: 'clone', put: false }"
              :sort="false"
              item-key="id"
              class="icon-list"
              :clone="clone"
              @end="end"
            >
              <template #item="{ element }">
                <div class="icon" @dragstart="start($event, element)">
                  <i :class="['iconfont', element.icon]"></i>
                  <p>{{ element.text }}</p>
                </div>
              </template>
            </draggable>
          </el-collapse-item>
        </el-collapse>
      </template>
    </template>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { siteData } from "../../../store";
import { ElCollapse, ElCollapseItem } from "element-plus";
import draggable from "vuedraggable";
import _ from "lodash";
import compListData from "../../../initData/componentsData.js";
import rightNavHeader from "../../publicComponents/rightNavHeader/index.vue";
import { ElPopconfirm } from "element-plus";

export default {
  name: "moduleList",
  components: {
    ElCollapse,
    ElCollapseItem,
    draggable,
    ElPopconfirm,
    rightNavHeader,
  },
  setup() {
    const compId = ref("");
    const active = ref("addModule");
    const store = siteData();
    const { getCurPageComponents } = storeToRefs(store);
    const activeName = ref("常用");
    const comps = reactive(compListData);
    const freeContainerId = ref("");

    const change = ({ type }) => {
      active.value = type;
    };

    const switchDataList = (e) => {
      const dataListDom = e.target.parentNode.nextSibling;
      const isOpen = dataListDom.classList.contains("open");
      if (!isOpen) {
        dataListDom.classList.add("open");
        e.target.classList.add("down");
      } else {
        dataListDom.classList.remove("open");
        e.target.classList.remove("down");
      }
    };

    const compomemtList = computed({
      get: () => getCurPageComponents.value,
      set: (val) => store.updatePageComponent(val),
    });

    const deleteComp = (item) => {
      store.deleteComponent(item.id);
    };

    const deleteFreeContainerItem = (item, freeContainerItem) => {
      const component = _.find(store.pageConfig.component, ["id", item.id]);
      const containerItem = _.find(component.datas.component, [
        "id",
        freeContainerItem.id,
      ]);
      component.datas.component = _.filter(
        component.datas.component,
        (ite) => ite.id !== containerItem.id
      );
      if (containerItem.id === store.baseCompId) {
        store.baseCompId = "";
      }
    };

    // 克隆数据
    const clone = (e) => {
      let origin = {};
      if (["textComp", "imageComp", "buttonComp"].includes(e.componentName)) {
        origin = {
          text: "自由容器",
          icon: "icon-rongqi",
          componentName: "freeContainer",
          styleComponent: "",
          id: _.uniqueId(),
          containerConfig: {
            selectStyle: 1,
            title: "自由容器",
            showTitle: false,
            color: "rgb(255,114,20)",
            backgroundColor: "#fff",
          },
          datas: {
            height: 230,
            component: [_.cloneDeep(e)],
          },
        };
      } else {
        origin = _.cloneDeep(e);
      }
      origin.id = compId.value;
      return origin;
    };

    // 结束拖拽
    const end = () => {
      store.changeComponent(compId.value);
    };

    // 开始拖拽
    const start = (e, data) => {
      store.isInFreeContainer = false;
      const cloneData = _.cloneDeep(data);
      cloneData.id = _.uniqueId("comp_");
      e.dataTransfer.setData("data", JSON.stringify(cloneData));
      return;

      if (["textComp", "imageComp", "buttonComp"].includes(componentName)) {
        const componentData = {
          text: "自由容器",
          icon: "icon-rongqi",
          componentName: "freeContainer",
          styleComponent: "",
          id: _.uniqueId(),
          containerConfig: {
            selectStyle: 1,
            title: "自由容器",
            showTitle: false,
            color: "rgb(255,114,20)",
            backgroundColor: "#fff",
          },
          datas: [_.cloneDeep(data)],
        };
        e.dataTransfer.setData("data", JSON.stringify(componentData));
      } else {
        e.dataTransfer.setData("data", JSON.stringify(data));
      }
    };

    return {
      active,
      change,
      comps,
      activeName,
      compomemtList,
      clone,
      start,
      end,
      deleteComp,
      switchDataList,
      deleteFreeContainerItem,
    };
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .nav-list {
    position: relative;
    display: flex;
    height: 50px;
    margin: 0;
    background-color: rgb(240, 240, 240);
    .nav-item {
      display: inline-block;
      flex: 1;
      line-height: 50px;
      text-align: center;
      z-index: 3;
      &.active {
        color: blue;
      }
    }
    .bg {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50%;
      z-index: 2;
      background-color: #fff;
      transition: all 0.3s ease;
    }
    li {
      list-style: none;
      cursor: pointer;
      user-select: none;
    }
  }
  .moduleList {
    display: inline-block;
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
    > li {
      user-select: none;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      border: 1px solid rgb(235, 235, 235);
      border-radius: 4px;
      margin: 10px 0;
      font-size: 14px;
      p {
        display: block;
        flex: 1;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .arrowhead {
        font-size: 12px;
        color: #333;
        margin-right: 4px;
        transform: translateY(1px);
        transition: all 0.3s ease;
        &.down {
          transform: rotate(90deg);
        }
      }
    }
    .free-container-data {
      padding-left: 15px;
      box-sizing: border-box;
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.5s linear;
      &.open {
        max-height: 300px;
      }
      .free-container-data-item {
        display: flex;
        justify-content: space-between;
        color: #333;
        line-height: 38px;
        height: 38px;
        font-size: 13px;
        box-sizing: border-box;
        padding: 0 15px;
        border-radius: 4px;
        border: 1px solid #f2f2f2;
        background-color: #fbfbfb;
        &:not(:first-of-type) {
          margin-top: 10px;
        }
      }
    }
    i {
      cursor: pointer;
      &:hover {
        color: #5874d8;
      }
    }
  }

  .collapse {
    ::v-deep .el-collapse-item__header {
      padding-left: 20px;
    }
    .icon-list {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0 0;
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 66px;
        height: 66px;
        margin: 0 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        transition: box-shadow 0.3s ease;
        &:hover {
          box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.2);
          p,
          i {
            color: #5874d8 !important;
          }
        }
        p {
          color: #505567;
        }
        i {
          color: #9ca2b8;
          font-size: 28px;
          line-height: 30px;
        }
        &::after {
          display: none !important;
        }
      }
    }
  }
}
</style>
