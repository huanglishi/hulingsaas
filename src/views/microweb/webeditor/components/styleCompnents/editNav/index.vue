<!-- 编辑魔方导航项 -->
<template>
  <div class="wrapper">
    <div class="navs">
      <div>导航项</div>
    </div>

    <div class="content">
      <form-item title="标题：" :labelWidth="70">
        <div class="title-content">
          <input type="text" v-model="datas.title" />
          <div class="checkbox" @click="hide">
            <span
              :class="{
                active: !datas.hideTitle,
              }"
            ></span>
            隐藏
          </div>
        </div>
      </form-item>
      <space />

      <template v-if="datas.subtitle">
        <!-- 副标题 -->
        <form-item title="副标题：" :labelWidth="70">
          <div class="title-content">
            <input type="text" v-model="datas.subtitle" />
            <div class="checkbox" @click="datas.hideSubtitle = !datas.hideSubtitle">
              <span
                :class="{
                  active: !datas.hideSubtitle,
                }"
              ></span>
              隐藏
            </div>
          </div>
        </form-item>
      </template>

      <!-- 图标 -->
      <div class="radio-group">
        <div class="title">图标：</div>
        <div class="right-content">
          <ul class="radios-list">
            <li
              :class="{
                active: datas.iconModel === 'default',
              }"
              @click="datas.iconModel = 'default'"
            >
              <span></span>默认
            </li>
            <li
              :class="{
                active: datas.iconModel === 'hide',
              }"
              @click="datas.iconModel = 'hide'"
            >
              <span></span>隐藏
            </li>
            <li
              :class="{
                active: datas.iconModel === 'custom',
              }"
              @click="datas.iconModel = 'custom'"
            >
              <span></span>自定义
            </li>
          </ul>
          <div class="icon-custom" v-if="datas.iconModel === 'custom'">
            <div class="img-empty" v-if="datas.customIcon === ''">默认</div>
            <img v-else :src="datas.customIcon" alt="" />
            <el-button @click="selectIcon">选择图标</el-button>
            <p>最佳尺寸：60 x 60</p>
          </div>
        </div>
      </div>
      <!-- 背景 -->
      <div class="radio-group">
        <div class="title">背景：</div>
        <div class="right-content">
          <ul class="radios-list">
            <li
              :class="{
                active: datas.bgModel === 'default',
              }"
              @click="datas.bgModel = 'default'"
            >
              <span></span>默认
            </li>
            <li
              :class="{
                active: datas.bgModel === 'hide',
              }"
              @click="datas.bgModel = 'hide'"
            >
              <span></span>隐藏
            </li>
            <li
              :class="{
                active: datas.bgModel === 'custom',
              }"
              @click="datas.bgModel = 'custom'"
            >
              <span></span>自定义
            </li>
          </ul>
          <div class="bg-custom" v-if="datas.bgModel === 'custom'">
            <div class="title">背景色：</div>
            <el-color-picker v-model="datas.customBg" />
          </div>
        </div>
      </div>

      <!-- 跳转方式 -->
      <div class="radio-group">
        <div class="title">跳转方式：</div>
        <div class="right-content">
          <ul class="radios-list">
            <li
              :class="{
                active: datas.jumpType === 'not',
              }"
              @click="datas.jumpType = 'not'"
            >
              <span></span>不跳转
            </li>
            <li
              :class="{
                active: ['interior', 'exterior'].includes(datas.jumpType),
              }"
              @click="datas.jumpType = 'interior'"
            >
              <span></span>自定义
            </li>
          </ul>
          <div
            class="jump-custom"
            v-if="['interior', 'exterior'].includes(datas.jumpType)"
          >
            <el-input
              v-if="datas.jumpType === 'interior'"
              v-model="datas.urlInfo.pageName"
              disabled
            />

            <el-input
              v-else-if="datas.jumpType === 'exterior'"
              v-model="datas.urlInfo.url"
            />
            <el-input v-else disabled />
            <el-button @click="urlModal = true">设置链接</el-button>
          </div>
        </div>
      </div>

      <!-- 样式设置 -->
      <fold-comp
        title="样式设置"
        :open="open"
        :maxHeight="600"
        @change="(res) => (open = res)"
      >
        <!-- 布局 -->
        <template v-if="datas.flexUse">
          <div class="flex-list" v-if="datas.flexUse">
            <div class="style-title" style="margin-bottom: 10px">布局：</div>
            <ul class="flex">
              <li
                class="item default"
                :class="{ active: datas.flexUse == 1 }"
                @click="datas.flexUse = 1"
              >
                默认
              </li>
              <li
                class="item icon"
                style="background-position: 0 0"
                :class="{ active: datas.flexUse == 2 }"
                @click="datas.flexUse = 2"
              ></li>
              <li
                class="item icon"
                style="background-position: -91px 0"
                :class="{ active: datas.flexUse == 3 }"
                @click="datas.flexUse = 3"
              ></li>
              <li
                class="item icon"
                style="background-position: -1px -70px"
                :class="{ active: datas.flexUse == 4 }"
                @click="datas.flexUse = 4"
              ></li>
              <li
                class="item icon"
                style="background-position: -1px -70px"
                :class="{ active: datas.flexUse == 5 }"
                @click="datas.flexUse = 5"
              ></li>
            </ul>
          </div>
        </template>

        <!-- 主标题样式 -->
        <div class="radio-group">
          <div class="style-title">标题样式：</div>
          <div class="right-content">
            <ul class="radios-list">
              <li
                :class="{
                  active: datas.titleStyle === 'default',
                }"
                @click="datas.titleStyle = 'default'"
              >
                <span></span>默认
              </li>
              <li
                :class="{
                  active: datas.titleStyle === 'custom',
                }"
                @click="datas.titleStyle = 'custom'"
              >
                <span></span>自定义
              </li>
            </ul>

            <div class="title-custom" v-if="datas.titleStyle === 'custom'">
              <div class="title-custom-item">
                <div class="title">大小：</div>
                <el-select placeholder="大小" v-model="datas.titleFontSize">
                  <el-option :value="item" v-for="item in fontSize" :key="item">{{
                    item
                  }}</el-option>
                </el-select>
              </div>
              <div class="title-custom-item">
                <div class="title">颜色：</div>
                <el-color-picker v-model="datas.titleColor" />
              </div>
              <div class="title-custom-item">
                <div class="title">加粗：</div>
                <span
                  class="check-box"
                  :class="{
                    active: datas.titlefontWeight,
                  }"
                  @click="datas.titlefontWeight = !datas.titlefontWeight"
                ></span>
              </div>
              <div class="title-custom-item">
                <div class="title">下划线：</div>
                <span
                  class="check-box"
                  :class="{
                    active: datas.titleOutLine,
                  }"
                  @click="datas.titleOutLine = !datas.titleOutLine"
                ></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 副标题样式 -->
        <div class="radio-group" v-if="datas.subtitle">
          <div class="style-title">副标题样式：</div>
          <div class="right-content">
            <ul class="radios-list">
              <li
                :class="{
                  active: datas.subtitleStyle === 'default',
                }"
                @click="datas.subtitleStyle = 'default'"
              >
                <span></span>默认
              </li>
              <li
                :class="{
                  active: datas.subtitleStyle === 'custom',
                }"
                @click="datas.subtitleStyle = 'custom'"
              >
                <span></span>自定义
              </li>
            </ul>
            <div class="title-custom" v-if="datas.subtitleStyle == 'custom'">
              <div class="title-custom-item">
                <div class="title">大小：</div>
                <el-select placeholder="大小1" v-model="datas.subtitleFontSize">
                  <el-option :value="item" v-for="item in fontSize" :key="item">{{
                    item
                  }}</el-option>
                </el-select>
              </div>
              <div class="title-custom-item">
                <div class="title">颜色：</div>
                <el-color-picker v-model="datas.subtitleColor" />
              </div>
              <div class="title-custom-item">
                <div class="title">加粗：</div>
                <span
                  class="check-box"
                  :class="{
                    active: datas.subtitlefontWeight,
                  }"
                  @click="datas.subtitlefontWeight = !datas.subtitlefontWeight"
                ></span>
              </div>
              <div class="title-custom-item">
                <div class="title">下划线：</div>
                <span
                  class="check-box"
                  :class="{
                    active: datas.subtitleOutLine,
                  }"
                  @click="datas.subtitleOutLine = !datas.subtitleOutLine"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </fold-comp>
    </div>
  </div>

  <set-jump-url
    :jumpType="datas.jumpType"
    :urlInfo="datas.urlInfo"
    :dialogVisible="urlModal"
    @hide="dialogClosed"
  />
  <FileManage @register="registerFileManage" @success="selectImg"></FileManage>
