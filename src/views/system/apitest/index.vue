<template>
  <PageWrapper class="pageClass" contentClass="pageContnet" title="API 接口列表及测试">
    <div class="constentbox flex">
      <div class="w-2/3 bg-white  p-4">
        <div class="header_btn">
          <div class="search">
             <div class="search_item">
              <a-select
                    v-model:value="searchForm.cid"
                    show-search
                    allowClear
                    placeholder="选择分组"
                    style="width: 130px"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    @search="searchGroup"
                    @focus="getGroup"
                  >
                  <template v-if="fetching" #notFoundContent>
                    <a-spin size="small" />
                  </template>
                  <a-select-option v-for="item in grouplist"  :value="item['id']+''"><span v-html="item['name_txt']"></span></a-select-option>
                </a-select>
             </div>
             <div class="search_item">
              <a-input v-model:value="searchForm.keyword" placeholder="输入接口名称" allowClear/>
             </div>
             <div class="search_item">
                <a-button type="primary" style="margin-right: 3px;" @click="handelSearchApi">查找</a-button>
               <a-button @click="()=>{searchForm={keyword:'',cid:null}}">重置</a-button>
             </div>
          </div>
          <div class="group">
            <a-button type="primary" style="margin-right: 3px;" @click="addApitest">添加接口</a-button>
            <a-button @click="openCate" style="margin-right: 3px;">管理分组</a-button>
            <a-button @click="reflash" shape="circle" preIcon="mdi:sync" title="刷新"></a-button>
          </div>
        </div>
        <hr class="my-2" />
        <div class="Tablebox">
          <!--表单-->
          <BasicTable @register="registerTable" @rowClick="rowclickTable">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'"  >
                  <div v-html="record.name_txt"></div>
                </template>
                <template v-if="column.key === 'status'"  >
                  <span :style="{color:record.status==0?'blue':'red'}">{{record.status==0?"正常":"失效"}}</span>
                </template>
                <template v-if="column.key === 'action'"  >
                  <TableAction
                    :actions="[
                      {
                        icon: 'line-md:telegram',
                        onClick: handleSelect.bind(null, record),
                      },
                      {
                        icon: 'clarity:note-edit-line',
                        onClick: handleEdit.bind(null, record),
                      },
                      {
                        icon: 'ant-design:delete-outlined',
                        color: 'error',
                        popConfirm: {
                          title: '是否确认删除',
                          placement: 'left',
                          confirm: handleDelete.bind(null, record),
                        },
                      },
                    ]"
                  />
                </template>
              </template>
            </BasicTable>
        </div>
      </div>
      <div class="w-1/3 bg-white ml-4 p-4">
        <div class="flex items-center">
          <span class="text-lg font-medium mr-4">接口名称: </span>
          <span>{{requestData.title}}</span>
        </div>
        <hr class="my-3" />

        <div class="flex">
          <a-input v-model:value="requestData.url" disabled >
            <template #addonBefore> 
              <a-select v-model:value="requestData.method">
                <a-select-option value="get">GET</a-select-option>
                <a-select-option value="post">POST</a-select-option>
                <a-select-option value="delete">DELETE</a-select-option>
              </a-select>
            </template>
          </a-input>
          <a-button :type="isRequest ? 'danger' : 'primary'" @click="handelRequest">
            {{ requestAfter.step!='none' ? '重新测试' : '开始测试' }}
          </a-button>
        </div>
        <div class="parambox mt-2">
          <CodeEditor v-model:value="requestData.param"  :mode="modeValue" />
        </div>
        <div class="tagbtn mt-2">
          <Tag @click="copyURL(requestData.url)" class="tags">复制地址</Tag>
          <Tag @click="showDes(requestData.title,requestData.des)" class="tags" color="blue">查看备注</Tag>
          <Tag @click="showField(requestData.tablename)" class="tags" color="green">查看字段说明</Tag>
        </div>
        <div class="text-lg font-medium mt-2 mb-2">请求结果</div>
        <hr class="my-2" />
        <div class="flex items-center mb-2">
          <span class=" mr-4"> 请求状态: </span>
          <Tag :color="getTagColor">
            <template #icon v-if="requestAfter.laoding=='processing'">
              <sync-outlined :spin="true" />
            </template>
            {{ requestAfter.laoding }}
          </Tag>
        </div>
        <div class="flex items-center mb-2">
          <span class=" mr-4"> 请求结果: </span>
          <span class=" mr-4" :style="{color:requestAfter.status==200?'#108ee9':'#f50'}"> {{requestAfter.status}} </span>
          <span class=" mr-4" :style="{color:requestAfter.status==200?'#108ee9':'#f50'}">提示({{requestAfter.code}})：{{requestAfter.message}} </span>
        </div>
        <!--返回结果-->
        <div class="JSONbox mt-2">
          <CodeEditor v-model:value="requestAfter.result" readonly :mode="modeValue" />
        </div>
      </div>
        <!--添加表单-->
        <FormModal @register="registerApitestModal" @success="handleSuccess" />
        <!--分组-->
        <groupModal @register="groupModals"  @upcateData="upCateData"/>
        <!--展示获取字段-->
        <fieldModal @register="fieldModals" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, computed, toRefs ,ref,nextTick, unref,h} from 'vue';
  import { Tag, Input,Select,Modal} from 'ant-design-vue';
  import {
  SyncOutlined,
} from '@ant-design/icons-vue';
  import { PageWrapper } from '/@/components/Page';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  //api
  import { getList,delData,getDBField} from '/@/api/system/apitest';
  import { getFormGroupList } from '/@/api/system/apitestgroup';
  import { columns } from './data';
  //组件
  import FormModal from './FormModal.vue';
  import groupModal from './groupModal.vue';
  import fieldModal from './fieldModal.vue';
  import { defHttp } from '/@/utils/http/axios';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { Icon } from '/@/components/Icon';
  import axios from 'axios';
  import md5 from 'md5'
  export default defineComponent({
    components: {
      PageWrapper,CodeEditor,BasicTable,TableAction,groupModal,FormModal,fieldModal,
      [Input.name]: Input,
      InputTextArea: Input.TextArea,SyncOutlined,
      Tag,Icon,
       ASelect:Select,ASelectOption:Select.Option 
    },
    setup() {
      const { createMessage } = useMessage();
      //JSON编辑器
      const modeValue = ref<MODE>(MODE.JSON);
      const pagedata = reactive({
        //分组
        grouplist:[],
        searchForm:{cid:null,keyword:""},
        status:"none",
        isRequest:false,
        fetching:true,
        //请求参数
        requestData:{id:0,title:"请选择请求接口",url:"",method:"get",param:'{"title":"示例参数"}',des:"",tablename:"",useFrom:"pc"},
        requestAfter:{step:"none",result:"",laoding:"waiting",status:200,message:"",code:0},
      });

      //请求状态
      const getTagColor = computed(() => {
        if(pagedata.requestAfter.laoding=="waiting"){
          return "default"
        }else if(pagedata.requestAfter.laoding=="processing"){
          return "processing"
        }else if(pagedata.requestAfter.laoding=="success"){
          return "success"
        }else if(pagedata.requestAfter.laoding=="error"){
          return "error"
        }
      });
      //1.表单
      const [registerApitestModal, { openModal:openApitest }] = useModal();
      //2.分组
      const [groupModals, { openModal: openCate }] = useModal();
      //3.字段
      const [fieldModals, { openModal: openField }] = useModal();
      //更新了分组
      function upCateData(){

      }
      //添加接口
      function addApitest(){
        openApitest(true, {
          isUpdate: false,
        });
      }
    //编辑
    function handleEdit(record: Recordable) {
      openApitest(true, {
          record,
          isUpdate: true,
        });
      }
    //选择使用
    function handleSelect(record: Recordable) {
      pagedata.requestAfter={step:"none",result:"",laoding:"waiting",status:200,message:"",code:0}
      pagedata.requestData={id:record.id,title:record.title,url:record.url,method:record.method,param:record.param,des:record.des,tablename:record.tablename,useFrom:record.useFrom}
    }
     //表格
     const searchInfo_arr=ref({})
      const [registerTable, { reload,updateTableDataRecord}] = useTable({
        api: getList,
        rowKey: 'id',
        columns,
        useSearchForm: false,
        showTableSetting: false,
        bordered: false,
        pagination: true,
        showIndexColumn: false,
        searchInfo:searchInfo_arr,
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          fixed: undefined,
        },
      });
      //表单提交回调
      function handleSuccess({ isUpdate, values }){
        if (isUpdate) {
           updateTableDataRecord(values.id, values);
        } else {
          reload();
        }
      }
      //删除
     async function handleDelete(record: Recordable) {
        const result =await delData({ids:[record.id]})
        if(result){
          reload();
        }
      }
      //刷新
      function reflash(){
        pagedata.requestAfter={step:"none",result:"",laoding:"waiting",status:200,message:"",code:0}
        reload();
      }
      //开启请求
      async function handelRequest(){
        if(!pagedata.requestData.url){
          createMessage.warning('请选择测试接口！');
          return;
        }
        pagedata.requestAfter.laoding="processing"
        if(pagedata.requestData.useFrom=="pc"){
          const gerresult =await  rreqhttp()
          if(gerresult){
            pagedata.requestAfter.result=gerresult.data.result
            pagedata.requestAfter.status=gerresult.status
            pagedata.requestAfter.message=gerresult.data.message
            pagedata.requestAfter.code=gerresult.data.code
            if(gerresult.data.code==0){
              pagedata.requestAfter.laoding="success"
            }else{
              pagedata.requestAfter.laoding="error"
            }
          }
        }else if(pagedata.requestData.useFrom=="phone"){
          const gerresults =await otherHttp()
          if(gerresults){
            pagedata.requestAfter.result=gerresults["data"].result
            pagedata.requestAfter.status=gerresults["status"]
            pagedata.requestAfter.message=gerresults["data"].message
            pagedata.requestAfter.code=gerresults["data"].code
            if(gerresults["data"].code==0){
              pagedata.requestAfter.laoding="success"
            }else{
              pagedata.requestAfter.laoding="error"
            }
          }
        }
       
      }
      //手机端接口
      function otherHttp(){
        var params={}
        if(pagedata.requestData.param){
          params=JSON.parse(pagedata.requestData.param)
        }
         //接口验证
        const { API_SECRET } = window["globalConfig"]; //从config读取的配置-打包后可以修改-变化
        const timestamp: number = Date.parse(new Date().toString())/1000;
        if(pagedata.requestData.method=="get"){
            return axios.get(pagedata.requestData.url, { params: params,headers: {'verify-time': timestamp,"verify-encrypt":md5(API_SECRET+timestamp)} });
          }else if(pagedata.requestData.method=="post"){
            return axios.post(pagedata.requestData.url, params,{headers: {'verify-time': timestamp,"verify-encrypt":md5(API_SECRET+timestamp)}});
          }else if(pagedata.requestData.method=="delete"){
            return axios.delete(pagedata.requestData.url,{ params: params,headers: {'verify-time': timestamp,"verify-encrypt":md5(API_SECRET+timestamp)} });
          }else{
            return false
          }
      }
      //pc端接口
       function rreqhttp(){
        var params={}
        if(pagedata.requestData.param){
          params=JSON.parse(pagedata.requestData.param)
        }
        if(pagedata.requestData.method=="get"){
            return defHttp.get({ url: pagedata.requestData.url, params:params}, { isReturnNativeResponse: true })
          }else if(pagedata.requestData.method=="post"){
            return defHttp.post({ url: pagedata.requestData.url, params:params}, { isReturnNativeResponse: true});
          }else if(pagedata.requestData.method=="delete"){
            return defHttp.delete({ url: pagedata.requestData.url, params:params}, { isReturnNativeResponse: true});
          }else{
            return false
          }
      }
      //获取分组数据
      function getGroup(){
        getGroupList("")
      }
      //搜索分组
      function searchGroup(val) {
          getGroupList(val)
      }
       //获取分组数据
       async function getGroupList(keyword){
           pagedata.fetching=true
          let treeData= await getFormGroupList({keyword:keyword})
          if(!treeData) treeData=[]
          pagedata.grouplist = treeData
          // pagedata.fetching=false
        }
        //查找
        function handelSearchApi(){
          searchInfo_arr.value=pagedata.searchForm
          nextTick(()=>{
            reload();
          })
        }
        //复制
        const { clipboardRef, copiedRef } = useCopyToClipboard();
        function copyURL(url){
          const value = unref(url);
            if (!value) {
              createMessage.warning('请输入要拷贝的内容！');
              return;
            }
            clipboardRef.value = value;
            if (unref(copiedRef)) {
              createMessage.success('复制成功！');
            }
        }
        //展示备注
        function showDes(title,des){
          if(des){
            const props = { style: { color: "red" ,whiteSpace: "pre-wrap"} };
            Modal.info({
            title: title+'-备注',
            content:  h("pre", props, des),
          });
          }else if(title){
            createMessage.warning('接口没有备注！');
          }else{
            createMessage.warning('请选择接口！');
          }
        }
        //展示字段
        async function showField(tablename){
          if(tablename){
            createMessage.loading({ content: '获取字段中...', key:"getDBField",duration:0});
            let fData= await getDBField({tablename:tablename})
            if(fData){
               openField(true, fData);
              createMessage.success({ content: '获取成功！', key:"getDBField", duration: 2 });
            }else{
              createMessage.warning({ content: '未获取数据', key:"getDBField", duration: 2 });
            }
          }else{
            createMessage.warning('请选择接口或未填写数据库!');
          }
        }
        //点击行
        function rowclickTable(record:Recordable){
          handleSelect(record)
        }
      return {
        formatToDateTime,reflash,rowclickTable,
        ...toRefs(pagedata),
        getTagColor,
        handelRequest,copyURL,showDes,showField,
        //分组
        searchGroup,getGroup,groupModals,upCateData,openCate,
        fieldModals,
        //JSON编辑器
        modeValue,
        //添加接口
        handelSearchApi,
        registerApitestModal,addApitest,registerTable,handleSuccess,handleDelete,handleEdit,handleSelect,

      };
    },
  });
</script>
<style lang="less" scoped>
.pageClass{
  height: 100%;
  :deep(.pageContnet){
    height: calc(100% - 120px);
  }
}
.constentbox{
  height: 100%;
  .header_btn{
    display: flex;
    .search{
      flex:1;
      display: flex;
      .search_item{
        padding-right: 5px;
      }
    }
  }
}
.parambox{
  border: #e5e7eb 1px solid;
  height: 90px;
}
.Tablebox{
  :deep(.ant-table-body){
    height: 600px !important;
  }
}
.JSONbox{
  border: #e5e7eb 1px solid;
  height: 420px;
}
.tagbtn{
  .tags{
    user-select: none;
    cursor:pointer;
  }
}
</style>
