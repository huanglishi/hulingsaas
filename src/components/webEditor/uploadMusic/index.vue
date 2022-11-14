<template>
  <div class="uploadImg">
    <!-- 上传附件 -->
     <a-modal v-model:visible="dialogVisible" title="音乐库"  width="65%" @ok="handleClose">
        <a-layout style="height: 500px; position: relative;">
            <a-layout-sider width="150px" style="background-color: white;">
              <a-menu mode="inline" @select="onSelectCate"  v-model:selectedKeys="selectedKeys">
                <a-menu-item :key="6">默认音乐</a-menu-item>
                 <a-menu-item v-for="item in cateList" :key="item.id">
                    <span>{{item.name}}</span>
                  </a-menu-item>
                  <a-menu-item :key="5">公共音乐</a-menu-item>
              </a-menu>
            </a-layout-sider>
            <a-layout-content style="overflow-y: auto;">
              <CardList :params="params" :api="getImgList" :select="true" :del="showdel" :setgrid="5" @get-method="getMethod" @select="handleSelect" @delete="deleteFile">
                  <template #header>
                      <Button type="primary" color="success" @click="addMusic">添加新音乐</Button>
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
       <groupMusic ref="tableRef" @upgroup="upgroupList"/>
    </a-modal>
    <!--上传音频页面-->
    <a-modal
      v-model:visible="showMusic"
      title="上传音频"
      width="800"
      @cancel="showMusic = false"
      @ok="updateFile"
    >
      <div class="mForm">
        <Form  :model="formMusic" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <FormItem label="附件" required>
            <Upload
              :accept="['audio/*']"
              :multiple="false"
              :before-upload="(file)=>{beforeUpload(file,'url')}"
              :show-upload-list="false"
            >
                <div v-if="!formMusic.url">
                  <Button type="primary" color="success" :loading="upLoading">{{(upLoading?"正在上传中":"添加附件")}} </Button>
                </div>
            </Upload>
            <div v-if="formMusic.url" class="mainPage" >
              <audio :src="ReplaceUrl(formMusic.url)" preload="meta" controls></audio>
              <CloseCircleOutlined class="close" :style="{fontSize:'20px'}" @click="deleteFile(formMusic.id)"/>
            </div>
          </FormItem>
          <FormItem label="名称" required>
              <a-input v-model:value="formMusic.title" placeholder="请输入附件名称"/>
          </FormItem>
          <FormItem label="封面" required>
            <Upload
                :accept="['image/*']"
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="(file)=>{beforeUpload(file,'coverUrl')}"
              >
                <img v-if="formMusic.coverUrl" :src="ReplaceUrl(formMusic.coverUrl)" alt="avatar" />
                <div v-else>
                  <loading-outlined v-if="coverloading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </Upload>
          </FormItem>
        </Form>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { PlusOutlined,CloseCircleOutlined,LoadingOutlined } from '@ant-design/icons-vue';
