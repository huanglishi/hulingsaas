<template>
  <div
    class="wrapper"
    :class="{
      openMask: showMask,
      'data-empty': datas.component.length === 0,
    }"
    ref="wrapperDom"
    :style="{
      'background-color': datas.bgColor,
      height: `${datas.height}px`,
    }"
    @mousemove="move"
    @mouseleave="leave"
    @dragenter="enter"
    @drop="drop"
    @dragleave="dragleave"
  >
    <template v-for="item in datas.component" :key="item.id">
      <!-- 输入框 -->
      <template v-if="item.componentName === 'textComp'">
        <div
          class="input"
          placeholder="双击输入内容"
          :style="{
            top: `${item.datas.top}px`,
            left: `${item.datas.left}px`,
            color: item.datas.color,
            'font-size': `${item.datas.fontSize}px`,
          }"
          contenteditable="false"
          @mousedown.stop="imgMouseDown(item.datas, $event)"
          @mouseup.stop="imgMouseUp"
          @dblclick="openInput"
          @blur="blur"
          @click.stop="editComp(item)"
          @input="inputText($event, item)"
        >
          {{ item.datas.value }}
        </div>
      </template>

      <!-- 图片 -->
      <template v-else-if="item.componentName === 'imageComp'">
        <div
          class="add-img"
          :class="{
            'has-img': isHasImg(item),
          }"
          @mousedown.stop="imgMouseDown(item.datas, $event)"
          @mouseup.stop="imgMouseUp"
          @click.stop="openSelectModal(item)"
          :style="{
            top: `${item.datas.top}px`,
            left: `${item.datas.left}px`,
            height: `${item.datas.height}px`,
            width: `${item.datas.width}px`,
          }"
        >
          <div
            class="img-container"
            :style="{
              opacity: item.datas.opacity,
              'border-radius': item.datas.borderRadius,
            }"
          >
            <img :src="matchImage(item.datas.image)" :alt="item.datas.alt" />
          </div>
          <span @mousedown.stop="imgDown('top', item.datas, $event)"></span>
          <span @mousedown.stop="imgDown('right', item.datas, $event)"></span>
          <span @mousedown.stop="imgDown('bottom', item.datas, $event)"></span>
          <span @mousedown.stop="imgDown('left', item.datas, $event)"></span>
        </div>
      </template>

      <!-- 按钮 -->
      <template v-else>
        <div
          class="custom-wrapper"
          :style="{
            top: `${item.datas.top}px`,
            left: `${item.datas.left}px`,
            height: `${item.datas.height}px`,
            width: `${item.datas.width}px`,
          }"
          @mousedown.stop="imgMouseDown(item.datas, $event)"
          @mouseup.stop="imgMouseUp"
          @click.stop="editButton(item)"
        >
          <div
            class="custom-btn"
            :style="{
              'background-color': item.datas.backgroundColor,
              'font-size': `${item.datas.fontSize}px`,
              color: item.datas.textColor,
            }"
          >
            {{ item.datas.text }}
          </div>
          <span @mousedown.stop="imgDown('top', item.datas, $event)"></span>
          <span @mousedown.stop="imgDown('right', item.datas, $event)"></span>
          <span @mousedown.stop="imgDown('bottom', item.datas, $event)"></span>
          <span @mousedown.stop="imgDown('left', item.datas, $event)"></span>
        </div>
      </template>
    </template>
  </div>
  <span
    class="bottom"
    @mousedown="down"
    @mouseup="up"
    :style="{
      height: `${draggableHeight}px`,
    }"
  ></span>
  <FileManage @register="registerFileManage" @success="selectImg"></FileManage>
</template>

