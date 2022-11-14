<template>
  <div class="uploadImg">
    <!-- 上传图片 -->
     <a-modal v-model:visible="dialogVisible" title="图片库"  width="65%" @ok="handleClose">
        <a-layout style="height: 500px; position: relative;">
            <a-layout-sider width="150px" style="background-color: white;">
              <a-menu mode="inline" @select="onSelectCate"  v-model:selectedKeys="selectedKeys">
                <a-menu-item :key="1">默认图片</a-menu-item>
                 <a-menu-item v-for="item in cateList" :key="item.id">
                    <span>{{item.name}}</span>
                  </a-menu-item>
                  <a-menu-item :key="2">公共图片</a-menu-item>
              </a-menu>
            </a-layout-sider>
            <a-layout-content style="overflow-y: auto;">
              <CardList :params="params" :api="getImgList" :select="true" :del="showdel" :setgrid="6" @get-method="getMethod" @select="handleSelect" @delete="deleteFile">
                  <template #header>
                    <Upload
                      :accept="['image/*']"
                      :multiple="false"
                      :before-upload="beforeUpload"
                      :show-upload-list="false"
                    >
                      <Button type="primary" color="success" :loading="upLoading">{{(upLoading?"正在上传中":"添加新图片")}} </Button>
                    </Upload>
                  </template>
            </CardList>
            </a-layout-content>
          </a-layout>
          <template #footer>
            <div class="fbtn">
               <div class="left">
                <a-button key="submit" type="primary" @click="showGroup=true">分组管理</a-button>
               </div>  
               <div class="right">
                 <a-button key="back" @click="handleClose">关闭</a-button>
                </div>  
            </div>
        </template>
    </a-modal>
    <!--分组管理-->
    <a-modal
      v-model:visible="showGroup"
      title="分组管理"
      width="800"
      :footer="null"
      @ok="showGroup = false"
    >
       <groupTable ref="tableRef" @upgroup="upgroupList"/>
    </a-modal>
  </div>
</template>

<script>
import { Modal,Menu ,Upload} from 'ant-design-vue';
import { reactive, toRefs,ref,nextTick } from 'vue'
import { useMessage } from '/@/hooks/web/useMessage';
import { getCateList,getImgList} from '/@/api/common/upload';
import { CardList } from '/@/components/CardList';
import { Button } from '/@/components/Button';
import { useGlobSetting } from '/@/hooks/setting';
import {  uploadApi ,delApi} from '/@/api/common/upload';
//工具
import { ReplaceUrl } from '/@/utils/imgurl';
import groupTable from './groupTable.vue';
import { useUserStore } from '/@/store/modules/user';
export default {
  name: 'uploadImg',
  emits: ['uploadInformation', 'handleClose'],
  components:{AModal:Modal,AMenu:Menu, AMenuItem: Menu.Item,
  Button,CardList,Upload,groupTable},
  setup(props, ctx) {
    const showdel=ref(true)
    const showGroup=ref(false)
    const {
      createMessage,
      createConfirm,
      notification,
    } = useMessage();
    const { info, success, warning, error } = createMessage;
    // 数据集合
    const datas = reactive({
      dialogVisible: false, //弹框默认隐藏
      dialogImageUrl: '', // 上传的图片
      uploadShow: false, //是否显示上传图片
    })

    // 事件集合
    const methods = {
      /* 显示上传文件组件 */
      showUpload() {
        datas.dialogVisible = true
        getcate();
      },
      // 关闭弹框
      handleClose() {
          datas.dialogVisible = false
      },

    }
    //新
    const userStore = useUserStore();
    const rooturl = ref(userStore.getUserInfo?.rooturl || '');//获取图片
    // 请求api时附带参数
    const params = ref({cid:1,rooting:rooturl});
    const cateList=ref()
    const list=ref()
    const selectedKeys = ref([1])
    const upLoading=ref(false)
    //获取分类
    async function getcate(){
      cateList.value= await getCateList({filetype:1});
    }
    //切换分类
     function onSelectCate({  key, selectedKeys }){
        selectedKeys.value=selectedKeys
        showdel.value=key==2?false:true
        params.value={cid:key,rooting:rooturl}
        nextTick(()=>{
           reload();
        })
        // imgList()
     }
     /**图片 */
    let reload = () => {};
    // 获取内部fetch方法;
    function getMethod(m) {
      reload = m;
    }
     //选择图片事件
    function handleSelect(item) {
      // console.log(item);
      ctx.emit('uploadInformation',ReplaceUrl(item.url))
      datas.dialogVisible = false
      // notification.success({ message: `选择图片${item.url}` });
    }
    /****图片上传 */
    // 上传前校验
    async function beforeUpload(file) {
      const { maxSize } = props;
      // 设置最大值，则判断
      if (maxSize && file.size / 1024 / 1024 >= maxSize) {
        createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
        return false;
      }
      //开始手动上传
       const filename=""
       upLoading.value=true
      const upres= await uploadApi({ name: 'file', file: file, filename,data:{cid:selectedKeys.value[0]} })
      if(upres.status==200&&upres.data.status){
        upLoading.value=false
          nextTick(()=>{
            reload();
          })
      }
       return false;
    }
    //删除图片
    async function deleteFile(id){
       const delres= await delApi(id)
       if(delres==1){
         nextTick(()=>{
          reload();
        })
       }
    }
    //更新分组数据
    function upgroupList(){
      getcate()
    }
    //分组管理
    return {
      ...toRefs(datas),
      ...methods,
      //分类
      selectedKeys,
      cateList,
      list,
      onSelectCate,
      params,
      getMethod,
      handleSelect,
      getImgList,
      //图片
      showdel,
      beforeUpload,
      upLoading,
      deleteFile,
      showGroup,
      upgroupList,
    }
  },
}
</script>

<style lang="less" scoped>
@import '/@/assets/css/minx.less';
.uploadImg {
  // 上传弹框内容部分
  :deep(.el-dialog__body) {
    height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    justify-content: center;
  }

  .disable {
    :deep(.el-upload) {
      display: none !important;
    }
  }
  .el-icon-plus {
    display: block;
    margin-top: 50px;
  }
}
.fbtn{
  display: flex;
  .left{
    flex:1;
    text-align: left;
  }
  .right{
    flex:1;
  }
}
</style>