import { Modal,Menu ,Upload,Form} from 'ant-design-vue';
import { reactive, toRefs,ref,nextTick } from 'vue'
import { useMessage } from '/@/hooks/web/useMessage';
import { getCateList,getImgList} from '/@/api/common/upload';
import { CardList } from '/@/components/CardList';
import { Button } from '/@/components/Button';
import { uploadApi ,delApi,updateApi} from '/@/api/common/upload';
//工具
import { ReplaceUrl } from '/@/utils/imgurl';
import groupMusic from './groupMusic.vue';
import { useUserStore } from '/@/store/modules/user';
export default {
  name: 'uploadMusic',
  emits: ['uploadInformation', 'handleClose'],
  components:{AModal:Modal,AMenu:Menu, AMenuItem: Menu.Item,Form,FormItem:Form.Item,PlusOutlined,CloseCircleOutlined,LoadingOutlined ,
  Button,CardList,Upload,groupMusic},
  setup(props, ctx) {
    const showdel=ref(true)
    const showGroup=ref(false)
    const showMusic=ref(false)
    const {
      createMessage,
      createConfirm,
      notification,
    } = useMessage();
    const { info, success, warning, error } = createMessage;
    // 数据集合
    const datas = reactive({
      dialogVisible: false, //弹框默认隐藏
      dialogImageUrl: '', // 上传的附件
      uploadShow: false, //是否显示上传附件
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
    const params = ref({cid:6,rooting:rooturl});
    const cateList=ref()
    const list=ref()
    const selectedKeys = ref([6])
    const upLoading=ref(false)
    const coverloading=ref(false)
    //获取分类
    async function getcate(){
      cateList.value= await getCateList({filetype:3});//filetype=3 音乐
    }
    //切换分类
     function onSelectCate({  key, selectedKeys }){
        selectedKeys.value=selectedKeys
        showdel.value=key==5?false:true//删除按钮
        params.value={cid:key,rooting:rooturl}
        nextTick(()=>{
           reload();
        })
        // imgList()
     }
     /**附件 */
    let reload = () => {};
    // 获取内部fetch方法;
    function getMethod(m) {
      reload = m;
    }
     //选择视频事件
    function handleSelect(item) {
      ctx.emit('uploadInformation',{title:item.title,url:ReplaceUrl(item.url),cover_url:ReplaceUrl(item.cover_url)})
      datas.dialogVisible = false
    }
    //上传
    const formMusic= ref({
      id:"",
      url:"",
      title: '',
      coverUrl: "",
    });
    function addMusic(){
      //初始化数据
      formMusic.value={
        id:"",
        url:"",
        title: '',
        coverUrl: "",
      }
      showMusic.value = true
    }
    /****附件上传 */
    // 上传前校验
    async function beforeUpload(file,field) {
      const { maxSize } = props;
      // 设置最大值，则判断
      if (maxSize && file.size / 1024 / 1024 >= maxSize) {
        createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
        return false;
      }
      let upcid=0
      if(field=="url"){
        upLoading.value=true
        upcid=selectedKeys.value[0]
      }else if(field=="coverUrl"){
        coverloading.value=true
        upcid=2//默认图片
      }
      //开始手动上传
      const filename=""
      const upres= await uploadApi({ name: 'file', file: file, filename,data:{cid:upcid} })
      if(upres.status==200&&upres.data.status){
         if(field=="url"){
          formMusic.value.id=upres.data.id
          formMusic.value.url=upres.data.url
          formMusic.value.title=upres.data.name
          upLoading.value=false
         }else if(field=="coverUrl"){//封面
          coverloading.value=true
          formMusic.value.coverUrl=upres.data.url
        }
      }
       return false;
    }
    //更新附件
    async function updateFile(id){
      if(!formMusic.value.id||!formMusic.value.url){
        warning("请上传附件")
      }else if(!formMusic.value.title){
        warning("请输入名称")
      }else if(!formMusic.value.coverUrl){
        warning("请上传封面")
      }else{
        const upres= await updateApi({id:formMusic.value.id,url:formMusic.value.url,title:formMusic.value.title,cover_url:formMusic.value.coverUrl})
        if(upres){
          ctx.emit('uploadInformation',{title:formMusic.value.title,url:ReplaceUrl(formMusic.value.url),cover_url:ReplaceUrl(formMusic.value.coverUrl)})
          datas.dialogVisible = false
          showMusic.value = false
        }
      }
    }
    //删除附件
    async function deleteFile(id){
       if(!id)return
       const delres= await delApi(id)
       if(delres==1){
        formMusic.value.url=""
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
      //附件
      showdel,
      beforeUpload,
      upLoading,
      deleteFile,
      showGroup,
      upgroupList,
      //上传
      addMusic,
      showMusic,formMusic,coverloading,ReplaceUrl,updateFile,
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
.ant-form{
  padding: 10px;
}
.mainPage{
    position: relative;
  .close{
    position: absolute;
    top:-2px;
    right: -15px;
    color: red;
  }
}
</style>
