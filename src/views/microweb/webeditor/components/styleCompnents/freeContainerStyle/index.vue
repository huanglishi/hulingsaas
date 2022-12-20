<template>
  <div class="wrapper">
    <right-nav-header
      :navs="[
        {
          text: '自由容器',
          type: 'freeContainer',
        },
        {
          text: '编辑模块',
          type: 'editModule',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />
    <div class="content">
      <div class="img-list-form" v-if="(activeName === 'freeContainer')">
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
          <div class="title">容器背景：</div>
          <div class="radio-group-content">
            <div class="radio-group">
              <div
                class="radio"
                :class="{
                  active: datas.datas.bgMode === 'default',
                }"
                @click="changeBgModel('default')"
              >
                <span class="radio-item"></span>
                默认
              </div>
              <div
                class="radio"
                :class="{
                  active: datas.datas.bgMode === 'hide',
                }"
                @click="changeBgModel('hide')"
              >
                <span class="radio-item"></span>
                隐藏
              </div>
              <div
                class="radio"
                :class="{
                  active: datas.datas.bgMode === 'custom',
                }"
                @click="changeBgModel('custom')"
              >
                <span class="radio-item"></span>
                自定义
              </div>
            </div>
            <div v-if="datas.datas.bgMode === 'custom'">
              <div class="pick-color">
                <p>背景色：</p>
                <el-color-picker @change="changColor" v-model="datas.datas.customBg" />
              </div>
            </div>
          </div>
        </div>

        <div class="form-item">
          <div class="title">容器高度：</div>
          <div class="form-item-content">
            <div class="radio-group">
              <div
                class="radio"
                :class="{
                  active: datas.datas.heightModel === 'default',
                }"
                @click="changeHeight('default')"
              >
                <span class="radio-item"></span>
                默认
              </div>
              <div
                class="radio"
                :class="{
                  active: datas.datas.heightModel === 'custom',
                }"
                @click="changeHeight('custom')"
              >
                <span class="radio-item"></span>
                自定义
              </div>
              <div class="custom-height" v-if="datas.datas.heightModel === 'custom'">
                <el-input @input="inputHeight" v-model="datas.datas.customHeight" />px
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash-es';
import { ElColorPicker, ElInput } from 'element-plus';
import compList from '../../publicComponents';
import { ref } from 'vue';
export default {
  name: 'freeContainerStyle',
  components: {
    ElColorPicker,
    ElInput,
    ...compList,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const activeName = ref('freeContainer');

    const changeBgModel = (type) => {
      props.datas.datas.bgMode = type;
      switch (type) {
        case 'default':
          props.datas.datas.bgColor = props.datas.datas.defaultBg;
          break;
        case 'hide':
          props.datas.datas.bgColor = 'transparent';
          break;
        default:
          props.datas.datas.bgColor = props.datas.datas.customBg;
      }
    };

    const changeHeight = (type) => {
      props.datas.datas.heightModel = type;
      switch (type) {
        case 'default':
          props.datas.datas.height = props.datas.datas.defaultHeight;
          break;
        default:
          props.datas.datas.height = props.datas.datas.customHeight;
      }
    };

    const inputHeight = _.debounce((val) => {
      if (props.datas.datas.heightModel === 'custom') {
        props.datas.datas.height = val;
      }
    }, 500);

    const changColor = (val) => {
      if (props.datas.datas.bgMode === 'custom') {
        props.datas.datas.bgColor = val;
      }
    };

    return {
      activeName,
      changeBgModel,
      changeHeight,
      inputHeight,
      changColor,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
}
.content {
  padding: 15px 10px 0;
}
.img-list-form {
  .form-item {
    display: flex;
    align-items: flex-start;
  }
  .form-item-content {
    display: flex;
  }
  .radio-group {
    display: flex;
    height: 30px;
  }
  .custom-height {
    display: flex;
    font-size: 20px;
    color: #666;
    .el-input {
      width: 50px;
      margin-right: 6px;
    }
  }
  .radio-group-content {
    display: flex;
    flex-direction: column;
    .pick-color {
      display: flex;
      align-items: center;
      p {
        margin-right: 10px;
      }
    }
  }
}
</style>
