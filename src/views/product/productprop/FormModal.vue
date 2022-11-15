<template>
  <BasicModal :showCancelBtn="false" v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="620px">
    <div class="listbox">
      <!--表单-->
      <div class="tablebox" v-loading="loadingRef" loading-tip="加载中...">
        <table style="table-layout: fixed;">
            <thead>
              <tr>
                <th class="fistth">参数值</th>
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
                        <a-input v-model:value="item.value" placeholder="填写参数值" @pressEnter="handelSavePro(item)"/>
                      </div>
                      <div class="text" v-else>{{item.value}}</div>
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
                      <a   @click="handelDelPro(item)">删除</a>
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
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,reactive,toRefs, nextTick} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ProlistItem } from './data';
  import { buildUUID} from '/@/utils/uuid';
  import {Switch} from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  //API
  import { getProlist,saveProlist,delProlist,upProlist,upWeighlist} from '/@/api/product/prolist';
  export default defineComponent({
    name: 'FormModal',
    components: { BasicModal,Switch,Icon },
    emits: ['success', 'register'],
    setup() {
      const proitem: ProlistItem[] = [] // 定义整数型数组
      const pagedata=reactive({
        pro_id:0,
        list:proitem,
        loadingRef:true,
      })
      const {createMessage,createConfirm} = useMessage();
      const getTitle = ref('编辑参数值');
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        getTitle.value=`编辑“${data.title}”值`
        pagedata.pro_id=data.id
        nextTick(()=>{
          ongetProList()
        })
      });
      //获取参数值数据
      async function ongetProList(){
        pagedata.loadingRef = true
        pagedata.list = await getProlist({pro_id:pagedata.pro_id})
        pagedata.loadingRef = false;
      }
      //关闭
      async function handleSubmit() {
        closeModal();
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
              const resultdata = await delProlist({ids:[item.id]});
              if(resultdata){
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
          pro_id:pagedata.pro_id,
          weigh: 0,
          status: 0,
          value: "",
          uuid:buildUUID(),
          edit: true,//是否编辑
        })
      }
      //保存数据
      async function handelSavePro(item){
        try {
            createMessage.loading({ content: '保存中...', key:"savePro",duration:0});
            const resultdata = await saveProlist(item);
            if(resultdata){
              item.edit=false
              item.id=resultdata
              item.weigh=resultdata
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
            const resultdata = await upProlist({id:item.id,status:item.status});
            if(resultdata){
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
            const resultdata = await upWeighlist({id:id,weigh:weigh,rpId:rpId,rpweigh:rpweigh});
            if(resultdata){
              ongetProList()
              createMessage.success({ content: '更新成功！', key:"upPro", duration: 2 });
            }else if(resultdata==0){
              createMessage.success({ content: '已更新！', key:"upPro", duration: 2 });
            }
          } catch {
            createMessage.destroy("upPro");
          }
      }
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        ...toRefs(pagedata),
        handleAdd,handelDelPro,handelSavePro,handelUpPro,handelUpWeigh,
      };
    },
  });
</script>
<style lang="less" scoped>
.listbox{
  min-height: 520px;
    .tablebox{ 
      padding: 20px;
      table{
        width: 100%;
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
      width: 100%;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .inlinebtn{
        width: 100%;
      }
    }
   }
  }
</style>