</template>

<script>
import { ElButton, ElColorPicker, ElInput, ElSelect, ElOption } from "element-plus";
import { ref } from "vue";
import components from "../../publicComponents";

import { ReplaceUrl } from "/@/utils/imgurl";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";

export default {
  name: "editNav",
  components: {
    ElButton,
    ElInput,
    ElColorPicker,
    ElSelect,
    ElOption,
    FileManage,
    ...components,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    console.log(props.datas);
    const [registerFileManage, { openModal }] = useModal();
    const open = ref(false);
    const urlModal = ref(false);
    const fontSize = [];
    for (let i = 10; i <= 30; i++) {
      fontSize.push(i);
    }

    const hide = () => {
      props.datas.hideTitle = !props.datas.hideTitle;
    };

    const dialogClosed = (data) => {
      urlModal.value = false;
      const { type, content, closeType } = data;
      if(closeType === 'cancel') return;
      props.datas.jumpType = type;
      props.datas.urlInfo.pageId = content.pageId;
      props.datas.urlInfo.pageName = content.pageName;
      props.datas.urlInfo.url = content.url;
    };

    const selectIcon = () => {
      openModal(true, {
        getnumber: "one",
      });
    };

    const selectImg = (data) => {
      const { url } = data;
      props.datas.customIcon = ReplaceUrl(url);
    };

    return {
      open,
      hide,
      urlModal,
      fontSize,
      dialogClosed,
      selectIcon,
      selectImg,
      registerFileManage,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100%;
  background-color: #fff;

  .navs {
    width: 100%;
    background-color: #f0f0f0;
    > div {
      width: 50%;
      line-height: 50px;
      text-align: center;
      color: #5874d8;
      background-color: #fff;
    }
  }
  .content {
    padding: 20px 30px 0;
  }
  .icon-set {
    display: flex;
    height: 100%;
  }
  .flex-list {
    display: flex;
    flex-direction: column;
    .title {
      width: 90px;
      line-height: 36px;
      font-size: 13px;
      color: #333;
    }
    .flex {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .item {
        width: 80px;
        height: 60px;
        border: 1px solid #e3e2e8;
        border-radius: 2px;
        margin: 0 20px 20px 0;
        user-select: none;
        cursor: pointer;
        &.default {
          line-height: 60px;
          text-align: center;
          font-size: 13px;
          color: #333;
        }
        &.active {
          position: relative;
          border-color: #5874d8;
          &::after {
            position: absolute;
            right: 0;
            bottom: 0;
            content: "";
            display: inline-block;
            width: 28px;
            height: 24px;
            background-image: url("../../../assets/images/icon-list.png");
            background-repeat: no-repeat;
            background-position: -135px -28px;
          }
        }
        &.icon {
          background-image: url("../../../assets/images/newcubeNav_textLayout.jpg");
          background-repeat: no-repeat;
          background-position: 0 0;
        }
      }
    }
  }
}
.title-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 2px 0;
  input {
    flex: 1;
    height: 100%;
    padding: 0 10px;
    border: 1px solid #e3e2e8;
    border-radius: 2px;
    margin-right: 10px;
    font-size: 13px;
    &:focus {
      border: 1px solid #5874d8;
      outline: none;
    }
  }
  .checkbox {
    display: flex;
    align-items: center;
    user-select: none;
    span {
      display: inline-block;
      content: "";
      width: 16px;
      height: 16px;
      border: 1px solid #d0d4d7;
      margin-right: 10px;
      background-position: -517px -1px;
      &.active {
        background-image: url("../../../assets/images/icon-list.png");
      }
    }
  }
}

.radio-group {
  display: flex;
  margin: 20px 0;
  .title {
    width: 70px;
    text-align: right;
    margin-right: 10px;
  }
  .style-title {
    text-align: left;
    width: 90px;
  }
  .right-content {
    display: flex;
    flex-direction: column;
    .radios-list {
      display: flex;
      margin-bottom: 15px;
      li {
        display: flex;
        align-items: center;
        margin-right: 16px;
        user-select: none;
        cursor: pointer;
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
    .icon-custom {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      p {
        margin-left: 10px;
      }
      .img-empty {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 12px;
        color: #fff;
        margin-right: 10px;
        background-color: rgb(105, 105, 105);
      }
    }
    .bg-custom {
      display: flex;
      align-items: center;
      .title {
        font-size: 13px;
        margin-right: 10px;
      }
    }
    .jump-custom {
      display: flex;
      ::v-deep .el-button {
        margin-left: 10px;
      }
    }
    .title-custom-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      ::v-deep .el-select {
        width: 100px;
      }
      .check-box {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid #d0d4d7;
        &.active {
          background-image: url("../../../assets/images/icon-list.png");
          background-position: -517px -1px;
        }
      }
    }
  }
}
</style>
