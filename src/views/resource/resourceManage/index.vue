<template>
  <div class="funcard bg-white">
    <!--基本信息-->
    <div class="baseinfo">
      <div class="raw">
        <div class="lf">
          <span>共{{allnumber}}个文件</span>
        </div>
        <div class="md">
          <div class="text">
           容量：
          </div>
          <div class="pree">
            <Progress
              :stroke-color="{
                 from: '#87d068',
                 to: '#ff4d4f',
              }"
              :percent="(allsize/fileSize).toFixed(5)"
            />
          </div>
        </div>
        <div class="rt">
          <span class="all">总量：{{filterSize(fileSize)}}</span>
          <span class="use">已用：{{filterSize(allsize)}}</span>
        </div>
      </div>
    </div>
    <div class="listbox">
      <!--表单-->
      <div class="tablebox">
         <div class="header">
           <div class="tool">
             <div class="check">
              <a-checkbox v-model:checked="checkedAll" :value="true" @change="isCheckAll"><span style="user-select: none;">本页全选</span></a-checkbox>
             </div>
             <div class="del">
                <a-button size="small" :disabled="selectIds.length==0" @click="delAll">删除</a-button>
             </div>
             <div class="updata">
                <a-button size="small" @click="UpVideo" style="margin-right: 5px;" preIcon="">上传视频</a-button>
                <a-button size="small" @click="UpImage" style="margin-right: 5px;">上传图片</a-button>
                <a-button size="small" @click="refreshData">刷新列表</a-button>
             </div>
           </div>
         </div>
         <div class="filecontext">
            <div class="filePreview">
              <div class="file_list_box">
                  <div class="file_item" v-for="item in picture" >
                    <div   >
                      <div class="imgbox" @click="onSelectImg(item)">
                        <!--图片-->
                        <div class="img_raw">
                          <div class="img_preview" v-if="item.type==0">
                            <img :src="ReplaceUrl(item.url)" class="img_item"/>
                          </div>
                          <div class="img_preview video_preview" v-if="item.type==2">
                            <img :src="ReplaceUrl(item.cover_url)" class="img_item"/>
                            <Icon class="folder_video" color="#ffffff" :animation="200"  icon="ic:twotone-slow-motion-video" :size="24" ></Icon>
                          </div>
                        </div>
                        <div class="edit_layer "  :class="{l_active:selectIds.indexOf(item.id)>-1}" >
                          <i class="colse" @click="onDel(item.id)"></i>
                          <i class="choose" ></i>
                        </div>
                      </div>
                      <div class="titlebox">
                         <div class="edit_title">
                          <a-input v-model:value="item.title" placeholder="输入名称" @change="onChangFile" @pressEnter="(e)=>{onUpFile(item.id,e.target.value)}" @blur="(e)=>{onUpFile(item.id,e.target.value)}" :bordered="false"/> 
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
         </div>
      </div>
      <!--分页-->
      <div class="pagination" v-if="total>=pageSize">
        <Pagination v-model:current="page" v-model:pageSize="pageSize" show-quick-jumper :total="total" @change="onChangePage" />
      </div>
      <!--附件管理器 -->
      <FileManage  @register="registerFileManage" @success="selectFile"></FileManage>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent ,reactive,toRefs,onMounted,ref} from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import { Progress,Checkbox,Pagination} from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { FileManage } from '/@/components/FileManage';
  //API
  import { getPicture,delFile,upFile} from '/@/api/resource/manage';
  import { ReplaceUrl } from '/@/utils/imgurl';
  import {  PictureItem} from './data';
  export default defineComponent({
    name: 'resourceCate',
    components: { Icon,Progress,ACheckbox:Checkbox,Pagination,FileManage},
    setup() {
      //上传附件
      const [registerFileManage, { openModal:  openFileManage }] = useModal();
      const {createMessage,createConfirm} = useMessage();
      //定义页面变量
      const pictureitem: PictureItem[] = [] // 定义整数型数组
      const arrselectid: number[] = [] // 定义字符串数组
      const pagedata=reactive({
        checkedAll:false,
        selectIds:arrselectid,//选择的图片id
        picture:pictureitem,//数据
        page:1,
        pageSize:15,
        total:0,
        allnumber:0,
        allsize:0,
        searchword:"",
        fileSize:0,
      })
      //组件加载完成执行
      onMounted(() => {
        getpicture("");
      });
      //获取我的图片
      async function getpicture(searchword:any){
            const getdbdata = await getPicture({searchword:searchword,page:pagedata.page});
              if(getdbdata){
                pagedata.picture=getdbdata.items
                pagedata.page=getdbdata.page
                pagedata.pageSize=getdbdata.pageSize
                pagedata.total=getdbdata.total
                pagedata.allnumber=getdbdata.allnumber
                pagedata.allsize=getdbdata.allsize
                pagedata.fileSize=(getdbdata.fileSize*(Math.pow(1024, 3)))
              }
        }
        //选择图片
        function onSelectImg(item){
          if(pagedata.selectIds.indexOf(item.id)>-1){
            pagedata.selectIds=pagedata.selectIds.filter((id)=>id!=item.id)
          }else{
            pagedata.selectIds.push(item.id)
          }
          if(pagedata.selectIds.length==pagedata.picture.length){
            pagedata.checkedAll=true
           }else{
            pagedata.checkedAll=false
           }
        }
        //是否全选
        function isCheckAll(e){
          if(e.target.checked){
            pagedata.picture.forEach((item)=>{
              pagedata.selectIds.push(item.id)
            })
            pagedata.checkedAll=true
          }else{
            pagedata.selectIds=[]
            pagedata.checkedAll=false
          }
        }
        //删除全部
        function delAll(){
          if(pagedata.selectIds.length>0){
            doDel(pagedata.selectIds)
          }
        }
        //删除单个
        function onDel(id){
          doDel([id])
        }
        //执行删除
        function doDel(ids){
          createConfirm({
            iconType: "warning",
            title: '您确定删除吗？',
            content: '删除后将无法恢复！',
            onOk:(async()=>{
              createMessage.loading({ content: '删除中...', key:"delFile",duration:0});
              const resultdata = await delFile({ids:ids});
              if(resultdata){
                ids.forEach((id)=>{
                  pagedata.picture=pagedata.picture.filter((item)=>id!=item.id)
                })
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
      //分页
      function onChangePage(page, pageSize){
        pagedata.page=page
        pagedata.pageSize=pageSize
        getpicture(pagedata.searchword)
      }
      /**
          * 文件大小 字节转换单位
          * @param size
          * @returns {string|*}
          */
        function filterSize(size) {
            if (!size) return '';
            if (size < pow1024(1)) return size + ' B';
            if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
            if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
            if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
            return (size / pow1024(4)).toFixed(2) + ' TB'
        }
      // 求次幂
      function pow1024(num) {
          return Math.pow(1024, num)
      }
      //上传视频
      function UpVideo(){
        openFileManage(true, {
          filetype:"video",
          getnumber: "one",
        });
      }
      //上传图片
      function UpImage(){
        openFileManage(true, {
          filetype:"image",
          getnumber: "one",
        });
      }
      //选择附件返回
      function selectFile(){

      }
      //刷新数据
      function refreshData(){
        getpicture("");
      }
      return {
        ...toRefs(pagedata),
        //附件
        UpVideo,UpImage,registerFileManage,selectFile,
        onSelectImg,ReplaceUrl,onDel,refreshData,
        onChangFile,onUpFile,delAll,isCheckAll,onChangePage,filterSize,
      };
    },
  });
</script>
<style lang="less" scoped>
.funcard{
  margin: 20px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  //基本信息
  .baseinfo{
    .raw{
      display: flex;
      align-items: center;
      .lf{
        padding: 10px;
      }
      .md{
        padding: 10px;
        display: flex;
        .text{

        }
        .pree{
          width:200px;
        }
      }
      .rt{
        padding: 10px;
        flex:1;
        padding-left: 50px;
        .use{
           padding-left: 10px;
        }
      }
    }
  }
  //内容
  .listbox{
    .tablebox{
      margin: 0px 10px 10px 10px;
      border:#557ce1 solid 1px;
      border-radius: 2px;
      .header{
        padding: 10px 0px 10px 10px;
        border-bottom:#557ce1 solid 1px;
        .tool{
          display: flex;
          align-items: center;
          .check{
            
          }
          .del{
            padding-right: 15px;
          }
          .updata{

          }
        }
      }
      .filecontext{
        padding: 10px 10px 20px 10px;
        //图片预览
        .filePreview{
          .file_list_box{
            padding: 0;
            margin: 0;
            overflow: hidden;
            .file_item{
              float: left;
              width: 100px;
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
                  height: 100px;
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
                   .video_preview{
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
    }
    .pagination{
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
  