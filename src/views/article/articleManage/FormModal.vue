<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="920px" minHeight="550">
     <div class="addFormbox" style="min-height:550px">
      <div class="tabs-header">
        <div class="tabs-nav-wrap">
            <div class="tap_item" v-for="iten in tapList" :class="{item_active:activeKey==iten.id}" @click="()=>{activeKey=iten.id}">
                <div class="label">{{iten.name}}</div>
            </div>
        </div>
        <div class="tabs-bar" :style="{top: `${(activeKey-1)*65}px`,height: `65px`}"></div>
      </div>
      <div class="tabs-content">
        <el-scrollbar height="550px">
          <Form ref="formRef" :model="formData" @finishFailed="onFinishFailed">
          <div class="content_box">
              <!--基础信息-->
              <div class="besecontent" v-show="activeKey==1">
                  <FormItem label="文章形式">
                    <RadioGroup v-model:value="formData.type">
                      <Radio :value="0">站内文章</Radio>
                      <Radio :value="1">站外连接</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="标题" name="title" :rules="[{ required: true }]">
                    <a-input v-model:value="formData.title" placeholder="填写标题" style="width: 410px;"/>
                  </FormItem>
                  <FormItem label="文章外链" name="link" v-if="formData.type==1" :rules="[{ required: true }]">
                    <a-input v-model:value="formData.link" placeholder="填写文章外链" style="width: 410px;"/>
                  </FormItem>
                  <!--编辑器-->
                  <FormItem label="文章详情" name="content" v-if="formData.type==0" :rules="[{ required: true }]">
                    <Tinymce v-model="formData.content" width="480px" height="550"
                    toolbar="undo redo restoredraft lineheight bold italic alignleft aligncenter alignright outdent indent indent2em forecolor 
                    backcolor bullist numlist link fontsizeselect fontselect formatpainter myimage"/>
                  </FormItem>
              </div>
              <!--高级信息-->
              <div class="hcontent" v-show="activeKey==2">
                  <FormItem label="文章分类" name="cid">
                     <div class="formFlex">
                        <div class="left">
                          <a-select
                            v-model:value="formData.cid"
                            mode="multiple"
                            placeholder="请选择分类"
                            style="width: 410px"
                            :not-found-content="fetching ? undefined : null"
                            :options="cateList"
                            @search="fetchCate"
                            :fieldNames="{label:'name', value: 'id'}"
                          >
                            <template v-if="fetching" #notFoundContent>
                              <a-spin size="small" />
                            </template>
                            <template #option="{ value: id, name_txt }">
                              <span role="img" :aria-label="id" v-html="name_txt"></span>
                            </template>
                          </a-select>
                        </div>
                        <div class="right">
                          <a-button @click="openCate">分类管理</a-button>
                        </div>
                     </div>
                  </FormItem>
                  <FormItem label="发布时间" >
                      <RadioGroup v-model:value="Timetype">
                        <Radio :value="0">立即发布</Radio>
                        <Radio :value="1">定时发布</Radio>
                      </RadioGroup>
                     <div class="minput">
                      <DatePicker
                          v-model:value="formData.releasetime"
                          format="YYYY-MM-DD HH:mm"
                          :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm') }"
                          style="width: 410px;"
                          :disabled="Timetype==0"
                        />
                     </div>
                  </FormItem>
                  <FormItem label="来源" name="froms">
                    <a-input v-model:value="formData.froms" placeholder="填写文章来源" allow-clear style="width: 410px;"/>
                  </FormItem>
                  <FormItem label="作者" name="author">
                    <a-input v-model:value="formData.author" placeholder="填写文章作者" allow-clear style="width: 410px;"/>
                  </FormItem>
                  <FormItem label="文章摘要" name="des">
                    <a-textarea v-model:value="formData.des" placeholder="填写文章摘要" :rows="4" show-count :maxlength="255" allow-clear style="width: 410px;"/>
                  </FormItem>
                  <FormItem label="封面图" name="image">
                    <div class="upimg">
                      <div class="previewbox" v-if="formData.image!=''">
                        <div class="imgbox">
                          <img :src="ReplaceUrl(formData.image)"/>
                        </div>
                        <div class="fl_tool">
                           <div class="toolbox">
                            <div class="lf">
                              <Icon class="iconbtn" icon="mdi:refresh-circle" color="#acd239" size="18" @click="handleFileManage"></Icon>
                            </div>
                            <div class="md">
                              <Icon class="iconbtn" icon="icon-park-solid:preview-open" color="#5874d8" size="18" @click="previewImg(ReplaceUrl(formData.image))"></Icon>
                            </div>
                            <div class="rt">
                              <Icon class="iconbtn" icon="ri:delete-bin-line" color="#ff4d4f" size="18" @click="()=>{formData.image=''}"></Icon>
                            </div>
                           </div>
                        </div>
                      </div>
                      <div class="upbtn" v-else  @click="handleFileManage">
                        <div class="btnbox">
                            <div class="upicon"><plusOutlined /></div>
                            <div class="uptext">上传图片</div>
                        </div>
                      </div>
                    </div>
                  </FormItem>
              </div>
          </div>
        </Form>
        </el-scrollbar>
      </div>
      <!--图片管理器 -->
      <FileManage  @register="registerFileManage" @success="selectImg"></FileManage>
       <!--分组-->
      <cateModal @register="cateModals"  @upcateData="upCateData"/>
     </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed,reactive, unref,toRefs } from 'vue';
  import dayjs, {  } from 'dayjs';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import { createImgPreview } from '/@/components/Preview/index';
  import cateModal from './cateModal.vue';
  //API
  import { getFormCateList } from '/@/api/article/cate';
  import { saveArticle ,getArticle} from '/@/api/article/manage';
  //组件
  import { Tabs,TabPane,Form,FormItem,RadioGroup,Radio,DatePicker,Select,FormInstance } from 'ant-design-vue';
  import { ReplaceUrl } from '/@/utils/imgurl';
  import { Tinymce } from '/@/components/Tinymce/index';
  import {PlusOutlined,PhoneOutlined} from '@ant-design/icons-vue';
  import { FileManage } from '/@/components/FileManage';
  // 局部引入element UI
   import { ElScrollbar } from 'element-plus'
  export default defineComponent({
    name: 'DeptModal',
    components: { 
      BasicModal, Tinymce,PlusOutlined,PhoneOutlined,FileManage,Icon,
      // BasicForm,
      Tabs,TabPane,Form,FormItem,RadioGroup,Radio,DatePicker,ASelect:Select,
      ElScrollbar,cateModal,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const formRef = ref<FormInstance>();
      const isUpdate = ref(true);
      const rowId = ref('');
      //分组
      const [cateModals, { openModal: openCate }] = useModal();//分组
      //表单数据
      const initform={
        type:0,
        cid:[],
        title:"",
        des:"",
        content:"",
        link:"",
        releasetime:dayjs(dateFormat(0), "YYYY-MM-DD HH:mm"),
        froms:"",
        author:"",
        image:"",
        views:50,
      }
      const pagedata=reactive({
        formData:initform,
        Timetype:0,
        activeKey:1,
        fetching:false,
        upLoading:false,
        cateList:[],
      })
      const {createMessage,} = useMessage();
      //上传附件
      const [registerFileManage, { openModal:  openFileManage }] = useModal();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await formRef.value?.resetFields()//重置表单
        pagedata.Timetype=0
        pagedata.activeKey=1
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          //获取内容
          const bigdata = await getArticle({id:data.record.id});
          if(bigdata){
              if(bigdata.releasetime>0){
                bigdata.releasetime=dayjs(dateFormat(bigdata.releasetime), "YYYY-MM-DD HH:mm")
              }else{
                bigdata.releasetime=dayjs(dateFormat(0), "YYYY-MM-DD HH:mm")
              }
              pagedata.formData=bigdata
            }
        }else{
          pagedata.formData= initform
        }
        const treeData = await getFormCateList({});
        if(treeData){
          pagedata.cateList=treeData
        }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增文章' : '编辑文章'));
      function fetchCate(){

      }
      //提交数据
      async function handleSubmit() {
        try {
           await (formRef.value?.validate())
          const values =pagedata.formData;
          // const values = await validate();
          setModalProps({ confirmLoading: true });
          try {
            createMessage.loading({ content: '提交中...', key:"saveArticle",duration:0});
            const resultdata = await saveArticle(values);
            closeModal();
            if(resultdata){
              createMessage.success({ content: '提交成功！', key:"saveArticle", duration: 2 });
              emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
            }else if(resultdata==0){
              createMessage.success({ content: '已提交！', key:"saveArticle", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveArticle");
          }
         
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      /***********************函数*********************************************************************** */
      function dateFormat(tims:number) {
            var date=new Date();
            if(tims>0){
              date=new Date(tims*1000);
            }
            var year=date.getFullYear();
            var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            // var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            // 拼接
            return year+"-"+month+"-"+day+" "+hours+":"+minutes;
      }
      //错误返回
      const onFinishFailed =  (errorInfo: any) => {
        createMessage.error("表单验证失败"+errorInfo)
      };
      //打开附件选择器
      function handleFileManage() {
        openFileManage(true, {
          getnumber: "one",
        });
      }
      //选择图片返回
      function selectImg(item){
          if(item.type=="one"){
            pagedata.formData.image=item.url
          }
      }
      //图片预览
      function previewImg(img){
        createImgPreview({ imageList: [img], defaultWidth: 700, rememberState: true });
      }
      //分组更新数据
      async function upCateData(){
        const treeData = await getFormCateList({});
        if(treeData){
          pagedata.cateList=treeData
        }
      }
      return { 
        ...toRefs(pagedata),
        getTitle, 
        tapList:[
          {id:1,name:"基础内容"},
          {id:2,name:"高级内容"},
        ],
        layout:{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        },
        fetchCate,
        registerModal,
        // registerForm, 
        handleSubmit,
        ReplaceUrl,
        //日期选中
        dayjs,formRef,
        onFinishFailed,
        //附件
        registerFileManage,handleFileManage,selectImg,
        //图片预览
        previewImg,
        //分组
        upCateData,cateModals,openCate,
       };
    },
  });
</script>
<style lang="less" scoped>
//添加表单框架
  .addFormbox{
    height: 100%;
    display: flex;
    //右侧边导航
    .tabs-header{
      width: 142px;
      text-align: center;
      border-right: 1px solid #e3e2e8;
      position: relative;
      .tabs-nav-wrap{
        margin-right:-1px;
      }
      .tap_item{
        width: 100%;
        height: 65px;
        line-height: 65px;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        border-left: 0;
        border-right-color: #e3e2e8;
        transition: border-bottom .2s ease,border-top .2s ease;
        margin-top: -1px;
        &.item_active{
          color: #557ce1;
          border-right-color: #fff;
          border-top-color: #e3e2e8;
          border-bottom-color: #e3e2e8;
        }
        &:hover{
          color: #557ce1;
        }
      }
      //选中标志
      .tabs-bar{
        width: 6px;
        background-color: #557ce1;
        position: absolute;
        left: 0;
        transition: top .2s ease;
      }
    }
    //右边内容区
    .tabs-content{
      flex:1;
      overflow: hidden;
      .content_box{
        padding-top: 25px;
        padding-top: 25px;
      }
      //表单定义
      .formFlex{
        display: flex;
        width: 550px;
        .left{
          flex:1;
        }
        .right{

        }
      }
      //嵌入
      .minput{
        margin-top: 10px;
      }
    }
  }
  //表单
  :deep(.ant-form-item-label > label){
    min-width: 110px;
    padding-right: 10px;
    justify-content: flex-end;
  }
  :deep(.ant-form-item){
    margin-bottom: 10px;
  }
  //编辑器
  :deep(.tox .tox-tbtn--bespoke .tox-tbtn__select-label){
  width: auto;
  padding: 0px 10px;
}
//图片
.upimg{
      width: 120px;
      height: 120px;
      border:#e5e7eb solid 1px;
      border-radius: 5px;
      overflow: hidden;
      //图片展示
      .previewbox{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        &:hover{
          border:#557ce1 solid 1px;
          border-radius: 5px;
          .fl_tool{
            display: block;
          }
        }
        //浮窗工具
        .fl_tool{
          position: absolute;
          width: 100%;
          top: 0px;
          display: none;
          .toolbox{
            width: 100%;
            display: flex;
            padding: 5px 0px;
            user-select: none;
            .iconbtn{
              cursor: pointer;
              background-color: #ffffff;
              width: 20px;
              height: 20px;
              padding: 1px;
              border-radius: 100%;
            }
            .lf{
              flex: 1;
              text-align: center;
            }
            .md{
              flex: 1;
              text-align: center;
            }
            .rt{
              flex: 1;
              text-align: center;
             
            }
          }
        }
        .imgbox{
            text-align: center;
            img{
              width: 100%;
              height: auto;
            }
          }
      }
      .upbtn{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        cursor:pointer;
        .btnbox{
            text-align: center;
            user-select: none;
          }
      }
  }
</style>
