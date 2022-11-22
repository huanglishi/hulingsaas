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
                  <FormItem label="产品名称" name="title" :rules="[{ required: true }]">
                    <a-input v-model:value="formData.title" placeholder="填写产品名称" style="width: 410px;"/>
                  </FormItem>
                  <FormItem label="产品分类" name="cid">
                     <div class="formFlex">
                        <div class="left">
                          <Select
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
                          </Select>
                        </div>
                        <div class="right">
                          <a-button @click="openCate">分类管理</a-button>
                        </div>
                     </div>
                  </FormItem>
                   <!--参数值-->
                  <FormItem name="pro_val">
                    <div class="probox">
                      <div class="pro_header"><span class="showbtn" @click="()=>{showpro=!showpro}"><Icon :icon="showpro?'radix-icons:triangle-down':'radix-icons:triangle-right'" size="18" color="#262626"></Icon>产品参数：</span> <a class="showbtn"  @click="handelOpenPro">【参数管理】</a></div>
                      <div class="pro_list" v-show="showpro">
                        <Row v-if="prolist&&prolist.length>0">
                          <template v-for="item in prolist">
                            <Col :span="12">
                              <a-form-item-rest>
                               <div class="field">
                                  <div class="label">{{item.name}}：</div>
                                  <div class="text">
                                    <a-input v-if="item.type==1" v-model:value="item.val" :placeholder="`请填写${item.name}`" style="width: 100%;"/>
                                    <AutoComplete
                                      v-else
                                      v-model:value="item.val"
                                      class="certain-category-search"
                                      dropdown-class-name="certain-category-search-dropdown"
                                      :dropdown-match-select-width="235"
                                      :options="item.vallist"
                                    >
                                      <template #option="item">
                                        <div style="display: flex; justify-content: space-between">
                                            {{ item.value }}
                                            <span>
                                            </span>
                                          </div>
                                      </template>
                                      <a-input :placeholder="`请填写${item.name}`" style="width: 100%;"/>
                                    </AutoComplete>
                                  </div>
                               </div>
                              </a-form-item-rest>
                            </Col>
                          </template>
                        </Row>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="产品图片" name="images">
                    <div class="empyupbtn" v-if="!formData.images||formData.images.length==0" @click="handleFileManage">
                       <div class="icontext"><Icon class="iconbtn" icon="line-md:plus" size="25" ></Icon>点击添加图片</div>
                    </div>
                    <div class="upimg" v-else>
                        <div class="img_item upbtn" @click="handleFileManage">
                          <div class="btnbox">
                              <div class="upicon"><plusOutlined /></div>
                              <div class="uptext">上传图片</div>
                          </div>
                        </div>
                          <vuedraggable
                              tag="div"
                              class="imglist"
                              :list="formData.images"
                              item-key="index"
                              :forceFallback="true"
                              :animation="200"
                            >
                            <template #item="{ element, index }">
                              <div class="img_item previewbox" >
                                <div class="imgbox">
                                  <img :src="ReplaceUrl(element)"/>
                                </div>
                                <div class="fl_tool">
                                  <div class="toolbox">
                                    <div class="lf">
                                      <Icon class="iconbtn" icon="mdi:refresh-circle" color="#acd239" size="18" @click="replyFileManage(index)"></Icon>
                                    </div>
                                    <div class="md">
                                      <Icon class="iconbtn" icon="icon-park-solid:preview-open" color="#5874d8" size="18" @click="previewImg(ReplaceUrl(element))"></Icon>
                                    </div>
                                    <div class="rt">
                                      <Icon class="iconbtn" icon="ri:delete-bin-line" color="#ff4d4f" size="18" @click="removeImg(element)"></Icon>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            </template>
                          </vuedraggable>
                    </div>
                  </FormItem>
              </div>
              <!--高级信息-->
              <div class="hcontent" v-show="activeKey==2">
                   <!--编辑器-->
                   <FormItem label="" name="content" v-if="formData.type==0" style="margin: 0px;">
                      <div class="inlinebox">
                        <div class="centerbox">
                          <Tinymce v-model="formData.content" width="550px" height="545"
                          toolbar="undo redo restoredraft lineheight bold italic alignleft aligncenter alignright outdent indent indent2em forecolor 
                        backcolor bullist numlist link fontsizeselect fontselect formatpainter myimage"/>
                        </div>
                      </div>
                  </FormItem>
              </div>
               <!--其他信息-->
               <div class="otherinfo" v-show="activeKey==3">
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
                  <FormItem label="标签" name="lid">
                    <Select
                      v-model:value="formData.lid"
                      :options="labellist"
                      mode="tags"
                      placeholder="选择产品标签"
                      style="width: 410px"
                      :fieldNames="{label:'name', value: 'id'}"
                      allowClear
                    ></Select>
                  </FormItem>
                  <FormItem label="产品简介" name="des">
                    <a-textarea v-model:value="formData.des" placeholder="填写产品简介" :rows="4" show-count :maxlength="255" allow-clear style="width: 410px;"/>
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
       <!--参数管理-->
      <proModal @register="proModals"  @upcateData="upProData"/>
     </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed,reactive, unref,toRefs, nextTick } from 'vue';
  import dayjs, {  } from 'dayjs';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import { createImgPreview } from '/@/components/Preview/index';
  import cateModal from './cateModal.vue';
  import proModal from './proModal.vue';
  //API
  import { getFormCateList } from '/@/api/product/cate';
  import { saveProduct ,getProduct} from '/@/api/product/manage';
  import { getList } from '/@/api/product/pro';
  import { getFormLabelList } from '/@/api/product/label';
  //组件
  import { Tabs,TabPane,Form,FormItem,RadioGroup,Radio,DatePicker,Select,FormInstance,Row,Col,AutoComplete} from 'ant-design-vue';
  import { ReplaceUrl } from '/@/utils/imgurl';
  import { Tinymce } from '/@/components/Tinymce/index';
  import {PlusOutlined,PhoneOutlined} from '@ant-design/icons-vue';
  import { FileManage } from '/@/components/FileManage';
  import vuedraggable from 'vuedraggable' //拖拽组件
  import {  ProItem,ProItemVal } from './data';
  // 局部引入element UI
   import { ElScrollbar } from 'element-plus'
  export default defineComponent({
    name: 'DeptModal',
    components: { 
      BasicModal, Tinymce,PlusOutlined,PhoneOutlined,FileManage,Icon,
      // BasicForm,
      Tabs,TabPane,Form,FormItem,RadioGroup,Radio,DatePicker,Select,Row,Col,AutoComplete,AFormItemRest:Form.ItemRest,
      ElScrollbar,cateModal,vuedraggable,proModal,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const formRef = ref<FormInstance>();
      const isUpdate = ref(true);
      const rowId = ref('');
      //弹框
      const [cateModals, { openModal: openCate }] = useModal();//分组
      const [proModals, { openModal: openPro }] = useModal();//参数
      //表单数据
      const arr_images: string[] = [] // 定义字符串数组
      const pro_item: ProItem[] = [] // 产品参数
      const pro_item_val: ProItemVal[] = [] // 产品参数
      const initform={
        type:0,
        cid:[],
        lid:[],
        title:"",
        des:"",
        content:"",
        releasetime:dayjs(dateFormat(0), "YYYY-MM-DD HH:mm"),
        pro_list:pro_item_val,
        images:arr_images,
        views:50,
      }
      const pagedata=reactive({
        formData:initform,
        Timetype:0,
        activeKey:1,
        fetching:false,
        upLoading:false,
        cateList:[],
        prolist:pro_item,//参数列表
        showpro:true,//是否显示参数
        labellist:[],//标签
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
          const bigdata = await getProduct({id:data.record.id});
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
        //获取参数
        nextTick(()=>{
          upProData()
        })
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增产品' : '编辑产品'));
      function fetchCate(){

      }
      //提交数据
      async function handleSubmit() {
        try {
           await (formRef.value?.validate())
          const values =pagedata.formData;
          // const values = await validate();
          //参数
          if(pagedata.prolist&&pagedata.prolist.length>0){
            values.pro_list=[]
            pagedata.prolist.forEach((item)=>{
              values.pro_list.push({
                id:item.id,
                val:item.val,
              })
            })
          }
          setModalProps({ confirmLoading: true });
          try {
            createMessage.loading({ content: '提交中...', key:"saveArticle",duration:0});
            const resultdata = await saveProduct(values);
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
          getnumber: "more",
        });
      }
      //替换图片
      function replyFileManage(index){
        openFileManage(true, {
          getnumber: "one",
          index:index
        });
      }
      //选择图片返回
      function selectImg(item){
          if(item.type=="more"){
             item.list.forEach((img) => {
               pagedata.formData.images.push(img)
             });
          }else if(item.type=="one"){
            pagedata.formData.images[item.data.index]=item.url
          }
      }
      //图片预览
      function previewImg(img){
        createImgPreview({ imageList: [img], defaultWidth: 700, rememberState: true });
      }
      //删除图片
      function removeImg(img){
        pagedata.formData.images=pagedata.formData.images.filter((item)=>item!=img)
      }
      //分组更新数据
      async function upCateData(){
        const treeData = await getFormCateList({});
        if(treeData){
          pagedata.cateList=treeData
        }
      }
      //参数更新数据
      async function upProData(){
         const prolist = await getList({from:"product",product_id:rowId.value});
        if(prolist){
          pagedata.prolist=prolist
        }
        nextTick(()=>{
          getLabel()
        })
      }
      //标签数据
      async function getLabel(){
         const label = await getFormLabelList({});
        if(label){
          pagedata.labellist=label
        }
      }
      function handelOpenPro(){
        openPro(true)
      }
      return { 
        ...toRefs(pagedata),
        getTitle, 
        tapList:[
          {id:1,name:"基础信息"},
          {id:2,name:"详情内容"},
          {id:3,name:"其他信息"},
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
        registerFileManage,handleFileManage,selectImg,replyFileManage,
        //图片预览
        previewImg,removeImg,
        //分组
        upCateData,cateModals,openCate,
        //参数
        upProData,proModals,handelOpenPro,
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
        //基础信息
        .besecontent,.otherinfo{
          padding-top: 25px;
        }
        //高级-内容
        .hcontent{
          margin-top: -2px;
          .inlinebox{
            display: flex;
          justify-content: center;
          align-items: center;
            .centerbox{

            }
          }
        }
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
.empyupbtn{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 550px;
  height: 120px;
  border: 1px dashed #ccc;
  margin-top: 10px;
  user-select: none;
  cursor: pointer;
   .icontext{
    color: #666;
    .iconbtn{
      margin-bottom: 3px;
      padding-right: 10px;
      display: inline-block !important;
    }
   }
}

//已上传
.upimg{
     display: flex;
     margin-top: 10px;
     .img_item{
        width: 120px;
        height: 120px;
        border:#e5e7eb solid 1px;
        border-radius: 5px;
        margin: 0px 10px 10px 0px;
        overflow: hidden;
        //1.上传按钮
        &.upbtn{
          display: flex;
          justify-content: center;
          align-items: center;
          cursor:pointer;
          .btnbox{
              text-align: center;
              user-select: none;
            }
        }
     }
      //2.图片展示
      .imglist{
        display: flex;
        .previewbox{
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              position: relative;
              cursor: move;
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
        }
   
  }
  //参数
  .probox{
    width: 660px;
    padding-left:  30px;
    .pro_header{
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      .showbtn{
        user-select: none;
        cursor: pointer;
      }
    }
    .pro_list{
      margin-top: 10px;
      .field{
        display: flex;
        margin-bottom: 10px;
        .label{
           width: auto;
           display: flex;
           align-items: center;
           justify-content: flex-end;
           min-width: 80px;
        }
        .text{
          flex:1;
        }
      }

    }
  }
</style>
