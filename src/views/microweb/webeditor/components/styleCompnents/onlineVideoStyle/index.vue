<template>
  <div class="wrapper">
    <right-nav-header
      :navs="[
        {
          text: '在线视频',
          type: 'onlineVideo',
        },
        {
          text: '编辑模块',
          type: 'edit',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />

    <div class="form">
      <template v-if="activeName === 'onlineVideo'">
        <div class="form-item">
          <div class="title">模块标题：</div>
          <div class="form-item-content">
            <input class="title-text" v-model="datas.containerConfig.title" />
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
        </div>

        <div class="form-item">
          <div class="title">添加视频：</div>
          <div class="form-item-content">
            <ul class="video-origin-list">
              <li
                :class="{
                  active: datas.datas.videoOrigin === 'local',
                }"
                @click="() => (datas.datas.videoOrigin = 'local')"
              >
                <span class="radio-item"></span>
                本地添加
                <el-tooltip
                  effect="light"
                  placement="top"
                  content="支持MP4格式，大小不超过1M"
                >
                  <span class="wenhao"></span>
                </el-tooltip>
              </li>

              <li
                :class="{
                  active: datas.datas.videoOrigin === 'videoUrl',
                }"
                @click="() => (datas.datas.videoOrigin = 'videoUrl')"
              >
                <span class="radio-item"></span>
                视频地址
                <el-tooltip effect="light" placement="top" content="支持视频地址">
                  <span class="wenhao"></span>
                </el-tooltip>
              </li>
            </ul>
          </div>
        </div>

        <!-- 本地视频 -->
        <div
          :style="{
            'background-image': `url(${datas.datas.videoMainImg})`,
          }"
          class="view"
          v-if="datas.datas.videoOrigin === 'local'"
        >
          <div class="btns">
            <span @click="openFileModal('video')">更换</span>
            <i></i>
            <a :href="datas.datas.videoUrl" style="pointer-events: auto" target="__blank"
              >查看</a
            >
          </div>
        </div>

        <!-- 视频地址 -->
        <template v-else>
          <el-input
            class="textarea"
            v-model="videoUrl"
            type="textarea"
            @blur="validataUrl"
          />
        </template>

        <fold-comp
          title="基本设置"
          :open="controllFold"
          @change="(val) => (controllFold = val)"
          :maxHeight="285"
        >
          <div class="form-item">
            <div class="title">循环播放：</div>
            <ul class="radio-group">
              <li
                :class="{
                  active: datas.datas.loop,
                }"
                @click="() => (datas.datas.loop = true)"
              >
                <span class="radio-item"></span>
                是
              </li>
              <li
                :class="{
                  active: !datas.datas.loop,
                }"
                @click="() => (datas.datas.loop = false)"
              >
                <span class="radio-item"></span>
                否
              </li>
            </ul>
          </div>

          <div class="form-item">
            <div class="title">片头图片：</div>
            <div class="video-img">
              <ul class="radio-group">
                <li
                  :class="{
                    active: !datas.datas.customVideImg,
                  }"
                  @click="() => (datas.datas.customVideImg = false)"
                >
                  <span class="radio-item"></span>
                  默认
                </li>
                <li
                  :class="{
                    active: datas.datas.customVideImg,
                  }"
                  @click="() => (datas.datas.customVideImg = true)"
                >
                  <span class="radio-item"></span>
                  自定义
                </li>
              </ul>
              <div class="set-content" v-if="datas.datas.customVideImg">
                <el-button @click="openFileModal('images')">修改图片</el-button>
                <img
                  v-if="datas.datas.customVideoMainImg"
                  :src="datas.datas.customVideoMainImg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div class="form-item">
            <div class="title">播放方式：</div>
            <ul class="radio-group">
              <li
                :class="{
                  active: datas.datas.playUse === 'modal',
                }"
                @click="() => (datas.datas.playUse = 'modal')"
              >
                <span class="radio-item"></span>
                弹层播放
              </li>
              <li
                :class="{
                  active: datas.datas.playUse === 'play',
                }"
                @click="() => (datas.datas.playUse = 'play')"
              >
                <span class="radio-item"></span>
                直接播放
              </li>
            </ul>
          </div>
        </fold-comp>
      </template>

      <!-- 编辑模块 -->
      <template v-else>
        <container-setingf-form :config="datas.containerConfig" />
      </template>
    </div>
  </div>

  <FileManage @register="registerFileManage" @success="selectImg" />
