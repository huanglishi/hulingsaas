<template>
  <div class="funcard bg-white">
    <!--基本信息-->
    <div class="baseinfo">
      <div class="raw">
      </div>
    </div>
    <div class="listbox">
      <!--表单-->
      <div class="tablebox">
        <table style="table-layout: fixed;">
            <thead>
              <tr>
                <th>参数项名称</th>
                <th>启用</th>
                <th>排序</th>
                <th>操作</th>
              </tr>
            </thead>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent ,reactive,toRefs,onMounted,ref} from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import { Progress,Checkbox,Pagination} from 'ant-design-vue';
  //API
  import { getPicture,delFile,upFile} from '/@/api/resource/manage';
  import { ReplaceUrl } from '/@/utils/imgurl';
  import {  PictureItem} from './data';
  export default defineComponent({
    name: 'productprop',
    components: { Icon,Progress,ACheckbox:Checkbox,Pagination},
    setup() {
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
      return {
        ...toRefs(pagedata),
        onSelectImg,ReplaceUrl,onDel,
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
      height: 50px;
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
      padding: 20px;
      table{
        width: 920px;
        text-align: left;
        border-radius: 2px 2px 0 0;
        border-collapse: separate;
        border-spacing: 0;
        tr>th {
            position: relative;
            color: #000000d9;
            font-weight: 500;
            text-align: left;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
        }
      }
      table>thead>tr:first-child th:first-child {
        border-top-left-radius: 2px;
    }
    }
  }
}
</style>
  