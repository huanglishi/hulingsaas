<template>
  <div :class="[prefixCls, { fullscreen }]">
    <!-- <Upload
      name="file"
      multiple
      @change="handleChange"
      :action="uploadUrl"
      :showUploadList="false"
      accept=".jpg,.jpeg,.gif,.png,.webp"
    >
      <a-button ghost color="success" v-bind="{ ...getButtonProps }">
        {{ t('component.upload.imgUpload') }}
      </a-button>
    </Upload> -->
    <a-button @click="showUpload" ghost color="success" v-bind="{ ...getButtonProps }">
        {{ t('component.upload.imgUpload') }}
    </a-button>
     <!-- 上传图片 -->
     <uploadimg ref="uploadRef" @uploadInformation="uploadInformation" />
  </div>
</template>
<script lang="ts">
  import uploadimg from '../../webEditor/uploadImg/index.vue' //图片上传
  import { defineComponent, computed ,ref} from 'vue';

  import { Upload } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'TinymceImageUpload',
    components: { Upload ,uploadimg},
    props: {
      fullscreen: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['uploading', 'done', 'error',"addimg"],
    setup(props, { emit }) {
      let uploading = false;

      const { uploadUrl } = useGlobSetting();
      const { t } = useI18n();
      const { prefixCls } = useDesign('tinymce-img-upload');

      const getButtonProps = computed(() => {
        const { disabled } = props;
        return {
          disabled,
        };
      });
     
      function handleChange(info: Recordable) {
        const file = info.file;
        const status = file?.status;
        const url = file?.response?.url;
        const name = file?.name;

        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
        } else if (status === 'done') {
          emit('done', name, url);
          uploading = false;
        } else if (status === 'error') {
          emit('error');
          uploading = false;
        }
      }
      // 显示上传图片组件   type :  2 页面背景图
      const uploadRef = ref();
      function showUpload() {
        if (!uploading) {
            uploading = true;
          }
        uploadRef.value.showUpload()
      }
      //回调
      function uploadInformation(data) {
          emit('addimg', data);
          uploading = false;
      }
      return {
        prefixCls,
        handleChange,
        uploadUrl,
        showUpload,uploadInformation,uploadRef,
        t,
        getButtonProps,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-img-upload';

  .@{prefix-cls} {
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 20;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }
</style>
