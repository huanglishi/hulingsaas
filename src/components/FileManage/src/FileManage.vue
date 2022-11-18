<template>
  <BasicModal v-bind="$attrs" @register="registerfmModal" :title="modaltitle" :des="modaldes" @ok="handleSubmit" width="950px" minHeight="540">
     <div class="addFormbox" style="min-height:540px">
      <div class="tabs-header">
        <div class="tabs-nav-wrap">
            <div class="tap_item" v-for="item in tapList" :class="{item_active:activeKey==item.id}" @click="onselectBar(item)">
                <div class="label">{{item.name}}</div>
            </div>
        </div>
        <div class="tabs-bar" :style="{top: `${(activeKey-1)*65}px`,height: `65px`}"></div>
      </div>
      <div class="tabs-content" style="min-height:540px">
        <div class="my_file" v-if="activeKey==1">
          <!--h:35-->
            <div class="header_toopl">
               <div class="btnlist">
                <Upload
                    :accept="upaccept"
                    :multiple="false"
                    :before-upload="beforeUpload"
                    :show-upload-list="false"
                  >
                <a-button preIcon="line-md:upload-outline" style="margin-right: 10px;">直接上传</a-button>
                </Upload>
                <a-button preIcon="ri:folder-add-line" @click="onAddFolder">新增文件夹</a-button>
               </div>
               <div class="search">
                <a-input v-model:value="searchword" placeholder="搜索文件名称" @pressEnter="onSearchMyfile" allowClear>
                    <template #suffix>
                      <search-outlined @click="onSearchMyfile" class="searchbtn"  />
                    </template>
                  </a-input>
               </div>
            </div>
            <!--目录菜单h: 22+12-->
            <div class="dirmun" v-if="dirmenu&&dirmenu.length>0">
              <span class="dirmun_item" v-for="item in dirmenu" @click="onDirmun(item)">
                <span class="dirmun_inner">{{item['title']}}</span> 
                <span class="dirmun_separator">&gt;</span>
              </span>
            </div>
            <div class="file_list" v-loading="loadingRef" loading-tip="加载中..." :style="{height:`${451+(dirmenu.length>0?0:34)}px`}">
              <el-scrollbar :height="`${451+(dirmenu.length>0?0:34)}px`"  v-if="myFileList&&myFileList.length>0">
                <div class="file_list_box">
                  <div class="file_item" v-for="iten in myFileList">
                    <div>
                      <div :class="{imgbox:iten.type==0||iten.type==2,folderbox:iten.type==1}" @click="onSelectImg(iten,1)">
                        <!--图片-->
                        <div class="img_raw" v-if="iten.type==0" >
                          <div class="img_preview">
                            <img :src="ReplaceUrl(iten.url)" class="img_item"/>
                          </div>
                        </div>
                        <!--视频-->
                        <div class="img_raw" v-else-if="iten.type==2" >
                          <div class="img_preview videobox">
                            <img :src="ReplaceUrl(iten.cover_url)" class="img_item"/>
                            <Icon class="folder_video" color="#ffffff" :animation="200"  icon="ion:videocam" :size="24" ></Icon>
                          </div>
                        </div>
                        <!--文件夹-->
                        <div class="folder_raw" v-else-if="iten.type==1" 
                          @dragover="allowDrop($event)"
                          @drop="drop($event,iten.id)"
                          @dragleave="dragleaves()"
                         >
                          <Icon class="folder_preview"  :forceFallback="true"  :animation="200"  icon="fluent-emoji-flat:file-folder" :size="84" ></Icon>
                        </div>
                        <div class="edit_layer " :class="{l_active:selectList.indexOf(`my_${iten.id}`)>-1}" :draggable="iten.type==0||iten.type==2" @dragstart="drag($event,iten.id)">
                          <i class="colse" @click="onDel($event,iten.id)"></i>
                          <i class="choose" ></i>
                        </div>
                      </div>
                      <div class="titlebox">
                         <div class="edit_title">
                          <a-input v-model:value="iten.title" placeholder="输入名称" @change="onChangFile" @pressEnter="(e)=>{onUpFile(iten.id,e.target.value)}" @blur="(e)=>{onUpFile(iten.id,e.target.value)}" :bordered="false"/> 
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
               <!--空-->
              <div class="emptylist" v-if="!loadingRef&&(!myFileList||myFileList.length==0)" :style="{height:`${451+(dirmenu.length>0?0:34)}px`}">
                  <div class="emptybox">
                    <a-empty   description="没有文件，赶紧上传文件吧！"/>
                  </div>
              </div>
            </div>
        </div>
        <div class="file_Library"  v-if="activeKey==2">
            <div class="header_toopl">
               <div class="btnlist">
                  <RadioGroup v-model:value="typeid" button-style="solid" @change="changeMeterType">
                    <a-radio-button :value="0">素材图</a-radio-button>
                    <a-radio-button :value="1"> 插图 </a-radio-button>
                  </RadioGroup>
               </div>
               <div class="search">
                <a-input v-model:value="searchword" placeholder="搜索素材名称"  @pressEnter="onSearchMatter" allowClear>
                    <template #suffix>
                      <search-outlined class="searchbtn"  @click="onSearchMatter"/>
                    </template>
                  </a-input>
               </div>
            </div>
            <!--分类-->
            <div class="catelist" v-if="typeid==0">
              <el-scrollbar height="50px">
                <ul class="cateul">
                  <template v-for="item in picturecate">
                    <li class="cate_item " v-if="item.type==0||item.type==2" :class="{select:item.id==cid}" @click="selectCate(item.id)">{{item.name}}</li>
                  </template>
                </ul>
            </el-scrollbar>
            </div>
            <div class="catelist" v-if="typeid==1">
              <el-scrollbar height="50px">
                <ul class="cateul">
                  <template v-for="item in picturecate">
                    <li class="cate_item " v-if="item.type==1||item.type==2" :class="{select:item.id==cid}" @click="selectCate(item.id)">{{item.name}}</li>
                  </template>
                </ul>
            </el-scrollbar>
            </div>
            <!--图片库-->
            <div class="file_list"  v-loading="loadingRef" loading-tip="加载中...">
              <el-scrollbar height="435px" v-if="picture&&picture.length>0">
                <div class="file_list_box">
                  <div class="file_item" v-for="item in picture" >
                    <div   >
                      <div class="imgbox" @click="onSelectImg(item,2)">
                        <!--图片-->
                        <div class="img_raw">
                          <div class="img_preview">
                            <img :src="ReplaceUrl(item.url)" class="img_item"/>
                          </div>
                        </div>
                        <div class="edit_layer "  :class="{l_active:selectList.indexOf(`mt_${item.id}`)>-1}" >
                          <i class="choose" ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mypagination" v-if="pagetotall&&pagetotall>14">
                  <a-pagination v-model:current="pagenum" :total="pagetotall" show-less-items @change="changePage"/>
                </div>
              </el-scrollbar>
                <!--空-->
                <div class="emptylist" v-if="!loadingRef&&(!picture||picture.length==0)" :style="{height:`435px`}">
                    <div class="emptybox">
                      <a-empty   description="暂时没有该类素材，去看看其他类型吧！"/>
                    </div>
                </div>
            </div>
        </div>
      </div>
     </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent,reactive,toRefs,ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  //API
  import { saveFile ,uploadFile,getFiles,delFile,upFile,upImgPid,getCateList,getPicture} from '/@/api/file/manage';
  import { FileItem,CateItem ,PictureItem} from './data';
  //组件
  import { RadioGroup,Radio,Select,Upload,Empty,Pagination} from 'ant-design-vue';
  import {
    SearchOutlined,
  } from '@ant-design/icons-vue';
  import { Icon } from '/@/components/Icon/index';
  import { ReplaceUrl } from '/@/utils/imgurl';
  // 局部引入element UI
  import { ElScrollbar } from 'element-plus'
  export default defineComponent({
    name: 'DeptModal',
    components: { 
      BasicModal,
      SearchOutlined,Icon,
      // BasicForm,
       RadioGroup,ASelect:Select,ARadioButton:Radio.Button,
      Upload,AEmpty:Empty,APagination:Pagination,
      ElScrollbar,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const loadingRef = ref(false);//加载动画
      const {createMessage,createConfirm} = useMessage();
      const arraynct: string[] = [] // 定义字符串数组
      const file_item: FileItem[] = [] // 定义整数型数组
      const catitem: CateItem[] = [] // 定义整数型数组
      const pictureitem: PictureItem[] = [] // 定义整数型数组
      const pagedata=reactive({
        activeKey:1,
        myFileList:file_item,//我的文件
        searchword:"",
        typeid:0,//素材图/插图
        pid:0,//当前层级id 0=父级
        upLoading:false,//上传文件
        upaccept:"image/*",
        selectdata:{getnumber:"one",exdata:"",filetype:"image" },//选返回值
        selectList:arraynct,//选择
        dirmenu:[],//我的文件目录菜单
        //图库
        picturecate:catitem,
        picture:pictureitem,
        cid:0,
        //分页
        pagenum:1,
        pagetotall:0,
        //允许上传文件大小
        fileMaxSize:1,//1M
        //窗口
        modaltitle:"选择图片",
        modaldes:"(只能添加jpg,jpeg,bmp,png,gif, 大小不超过1MB。)",//备注
        tapList:[
          {id:1,name:"我的文件"},
          {id:2,name:"图片库"},
        ],
      })
      const {
        MaxSizeImage,MaxSizeVideo
      } = window["globalConfig"];
      //打开弹框
      const [registerfmModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        // console.log("打开附件选择：",data)
        pagedata.selectList=[]
        pagedata.pid=0
        pagedata.selectdata.getnumber=data?.getnumber|| "one"//获取多张还是单张-默认单张
        pagedata.selectdata.filetype=data?.filetype|| "image" //获取附件类型-默认图片
        pagedata.selectdata.exdata=data
        //允许上传大小
        if(pagedata.selectdata.filetype=="video"){
          pagedata.fileMaxSize=MaxSizeVideo
          pagedata.modaltitle="选择视频"
          pagedata.upaccept="video/*"
          pagedata.modaldes=`(只能添加mp4, 大小不超过${MaxSizeVideo}MB。)`
          pagedata. tapList=[
            {id:1,name:"我的文件"},
          ]
        }else{
          pagedata.fileMaxSize=MaxSizeImage
          pagedata.modaltitle="选择图片"
          pagedata.upaccept="image/*"
          pagedata.modaldes=`(只能添加jpg,jpeg,bmp,png,gif, 大小不超过${MaxSizeImage}MB。)`
          pagedata. tapList=[
            {id:1,name:"我的文件"},
            {id:2,name:"图片库"},
          ]
        }
         getMyfile("")
      });
   
      /***********************函数*********************************************************************** */
      //搜索我的文件
      function onSearchMyfile(){
        if(pagedata.searchword){
          getMyfile(pagedata.searchword)
        }else{
          getMyfile("")
        }
      }
      //获取-我的文件
      async function getMyfile(searchword:any) {
        loadingRef.value = true;
        const getdbdata = await getFiles({searchword:searchword,pid:pagedata.pid,filetype:pagedata.selectdata.filetype});
        if(getdbdata){
          pagedata.myFileList=getdbdata.items
          if(getdbdata.dirmenu.length>0){
            let parntList : any=[{id: 0,title: "默认文件夹",pid: 0}];
            pagedata.dirmenu = parntList.concat(getdbdata.dirmenu)
          }else{
            pagedata.dirmenu=[]
          }
        }
        nextTick(()=>{
          loadingRef.value = false;
         })
      }
      //添加文件夹
      function onAddFolder(){
         onSaveData({
            title:"新建文件夹",
            type:1,
            pid:pagedata.pid,
         })
      }
      //上传附件
      async function beforeUpload(file) {
          // 设置最大值，则判断
          if (pagedata.fileMaxSize && file.size / 1024 / 1024 >= pagedata.fileMaxSize) {
            createMessage.error(`上传文件大小不能超出${pagedata.fileMaxSize}M`);
            return false;
          }
          createMessage.loading({ content: '上传中...', key:"uploadFile",duration:0});
          //开始手动上传
          const filename=file?.name||""
          pagedata.upLoading=true
          const upres= await uploadFile({ name: 'file', file: file, filename,data:{pid:pagedata.pid,filetype:pagedata.selectdata.filetype}}, (progressEvent) => {
                // 原生获取上传进度的事件
                if (progressEvent.lengthComputable) {
                  createMessage.loading({ content: '开始上传...', key:"uploadFile",duration:0});
                }
            })
          if(upres.status==200&&upres.data){
            if(upres.data.code==0){
              if(upres.data.message=="文件已上传"){
                pagedata.myFileList=pagedata.myFileList.filter((item)=>upres.data.result.id!=item.id)
              }
              pagedata.myFileList.push(upres.data.result)
            }
            createMessage.success({ content: '上传成功！', key:"uploadFile", duration: 2 });
            pagedata.upLoading=false
            //更新数据
          }else{
            createMessage.destroy("saveData");
          }
          return false;
        }
      //保存数据
      async function onSaveData(data:object) {
        try {
            createMessage.loading({ content: '提交中...', key:"saveData",duration:0});
            const resultdata = await saveFile(data);
            if(resultdata){
              pagedata.myFileList.push(resultdata)
              createMessage.success({ content: '提交成功！', key:"saveData", duration: 2 });
            }else if(resultdata==0){
              createMessage.success({ content: '已提交！', key:"saveData", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveData");
          }
      }
      //选择文件
      function onSelectImg(item,from){
        if((from==1&&item.type==0)||from==2){//是图片//或图片库
          var id_str=`my_${item.id}`
          if(from==2){
            id_str=`mt_${item.id}`
          }
          if(pagedata.selectList.indexOf(id_str)>-1){
            pagedata.selectList=pagedata.selectList.filter((id)=>id!=id_str)
          }else{
            if(pagedata.selectdata.getnumber=="one"){
              pagedata.selectList=[id_str]
            }else{
              pagedata.selectList.push(id_str)
            }
          }
        }else if(from==1&&item.type==2){
          var id_str=`my_${item.id}`
          if(pagedata.selectList.indexOf(id_str)>-1){
            pagedata.selectList=pagedata.selectList.filter((id)=>id!=id_str)
          }else{
            if(pagedata.selectdata.getnumber=="one"){
              pagedata.selectList=[id_str]
            }else{
              pagedata.selectList.push(id_str)
            }
          }
        }else if(item.type==1){//是文件夹
          pagedata.pid=item.id
          pagedata.searchword=""
          getMyfile("")
        }
      }
      //删除附件
       function onDel(event,id){
         //阻止事件冒泡到父元素
         event.stopPropagation();
        createConfirm({
          iconType: "warning",
          title: '您确定删除吗？',
          content: '删除后将无法恢复！',
          onOk:(async()=>{
            createMessage.loading({ content: '删除中...', key:"delFile",duration:0});
            const resultdata = await delFile({ids:[id]});
            if(resultdata){
              pagedata.myFileList=pagedata.myFileList.filter((item)=>id!=item.id)
              createMessage.success({ content: '删除成功！', key:"delFile", duration: 2 });
            }else {
              createMessage.error({ content: '删除失败', key:"delFile", duration: 2 });
            }
          })
        });
      }
      //是否修改文件名称
      const ischangname=ref(false)
      function onChangFile(){
        ischangname.value=true
      }
      //更新附件名称
      async function onUpFile(id,title){
        if(ischangname.value){
          ischangname.value=false
          createMessage.loading({ content: '更新中...', key:"upFile",duration:0});
          const resultdata = await upFile({id:id,title:title});
          if(resultdata){
            createMessage.success({ content: '更新成功！', key:"upFile", duration: 2 });
          }else if(resultdata==0){
            createMessage.destroy()
          } else{
            createMessage.error({ content: '更新失败', key:"upFile", duration: 2 });
          }
        }
      }
      //拖拽
      /**
       * 1当将元素或文本选择拖动到有效放置目标（每几百毫秒）上时，会触发此事件
       *
       * @param {Object} event event对象
       */
       const allowDrop = (event) => {
        //阻止浏览器的默认事件
        event.preventDefault()

       }
          /**
       * 2当在有效放置目标上放置元素或选择文本时触发此事件
       *
       * @param {Object} event event对象
       */
      const drop = (event,pid) => {
        const imgid=event.dataTransfer.getData('imgid')
        //处理移动
        onUpImgPid(imgid,pid)
      }
        /**
       * 3 当拖动的元素或文本选择离开有效的放置目标时，会触发此事件
       *
       * @param {Object} event event对象
       */
       const dragleaves = () => {
        // console.log("拖拽事件dragleaves：")
        /* 删除提示组件 */
      }
      //4.移动前
      function drag(event,id){
        event.dataTransfer.setData('imgid', id)
      }
      //提交文件目录移动
      async function onUpImgPid(imgid,pid) {
         createMessage.loading({ content: '移动中...', key:"upImgPid",duration:0});
          const resultdata = await upImgPid({imgid:imgid,pid:pid});
          if(resultdata){
            pagedata.myFileList=pagedata.myFileList.filter((item)=>imgid!=item.id)
            createMessage.success({ content: '移动成功！', key:"upImgPid", duration: 2 });
          }else if(resultdata==0){
            createMessage.destroy()
          } else{
            createMessage.error({ content: '移动失败', key:"upImgPid", duration: 2 });
          }
      }
      //点击目录菜单
      function onDirmun(item){
        if(pagedata.pid!=item.id){
          pagedata.pid=item.id
          pagedata.searchword=""
          getMyfile("")
        }
      }
      //切换分类
      async function onselectBar(item) {
        pagedata.activeKey=item.id
        pagedata.searchword=''
        if(item.id==2){//图库
          const getdbdata = await getCateList({});
          if(getdbdata){
            pagedata.picturecate=getdbdata
            pagedata.cid=getdbdata[0].id
            getpicture("")
          }
        }
      }
      //选择分类
      function selectCate(id){
        pagedata.cid=id
        getpicture("")
      }
      //获取我的图片
      async function getpicture(searchword:any){
        loadingRef.value = true;
        const getdbdata = await getPicture({searchword:searchword,type:pagedata.typeid,cid:pagedata.cid,page:pagedata.pagenum});
          if(getdbdata){
            pagedata.picture=getdbdata.items
            pagedata.pagenum=getdbdata.page
            pagedata.pagetotall=getdbdata.total
          }
         nextTick(()=>{
          loadingRef.value = false;
         })
      }
      //分页
      function changePage(page){
        pagedata.pagenum=page
        getpicture("")
      }
      //更新图片类型
      function changeMeterType(){
        pagedata.searchword=""
        var n_cid=0
        if(pagedata.typeid==0){
          const mcate=pagedata.picturecate.filter((item)=>item.type==0||item.type==2)
          n_cid=mcate[0].id
        }else{
          const mcate=pagedata.picturecate.filter((item)=>item.type==1||item.type==2)
          n_cid=mcate[0].id
        }
        pagedata.cid=n_cid
        getpicture("")
      }
      //图库搜索
      function onSearchMatter(){
        if(pagedata.searchword){
          getpicture(pagedata.searchword)
        }else{
          getpicture("")
        }
      }
      //最后选择图片
      interface VideoItem {
        url: string;
        cover_url: string;
      }
      function handleSubmit() {
          try {
            if(pagedata.selectList&&pagedata.selectList.length>0){
              const img_list: string[] = [] // 定义字符串数组
              const video_list: VideoItem[] = [] // 定义字符串数组
              pagedata.selectList.forEach((item)=>{
                const id_arr=item.split("_")
                if(pagedata.selectdata.filetype=="image"){
                  if(id_arr[0]=="my"){//去我的附件找
                    const myfile= pagedata.myFileList.find((data)=>data.id==parseInt(id_arr[1]))
                    if(myfile){
                      img_list.push(myfile.url)
                    }
                  }else if(id_arr[0]=="mt"){//去图库找
                    const pic= pagedata.picture.find((data)=>data.id==parseInt(id_arr[1]))
                  if(pic){
                    img_list.push(pic.url)
                  }
                  }
                }else{
                    const myfile= pagedata.myFileList.find((data)=>data.id==parseInt(id_arr[1]))
                    if(myfile){
                      video_list.push({"url":myfile.url,"cover_url":myfile.cover_url})
                    }
                }
              })
              if(pagedata.selectdata.filetype=="image"){
                if(pagedata.selectdata.getnumber=="one"){
                  emit('success', {type:pagedata.selectdata.getnumber,url:img_list[0],list:[],data:pagedata.selectdata.exdata});
                }else{
                  emit('success', {type:pagedata.selectdata.getnumber,url:"",list:img_list,data:pagedata.selectdata.exdata});
                }
              }else{//视频
                if(pagedata.selectdata.getnumber=="one"){
                  emit('success', {type:pagedata.selectdata.getnumber,...video_list[0],list:[],data:pagedata.selectdata.exdata});
                }else{
                  emit('success', {type:pagedata.selectdata.getnumber,url:"",cover_url:"",list:video_list,data:pagedata.selectdata.exdata});
                }
              }
              closeModal()
            }else{
              createMessage.error(pagedata.selectdata.filetype=="image"?"请选择图片":"请选择视频");
            }
          } finally {
            setModalProps({ confirmLoading: false });
          }
        }
      return { 
        ...toRefs(pagedata),
        onselectBar,
        registerfmModal,closeModal,
        ReplaceUrl,handleSubmit,onChangFile,
        onAddFolder,beforeUpload,onSelectImg,onDel,onUpFile,
        //拖拽
        allowDrop,drop,dragleaves,drag,
        onDirmun,onSearchMyfile,
        //图片库
        selectCate,changePage,changeMeterType,onSearchMatter,loadingRef,
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
      height: 100%;
      padding: 20px 30px 0px 25px;
      //我的附件
      .my_file{
        padding: 0px;
        margin: 0px;
        .header_toopl{
          height: 35px;
          display: flex;
          .btnlist{
            flex:1;
          }
          .seach{

          }
        }
        //我的-目录
        .dirmun{
          height: 22px;
          line-height: 22px;
          overflow: hidden;
          margin: 6px 0px;
          .dirmun_item{
            display: inline-flex;
            align-items: center;
            &:last-child .dirmun_inner {
                color: rgba(0,0,0,.38);
                cursor: default;
            }
            &:last-child .dirmun_separator {
                display: none;
            }
            .dirmun_inner{
              color: #557ce1;
              cursor: pointer;
              font-size: 13px;
            }
            .dirmun_separator{
              padding: 0 4px;
              font-size: 14px;
              color: rgba(0,0,0,.38);
            }
          }
        }
        //我的文件列表
        .file_list{
          .file_list_box{
            padding: 0;
            margin: 0;
            overflow: hidden;
            .file_item{
              float: left;
              width: 84px;
              list-style: none;
              margin-top: 20px;
              margin-right: 24px;
              //图片
              .imgbox{
                cursor: pointer;
                position: relative;
                height: 100%;
                .img_raw{
                  position: relative;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 84px;
                  background-color: #f3f3f3;
                  .img_preview{
                    box-sizing: border-box;
                    border: 1px solid #e7e7eb;
                    text-align: center;
                    font-size: 0;
                    line-height: 0;
                    width: 100%;
                    .img_item{
                      display: inline-block;
                      width: auto;
                      height: auto;
                      max-width: 100%;
                      max-height: 100%;
                      vertical-align: middle;
                    }
                  }
                      //视频
                    .videobox{
                      position: relative;
                      .folder_video{
                        position: absolute;
                        top: 15px;
                        left: 28px;
                      }
                    }
                }
                .edit_layer{
                  display: none;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  border: 1px solid #5874d8;
                  left: 0;
                  top: 0;
                  box-sizing: border-box;
                  .colse{
                    width: 14px;
                    height: 14px;
                    position: absolute;
                    right: -5px;
                    top: -5px;
                    background: url(../../../assets/images/component.png) no-repeat -435px 0;
                    cursor: pointer;
                  }
                  .choose{
                    display: none;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    content: "";
                    width: 28px;
                    height: 24px;
                    background: url(../../../assets/images/component.png) no-repeat -135px -28px;
                  }
                }
                //选中
                .l_active{
                  display: block;
                  .colse{
                    display: none;
                  }
                  .choose{
                      display: block;
                    }
                }
                  //浮框
                &:hover{
                    .edit_layer{
                      display: block;
                      .colse{
                          display: block;
                      }
                    }
                  }
              }
              //文件夹
              .folderbox{
                cursor: pointer;
                position: relative;
                height: 100%;
                //文件夹
                .folder_raw{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 84px;
                    cursor: pointer;
                    .folder_preview{

                    }
                }
                .edit_layer{
                  display: none;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  left: 0;
                  top: 0;
                  box-sizing: border-box;
                  .colse{
                    width: 14px;
                    height: 14px;
                    position: absolute;
                    top: 13px;
                    right: -2px;
                    background: url(../../../assets/images/component.png) no-repeat -435px 0;
                    cursor: pointer;
                  }
                }
                //选中
                .l_active{
                  display: block;
                  .colse{
                    display: none;
                  }
                  .choose{
                      display: block;
                    }
                }
                  //浮框
                &:hover{
                    .edit_layer{
                      display: block;
                      .colse{
                          display: block;
                      }
                    }
                  }
              }
              //名称
              .titlebox{
                height: 24px;
                margin-top: 5px;
                font-size: 13px;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                .edit_title{
                  display: inline-block;
                  position: relative;
                  vertical-align: middle;
                  pointer-events: auto;
                  &:hover{
                    border: 1px solid #5874d8;
                  }
                  :deep(.ant-input){
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    border-color: #fff;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
      }
      //图片库
      .file_Library{
        .header_toopl{
          height: 35px;
          display: flex;
          .btnlist{
            padding-right: 20px;
          }
          .seach{

          }
        }
        //分类
        .catelist{
          width: 730px;
          height: 50px;
          line-height: 50px;
          overflow: hidden;
          .cateul{
            padding: 0;
            margin: 0;
            transition: none 0s ease 0s;
            white-space: nowrap;
            .cate_item{
              // float: left;
              display: inline;
              margin-right: 28px;
              color: #343434;
              font-size: 12px;
              cursor: pointer;
              user-select: none;
              list-style: none;
              &.select,&:hover{
                  color: #557ce1;
              }
            }
          }
        }
        //文件列表
        .file_list{
          .file_list_box{
            padding: 0;
            margin: 0;
            overflow: hidden;
            .file_item{
              float: left;
              width: 116px;
              list-style: none;
              margin-top: 20px;
              margin-right: 34px;
              //图片
              .imgbox{
                cursor: pointer;
                position: relative;
                height: 100%;
                .img_raw{
                  position: relative;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 116px;
                  background-color: #f3f3f3;
                  .img_preview{
                    box-sizing: border-box;
                    border: 1px solid #e7e7eb;
                    text-align: center;
                    font-size: 0;
                    line-height: 0;
                    width: 100%;
                    .img_item{
                      display: inline-block;
                      width: auto;
                      height: auto;
                      max-width: 100%;
                      max-height: 100%;
                      vertical-align: middle;
                    }
                  }

                }
                .edit_layer{
                  display: none;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  border: 1px solid #5874d8;
                  left: 0;
                  top: 0;
                  box-sizing: border-box;
                  .choose{
                    display: none;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    content: "";
                    width: 28px;
                    height: 24px;
                    background: url(../../../assets/images/component.png) no-repeat -135px -28px;
                  }
                }
                //选中
                .l_active{
                  display: block;
                  .choose{
                      display: block;
                    }
                }
                  //浮框
                &:hover{
                    .edit_layer{
                      display: block;
                    }
                  }
              }
            }
          }
        }
        //分页
        .mypagination{
          text-align: center;
          margin-top: 15px;
          margin-bottom: 10px;
        }
      }
    }
  }
  //搜索
  .searchbtn{
    color: rgba(0, 0, 0, 0.45);
    cursor:pointer;
    &:hover{
      color: #557ce1;
    }
  }
  //空
  .emptylist{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