</template>

<script>
import { ref, computed } from "vue";
import { ElTooltip, ElSpace, ElButton, ElInput, ElMessage } from "element-plus";
import publicComponents from "../../publicComponents";
import { ReplaceUrl } from "/@/utils/imgurl";
import { FileManage } from "/@/components/FileManage";
import { useModal } from "/@/components/Modal";

export default {
  name: "onlineVidoeStyle",
  components: {
    ElTooltip,
    ElSpace,
    ElButton,
    FileManage,
    ElInput,
    ...publicComponents,
  },
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const activeName = ref("onlineVideo");
    const videoUrl = ref("");
    const controllFold = ref(false);
    const [registerFileManage, { openModal }] = useModal();

    // 选择图片回调
    const selectImg = (data) => {
      const {
        url,
        cover_url,
        data: { filetype },
      } = data;
      if (filetype === "images") {
        // 选择封面图片
        props.datas.datas.customVideoMainImg = ReplaceUrl(url);
      } else {
        // 选择视频
        props.datas.datas.videoUrl = ReplaceUrl(url);
        props.datas.datas.videoMainImg = ReplaceUrl(cover_url);
      }
    };

    // 打开选择图片
    const openFileModal = (type) => {
      openModal(true, {
        filetype: type,
        getnumber: "one",
      });
    };

    // 监听输入的视频地址
    const validataUrl = (e) => {
      const value = e.target.value;
      const reg = /^https?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/;
      if (!reg.test(value)) {
        ElMessage({
          message: "您输入的视频地址有误",
          type: "warning",
        });
        return;
      }
      props.datas.datas.videoUrl = value;
    };

    return {
      activeName,
      registerFileManage,
      openFileModal,
      selectImg,
      videoUrl,
      validataUrl,
      controllFold,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100%;
  background-color: #fff;
  .form {
    padding: 15px 20px 0;
    .form-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      .title {
        width: 70px;
        text-align: right;
        margin-right: 10px;
        line-height: 30px;
      }
      .form-item-content {
        flex: 1;
        display: flex;
        align-items: center;
        height: 30px;

        .title-text {
          border: 1px solid #e3e2e8;
          color: #333;
          height: 30px;
          text-overflow: ellipsis;
          border-radius: 2px;
          padding: 0 8px;
          box-sizing: border-box;
          font-size: 13px;
          margin-right: 15px;
        }
        .check-box {
          position: relative;
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #333;
          user-select: none;
          cursor: pointer;
          &.active {
            span::after {
              content: "";
              display: inline-block;
              position: absolute;
              top: 0;
              left: 0;
              width: 16px;
              height: 16px;
              background-image: url("../../../assets/images/icon-list.png");
              background-position: -516px 1px;
            }
          }
          span {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid #d0d4d7;
            border-radius: 1px;
            margin-right: 10px;
          }
        }
        .video-origin-list {
          display: flex;
          align-items: center;
          li {
            display: flex;
            align-items: center;
            font-size: 13px;
            white-space: nowrap;

            .wenhao {
              display: inline-block;
              width: 17px;
              height: 17px;
              margin-left: 6px;
              background-image: url("../../../assets/images/mbg01.png");
              background-position: -1380px -693px;
            }
          }
        }
      }
      .radio-group {
        flex: 1;
        display: flex;
        align-items: center;
        height: 30px;
      }
    }

    .view,
    .textarea {
      position: relative;
      width: 340px;
      height: 190px;
      margin-bottom: 15px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;

      .btns {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #657dd7;
        span,
        a {
          display: inline-block;
          padding: 8px 16px;
          color: #fff;
          user-select: none;
          cursor: pointer;
        }
        i {
          display: inline-block;
          width: 1px;
          background-color: #fff;
          height: 16px;
        }
      }

      ::v-deep .el-textarea__inner {
        height: 100%;
      }
    }

    .video-origin-list li,
    .radio-group li {
      user-select: none;
      cursor: pointer;
      &:not(:first-of-type) {
        margin-left: 15px;
      }

      display: flex;
      align-items: center;
      &.active {
        .radio-item::after {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #828282;
        }
      }
      .radio-item {
        position: relative;
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid #d8d8d8;
        border-radius: 50%;
        margin-right: 6px;
      }
    }

    .set-content {
      img {
        margin-top: 10px;
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
