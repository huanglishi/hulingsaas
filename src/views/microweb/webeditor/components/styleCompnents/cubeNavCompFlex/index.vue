<!-- 魔方导航布局组件 -->
<template>
  <div class="wrapper">
    <right-nav-header
      :navs="[
        {
          text: '魔方导航',
          type: 'nav',
        },
        {
          text: '编辑模块',
          type: 'editModule',
        },
      ]"
      @change="change"
    />

    <div class="content">
      <template v-if="activeName === 'nav'">
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
        <ul class="set-list">
          <!-- <li class="set">
            <modult-tile
              v-model="datas.containerConfig.title"
              :hide="!datas.containerConfig.showTitle"
              @change="(res) => (datas.containerConfig.showTitle = res)"
            />
          </li> -->
          <li class="set">
            <span class="lable">模块样式：</span>
            <div class="set-content">
              <ul class="flex-list">
                <li
                  :class="{
                    active: item.name == activeFlex,
                  }"
                  v-for="item in flexAll"
                  :key="item.name"
                >
                  {{ item.text }}
                </li>
              </ul>
            </div>
          </li>
          <li class="set">
            <ul class="flex-style-list">
              <li
                :class="{ active: item.component === datas.datas.flexComp }"
                v-for="(item, index) in curFlexList"
                :key="index"
                :style="{
                  'background-image': `url(${item.imgName}) `,
                }"
                @click="changeFlex(item)"
              ></li>
            </ul>
          </li>
        </ul>
      </template>

      <template v-else>
        <container-setingf-form :config="datas.datas.containerConfig" />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import compList from "../../publicComponents";
import { store } from "/@/store";
export default {
  name: "cubeNavCompFlex",
  components: {
    ...compList,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const activeName = ref("nav"); // 当前编辑的模块
    const activeFlex = ref("hot"); // 当前选中的样式模块
    const activeComp = ref("a"); // 当前选中的样式布局

    // 模块样式
    const flexList1 = {
      hot: {
        text: "热门",
        navs: [
          {
            component: "flex1",
            imgName: "flex-3",
          },
          {
            component: "flex2",
            imgName: "flex-4",
          },
          {
            component: "flex3",
            imgName: "flex-5",
          },
          {
            component: "flex4",
            imgName: "flex-6",
          },
        ],
      },
    };

    // 引入图片
    const importImg = (imgName) =>
      new URL(`../../../assets/flexImages/${imgName}.jpg`, import.meta.url).href;

    // 当前分类下的布局
    const curFlexList = computed(() => {
      const list = flexList1[activeFlex.value].navs.map((item) => ({
        ...item,
        imgName: importImg(item.imgName),
      }));
      return list;
    });

    // 所有布局种类
    const flexAll = computed(() => {
      const list = [];
      Object.keys(flexList1).forEach((key) => {
        list.push({
          name: key,
          text: flexList1[key].text,
        });
      });
      return list;
    });

    // 切换顶部模块
    const change = ({ type }) => {
      activeName.value = type;
    };

    // 切换显示隐藏
    const changeShow = (bol) => {
      props.datas.containerConfig.showTitle = !bol;
    };

    // 切换布局
    const changeFlex = ({ component }) => {
      props.datas.datas.flexComp = component;
    };

    return {
      change,
      activeName,
      curFlexList,
      activeComp,
      changeShow,
      changeFlex,
      flexAll,
      activeFlex,
    };
  },
};
</script>

<style lang="less" scoped>
@color-1: #333;
@color-2: #5874d8;
@color-3: #e3e2e8;
.form-item {
  display: flex;
  .form-item-content {
    display: flex;
  }
}
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  .content {
    padding: 15px 20px 0;

    .set-list {
      .set {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
        width: 100%;
      }
      .lable {
        font-size: 14px;
        color: @color-1;
        margin-right: 14px;
      }
      .set-content {
        display: flex;
        align-items: center;
        input {
          height: 30px;
          border-radius: 2px;
          border: 1px solid #e3e2e8;
          margin-right: 10px;
        }
        .set-show {
          display: flex;
          align-items: center;
          &.active {
            .icon::after {
              opacity: 1;
            }
          }
          .icon {
            position: relative;
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid #e3e2e8;
            margin-right: 10px;
            &::after {
              position: absolute;
              left: 0;
              top: 0;
              content: "";
              opacity: 0;
              display: block;
              width: 16px;
              height: 16px;
              background-image: url("../../../assets/images/icon-list.png");
              background-repeat: no-repeat;
              background-position: -517px -1px;
            }
          }
        }
        .flex-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          li {
            color: @color-1;
            user-select: none;
            cursor: pointer;
            &.active,
            &:hover {
              color: @color-2;
            }
            &:first-of-type {
              padding-right: 10px;
            }
            &:not(:first-of-type) {
              padding: 0 10px;
              border-left: 1px solid #e3e2e8;
            }
          }
        }
      }
    }
    .flex-style-list {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      li {
        position: relative;
        display: block;
        width: 172px;
        height: 126px;
        background-repeat: no-repeat;
        background-size: contain;
        border: 1px solid @color-3;
        &:nth-of-type(odd) {
          margin: 0 16px 20px 0;
        }
        &::after {
          display: none;
          position: absolute;
          right: 0;
          bottom: 0;
          content: "";
          width: 28px;
          height: 24px;
          background-image: url("../../../assets/images/icon-list.png");
          background-position: -135px -28px;
        }
        &.active {
          border-color: @color-2;
          &::after {
            display: block;
          }
        }
      }
    }
  }
}
</style>
