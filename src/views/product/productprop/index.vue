<template>
  <div class="funcard bg-white">
    <div class="listbox">
      <!--表单-->
      <div class="tablebox" v-loading="loadingRef" loading-tip="加载中...">
        <table style="table-layout: fixed;">
            <thead>
              <tr>
                <th class="fistth">参数项名称</th>
                <th class="alcenter">说明</th>
                <th class="alcenter">启用</th>
                <th class="alcenter" style="width:60px;">排序</th>
                <th class="alcenter">操作</th>
              </tr>
            </thead>
            <tbody class="table-tbody">
              <template v-for="(item,index) in list">
                <tr>
                  <td class="table-cell">
                    <div class="editbox">
                      <div class="inputbox" v-if="item.edit">
                        <a-input v-model:value="item.name" placeholder="填写参数项名称" />
                      </div>
                      <div class="text" v-else>{{item.name}}</div>
                    </div>
                  </td>
                  <td class="table-cell alcenter">
                    <div class="editbox">
                      <div class="inputbox" v-if="item.edit&&item.type==0">
                        <a-input v-model:value="item.des" placeholder="填写参数说明" />
                      </div>
                      <div class="text destext" v-else>{{item.des}}</div>
                    </div>
                  </td>
                  <td class="table-cell alcenter">
                    <Switch v-model:checked="item.status" @change="handelUpPro(item)" checked-children="启用" :checkedValue="0" un-checked-children="禁用" :unCheckedValue="1" />
                  </td>
                  <td class="table-cell alcenter">
                     <div class="weigh">
                        <div class="l">
                          <Icon icon="mdi:arrow-down-bold" @click="handelUpWeigh(item.id,item.weigh,list[index+1].id,list[index+1].weigh)" size="18" color="#0960bd" v-if="index+1<list.length"></Icon>
                        </div>
                        <div class="r">
                          <Icon icon="mdi:arrow-up-bold" size="18" @click="handelUpWeigh(item.id,item.weigh,list[index-1].id,list[index-1].weigh)" color="#0960bd" v-if="index>0"></Icon>
                        </div>
                     </div>
                  </td>
                  <td class="table-cell alleft operat">
                      <a class="" v-if="item.edit==false" @click="()=>{item.edit=true}">编辑</a>
                      <a class="" v-if="item.edit==true" @click="handelSavePro(item)">保存</a>
                      <a v-if="item.type==0" @click="handelDelPro(item)">删除</a>
                      <a v-if="item.id>0&&(item.type !=1)" @click="manageProList(item.id,item.name)">管理值</a>
                  </td>
                </tr>
              </template>
            </tbody>
        </table>
        <div class="addbtn">
          <div class="inlinebtn">
            <a-button block class="mt-5" type="dashed" preIcon="line-md:plus" @click="handleAdd"> 新增参数 </a-button>
          </div>
        </div>
      </div>
    </div>
      <!--管理值-->
      <FormModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent ,reactive,toRefs,onMounted} from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import { Progress,Checkbox,Pagination,Switch} from 'ant-design-vue';
  //API
  import { getList,savePro,delPro,upPro,upWeigh} from '/@/api/product/pro';
  import {  ProItem } from './data';
  import { buildUUID} from '/@/utils/uuid';
  //数据值
  import FormModal from './FormModal.vue';
  export default defineComponent({
    name: 'productprop',
    components: { Icon,Progress,ACheckbox:Checkbox,Pagination,Switch,FormModal},
    emits: ['upcateData'],
    setup(_, { emit }) {
      const {createMessage,createConfirm} = useMessage();
      const [registerModal, { openModal }] = useModal();
      //定义页面变量
      const proitem: ProItem[] = [] // 定义整数型数组
      // const arrselectid: number[] = [] // 定义字符串数组
      const pagedata=reactive({
        list:proitem,
        loadingRef:true,
      })
      //组件加载完成执行
      onMounted(() => {
        getprolist()
      });
      //获取参数列表
      async function getprolist(){
        pagedata.loadingRef = true;
        const getdbdata = await getList({from:"pro"});
        if(getdbdata){
          pagedata.list=getdbdata
        }
        pagedata.loadingRef = false;
      }
      //删除参数
      function handelDelPro(item){
        if(item.id>0){
          createConfirm({
            iconType: "warning",
            title: '您确定删除吗？',
            content: '删除后将无法恢复！',
            onOk:(async()=>{
              createMessage.loading({ content: '删除中...', key:"delPro",duration:0});
              const resultdata = await delPro({ids:[item.id]});
              if(resultdata){
                emit('upcateData');
                pagedata.list=pagedata.list.filter((data)=>data.id!=item.id)
                createMessage.success({ content: '删除成功！', key:"delPro", duration: 2 });
              }else {
                createMessage.error({ content: '删除失败', key:"delPro", duration: 2 });
              }
            })
          });
        }else{
          pagedata.list=pagedata.list.filter((data)=>data.uuid!=item.uuid)
        }
      }
      //新增参数
      function handleAdd(){
        pagedata.list.push({
          id:0,
          type: 0,
          weigh: 0,
          status: 0,
          keyname: "",
          name: "",
          des: "",
          uuid:buildUUID(),
          edit: true,//是否编辑
        })
      }
      //保存数据
      async function handelSavePro(item){
        try {
            createMessage.loading({ content: '保存中...', key:"savePro",duration:0});
            const resultdata = await savePro(item);
            if(resultdata){
              item.edit=false
              item.id=resultdata
              item.weigh=resultdata
              emit('upcateData');
              createMessage.success({ content: '提交成功！', key:"savePro", duration: 2 });
            }
          } catch {
            createMessage.destroy("savePro");
          }
      }
      //更新状态
      async function handelUpPro(item){
          try {
            createMessage.loading({ content: '更新状态中...', key:"upPro",duration:0});
            const resultdata = await upPro({id:item.id,status:item.status});
            if(resultdata){
              emit('upcateData');
              createMessage.success({ content: '更新成功！', key:"upPro", duration: 2 });
            }else if(resultdata==0){
              createMessage.success({ content: '已更新！', key:"upPro", duration: 2 });
            }
          } catch {
            createMessage.destroy("upPro");
          }
      }
      //更新排序
      async function handelUpWeigh(id,weigh,rpId,rpweigh){
        try {
            createMessage.loading({ content: '更新排序中...', key:"upPro",duration:0});
            const resultdata = await upWeigh({id:id,weigh:weigh,rpId:rpId,rpweigh:rpweigh});
            if(resultdata){
              getprolist()
              createMessage.success({ content: '更新成功！', key:"upPro", duration: 2 });
            }else if(resultdata==0){
              createMessage.success({ content: '已更新！', key:"upPro", duration: 2 });
            }
          } catch {
            createMessage.destroy("upPro");
          }
      }
      //管理值
      function manageProList(id,title){
        openModal(true, {
          id: id,
          title: title,
        });
      }
      return {
        ...toRefs(pagedata),
        handleAdd,handelDelPro,handelSavePro,handelUpPro,handelUpWeigh,
        registerModal,manageProList,
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
        width: 720px;
        text-align: left;
        border-radius: 2px 2px 0 0;
        border-collapse: separate;
        border-spacing: 0;
        border-top: 1px solid #f0f0f0;
        tr>th {
            position: relative;
            color: #000000d9;
            font-weight: 500;
            text-align: left;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
            height: 50px;
        }
        .fistth{
          padding-left: 10px;
        }
        .alcenter{
          text-align: center;
        }
        .weigh{
          user-select: none;
          display: flex;
          .l{
            cursor: pointer;
            flex:1;
          }
          .r{
            cursor: pointer;
            flex:1;
          }
        }
        .operat{
          a{
            margin-right: 10px;
            user-select: none;
            cursor: pointer;
          }
        }
        tr:hover{
          background-color: #fafafa;
        }
      }
      table>thead>tr:first-child th:first-child {
          border-top-left-radius: 2px;
      }
    .table-tbody{
      .table-cell{
        .editbox{
          height: 35px;
          .inputbox{
            margin-top: 3px;
          }
          .text{
            margin-top: 3px;
            padding: 4px 11px;
          }
          .destext{
            color: #999;
          }
        }
      }
      .alleft{
        text-align: left;
        padding-left: 25px;
      }
    }
    //添加按钮
    .addbtn{
      width: 720px;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .inlinebtn{
        width: 100%;
        .mt-5{
        }
      }
    }
   }
  }
}
</style>
  