<script lang="ts">
import { ref, watch, reactive, nextTick } from "vue";
import { ReplaceUrl } from "/@/utils/imgurl";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";
import { siteData } from "../../../store";
import { ElMessage } from "element-plus";
export default {
  name: "freeContainer",
  props: {
    datas: Object,
    clientInfo: Object,
    compId: String,
  },
  components: {
    FileManage,
  },
  setup(props) {
    const showMask = ref(false); // 控制遮罩显示隐藏
    const store = siteData();
    const draggableHeight = ref(10);
    const [registerFileManage, { openModal }] = useModal();
    const startY = ref(0); // 改变高度时的基础位置，用来计算高度
    const initHeight = ref(0); // 改变高度时基础高度
    const wrapperDom = ref(); // 外边框

    // 外边框距离可视区域距离
    const basePosition = reactive({
      value: {},
    });

    const addImg = ref(""); // 图片
    const changeType = ref(""); // height position width
    const borderPosition = ref(""); // top bottom right left
    const downInfo = reactive({
      value: {},
    }); // 鼠标按下的位置信息，用于拖拽位置

    // 需要拖动的dom元素信息
    const changBoxInfo = reactive({
      value: {},
    });

    const changeSizeDom = ref("");

    // 当前编辑元素的参数
    const curEditDom = reactive({ value: {} });

    // 鼠标点击抬起的时间戳
    const intervalTime = reactive({
      down: 0,
      up: 0,
    });

    // 输入框失去焦点
    const blur = (e) => {
      e.target.setAttribute("contenteditable", false);
    };

    //
    const isHasImg = (data) => {
      return data.datas.image.startsWith("http");
    };

    const editComp = (item) => {
      const { componentName, id } = item;
      store.baseCompId = id;
      store.activeComponentId = props.compId;
      store.editMode = componentName;
    };

    const editButton = (item) => {
      const { componentName, id } = item;
      store.baseCompId = id;
      store.activeComponentId = props.compId;
      store.editMode = componentName;
    };

    watch(
      () => props.clientInfo,
      (val) => {
        const { clientY } = val;
        if (changeType.value === "height") {
          const addHeight = clientY - startY.value;
          props.datas.height = addHeight + initHeight.value;
        }
      },
      {
        deep: true,
      }
    );

    nextTick(() => {
      const info = wrapperDom.value.getBoundingClientRect();
      basePosition.value = info;
    });

    // 拖拽进入
    const enter = () => {
      store.isInFreeContainer = true;
      showMask.value = true;
    };

    // 拖拽出去
    const dragleave = () => {
      store.isInFreeContainer = false;
      showMask.value = false;
    };

    // 拖拽放置
    const drop = (e) => {
      showMask.value = false;
      const jsonData = e.dataTransfer.getData("data");
      const data = JSON.parse(jsonData);
      console.log(data);
      if (!["textComp", "imageComp", "buttonComp"].includes(data.componentName)) {
        ElMessage({
          type: "warning",
          message: "目前自由容器仅支持放置常用模板",
        });
        return;
      }
      props.datas.component.push(data);
    };

    // 双击开启输入
    const openInput = (e) => {
      const isEdit = e.target.getAttribute("contenteditable");
      if (isEdit === "false") {
        e.target.setAttribute("contenteditable", true);
        e.target.focus();
      }
    };

    // 拖动抬起
    const up = () => {
      changeType.value = "";
      draggableHeight.value = 10;
    };

    // 拖动按下
    const down = (e) => {
      draggableHeight.value = 300;
      const { clientY } = e;
      startY.value = clientY;
      changeType.value = "height";
      initHeight.value = e.target.parentNode.offsetHeight;
    };

    // 拖动位置
    const move = (e) => {
      const { clientX, clientY } = e;
      const { top, left } = wrapperDom.value.getBoundingClientRect();
      const wrapDistanceTop = clientY - top; // 鼠标距wrapper顶部的距离
      const wrapDistanceLeft = clientX - left; // 鼠标距离wrapper左边的距离
      if (changeType.value === "position") {
        curEditDom.value.left = wrapDistanceLeft - downInfo.value.offsetX;
        curEditDom.value.top = wrapDistanceTop - downInfo.value.offsetY;
      } else if (changeType.value === "width") {
        if (borderPosition.value === "right") {
          curEditDom.value.width =
            wrapDistanceLeft -
            (changBoxInfo.value.right - left) +
            changBoxInfo.value.width;
        } else if (borderPosition.value === "bottom") {
          curEditDom.value.height = wrapDistanceTop - (changBoxInfo.value.top - top);
        } else if (borderPosition.value === "top") {
          const {
            top: changeSizeDomTop,
            height,
          } = changeSizeDom.value.getBoundingClientRect();
          curEditDom.value.height = changeSizeDomTop - top - wrapDistanceTop + height;
          curEditDom.value.top = wrapDistanceTop;
        } else if (borderPosition.value === "left") {
          const {
            left: changeSizeDomLeft,
            width,
          } = changeSizeDom.value.getBoundingClientRect();
          curEditDom.value.width = changeSizeDomLeft - left - wrapDistanceLeft + width;
          curEditDom.value.left = wrapDistanceLeft;
        }
      }
    };

    // 拖动添加图片按钮
    const imgMouseDown = (item, e) => {
      intervalTime.down = new Date().getTime();
      curEditDom.value = item;
      const { clientX, clientY, offsetX, offsetY } = e;
      downInfo.value.x = clientX;
      downInfo.value.y = clientY;
      downInfo.value.offsetX = offsetX;
      downInfo.value.offsetY = offsetY;
      changeType.value = "position";
    };

    // 添加图片
    const imgMouseUp = () => {
      intervalTime.up = new Date().getTime();
      changeType.value = "";
    };

    // 拖动改变图片宽，按下
    const imgDown = (position, item, e) => {
      curEditDom.value = item;
      const info = e.target.parentNode.getBoundingClientRect();
      changeType.value = "width";
      borderPosition.value = position;
      changBoxInfo.value = info;
      changeSizeDom.value = e.target.parentNode;
    };

    // 鼠标移出区域
    const leave = () => {
      draggableHeight.value = 10;
      borderPosition.value = "";
      if (changeType.value !== "height") {
        changeType.value = "";
      }
    };

    // 选择图片回调
    const selectImg = ({ url }) => {
      curEditDom.value.image = ReplaceUrl(url);
    };

    const openSelectModal = (item) => {
      const { down, up } = intervalTime;
      if (up - down > 200) return;
      curEditDom.value = item.datas;
      if (item.datas.image === "") {
        openModal(true, {
          getnumber: "one",
        });
      } else {
        store.baseCompId = item.id;
        store.activeComponentId = props.compId;
        store.editMode = item.componentName;
      }
    };

    const matchImage = (url) => {
      if (!Boolean(url)) {
        return new URL(`../../../assets/images/floatimgadd.jpg`, import.meta.url).href;
      }
      return url;
    };

    const inputText = (e, data) => {
      data.datas.value = e.target.innerText;
    };

    return {
      up,
      down,
      move,
      imgMouseDown,
      imgMouseUp,
      wrapperDom,
      addImg,
      imgDown,
      leave,
      registerFileManage,
      selectImg,
      openSelectModal,
      matchImage,
      draggableHeight,
      openInput,
      enter,
      blur,
      drop,
      showMask,
      dragleave,
      editComp,
      editButton,
      isHasImg,
      inputText,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  position: relative;
  overflow: hidden;
  user-select: none;
  &.openMask {
    &::before {
      position: absolute;
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      filter: blur(2px);
      background-color: #f5f8ff;
      z-index: 1;
    }
    &::after {
      z-index: 2;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      color: #5874d8;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #5874d8;
      box-sizing: border-box;
      content: "放入自由容器中";
    }
  }
}
.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: inline-block;
  transform: translateY(50%);
  cursor: n-resize;
}
.add-img {
  position: absolute;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: 1px dashed transparent;
  .img-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    img {
      user-select: none;
      width: 100%;
    }
  }

  span {
    display: none;
    position: absolute;
    &::after {
      position: absolute;
      content: "";
      display: block;
      width: 8px;
      height: 8px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid #5874d8;
    }

    &:nth-of-type(1) {
      top: 0;
      left: 0;
      right: 0;
      height: 12px;
      transform: translateY(-50%);
      cursor: n-resize;
      &::after {
        top: 2px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    &:nth-of-type(2) {
      top: 0;
      bottom: 0;
      right: 0;
      width: 12px;
      transform: translateX(50%);
      cursor: ew-resize;
      &::after {
        right: 2px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    &:nth-of-type(3) {
      left: 0;
      right: 0;
      bottom: 0;
      cursor: n-resize;
      height: 12px;
      transform: translateY(50%);
      &::after {
        bottom: 1px;
        left: 50%;
        transform: translate(-50%);
      }
    }
    &:nth-of-type(4) {
      top: 0;
      bottom: 0;
      left: 0;
      width: 12px;
      transform: translateX(-50%);
      cursor: ew-resize;
      &::after {
        left: 1px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  &.has-img {
    &:hover {
      border-color: #5874d8;
      span {
        display: block;
      }
    }
  }
}
.custom-wrapper {
  position: absolute;
  padding: 10px;
  &:hover {
    span {
      border-color: #5874d8 !important;
      &::after {
        border-color: #5874d8;
      }
    }
  }
  .custom-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    width: 100%;
    height: 100%;
    background-color: gray;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
  }
  span {
    position: absolute;
    display: block;
    cursor: n-resize;
    &::after {
      position: absolute;
      display: block;
      content: "";
      border-radius: 50%;
      box-sizing: border-box;
      border: 1px solid transparent;
      width: 10px;
      height: 10px;
    }
    &::before {
      position: absolute;
      content: "";
      display: block;
    }
    &:nth-of-type(1) {
      left: 0;
      right: 0;
      top: 0;
      height: 10px;
      border-top: 1px dashed transparent;
      &::after {
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &::before {
        top: 0;
        left: 0;
        right: 0;
        height: 20px;
        transform: translateY(-100%);
      }
    }
    &:nth-of-type(2) {
      top: 0;
      bottom: 0;
      right: 0;
      width: 10px;
      cursor: ew-resize;
      border-right: 1px dashed transparent;
      &::after {
        top: 50%;
        transform: translate(50%, -50%);
      }
      &::before {
        top: 0;
        bottom: 0;
        right: 0;
        width: 20px;
        transform: translateX(100%);
      }
    }
    &:nth-of-type(3) {
      left: 0;
      right: 0;
      bottom: 0;
      height: 10px;
      border-bottom: 1px dashed transparent;
      &::after {
        left: 50%;
        transform: translate(-50%, 50%);
      }
      &::before {
        right: 0;
        bottom: 0;
        left: 0;
        height: 20px;
        transform: translateY(100%);
      }
    }
    &:nth-of-type(4) {
      top: 0;
      bottom: 0;
      left: 0;
      width: 10px;
      cursor: ew-resize;
      border-left: 1px dashed transparent;
      &::after {
        top: 50%;
        transform: translate(-50%, -50%);
      }
      &::before {
        top: 0;
        bottom: 0;
        left: 0;
        width: 20px;
        transform: translateX(-100%);
      }
    }
  }
}
.input {
  position: absolute;
  line-height: 20px;
  border: 1px dashed transparent;
  display: inline-block;
  width: 200px;
  font-size: 18px;
  padding: 4px;
  box-sizing: border-box;
  cursor: text;
  &:hover,
  &:focus {
    border-color: #5874d8;
  }
  &:empty::before {
    color: #666;
    font-size: 18px;
    content: attr(placeholder);
    user-select: none;
  }
}
.data-empty::before {
  content: "目前自由容器仅支持放置常用模板";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: rgb(167, 167, 167);
}
</style>
