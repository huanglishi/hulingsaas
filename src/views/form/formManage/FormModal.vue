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
          <Form ref="formRef" :model="formData" >
          <div class="content_box">
              <!--基础信息-->
              <div class="besecontent" v-show="activeKey==1">
                  <FormItem label="表单名称" name="name" :rules="[{ required: true }]">
                    <a-input v-model:value="formData.name" placeholder="请输入表单名称" style="width: 410px;"/>
                  </FormItem>
                  <FormItem label="表单内容" name="formlist" >
                    <div class="toolbtn">
                        <div class="left"></div>
                        <div class="right">
                          <a-button @click="handelAddItem">添加表单项</a-button>
                          <a-button style="margin-left:20px;" @click="handelOpenRule" :title="formData.id==0?'请保存表单后再编辑规则':''" :disabled="formData.id==0">规则设置</a-button>
                        </div>
                    </div>
                  </FormItem>
                  <!--设置表单项-->
                  <div class="tableform">
                    <div class="tableraw">
                      <table style="table-layout: fixed;">
                          <thead>
                            <tr>
                              <th class="fistth">项名称</th>
                              <th class="alcenter">表单项内容</th>
                              <th class="alcenter" style="width:70px;">显示</th>
                              <th class="alcenter" style="width:70px;">必填</th>
                              <th class="alcenter" style="width:70px;">排序</th>
                              <th class="alcenter" style="width:85px;">操作</th>
                            </tr>
                          </thead>
                          <tbody class="table-tbody">
                            <template v-for="(item,index) in formData.formItem">
                              <tr>
                                <td class="table-cell">
                                  <div class="textname" >{{item.name}}</div>
                                </td>
                                <td class="table-cell alcenter">
                                  <div class="valuebox">
                                    <div class="inputbox" v-if="['input','date','mobile','IDcard','email'].indexOf(item.type)>-1">
                                       <a-input v-model:value="item.value" :placeholder="item.placeholder" disabled/>
                                    </div>
                                    <div class="inputbox" v-if="['textarea'].indexOf(item.type)>-1">
                                       <a-textarea v-model:value="item.value" :placeholder="item.placeholder" disabled/>
                                    </div>
                                    <div class="radiobox" v-else-if="['radio'].indexOf(item.type)>-1">
                                      <a-radio-group v-model:value="item.value">
                                          <a-radio v-for="optext in optionToArray(item.option)" :value="optext" >{{optext}}</a-radio>
                                        </a-radio-group>
                                    </div>
                                    <div class="checkbox" v-else-if="['checkbox'].indexOf(item.type)>-1">
                                      <CheckboxGroup v-model="item.value" >
                                         <Checkbox v-for="optext in optionToArray(item.option)" :value="optext">{{optext}}</Checkbox>
                                      </CheckboxGroup>
                                    </div>
                                    <div class="radiobox" v-else-if="['select'].indexOf(item.type)>-1">
                                      <a-select
                                        allowClear
                                        style="width: 100%"
                                        :placeholder="item.placeholder"
                                      >
                                        <a-select-option  v-for="optext in optionToArray(item.option)" :value="optext">{{optext}}</a-select-option>
                                       </a-select>
                                    </div>
                                    <div class="radiobox" v-else-if="['address'].indexOf(item.type)>-1">
                                      <a-select
                                        disabled
                                        style="width: 100%"
                                        placeholder="选择地址"
                                      >
                                       </a-select>
                                    </div>
                                    <div class="imgbox" v-else-if="['image'].indexOf(item.type)>-1">
                                      <div class="btn">
                                        <a-button>上传图片</a-button>
                                      </div>
                                      <div class="info">最大可上传{{item.number}}张</div>
                                    </div>
                                  </div>
                                </td>
                                <td class="table-cell alcenter">
                                  <Switch v-model:checked="item.status" @change="handelUpForm(item)" checked-children="是" :checkedValue="0" un-checked-children="否" :unCheckedValue="1" />
                                </td>
                                <td class="table-cell alcenter">
                                  <Switch v-model:checked="item.required" @change="handelUpRequired(item)" checked-children="是" :checkedValue="0" un-checked-children="否" :unCheckedValue="1" />
                                </td>
                                <td class="table-cell alcenter">
                                  <div class="weigh">
                                      <div class="l">
                                        <Icon icon="mdi:arrow-down-bold" @click="handelUpWeigh(item.id,item.weigh,formData.formItem[index+1].id,formData.formItem[index+1].weigh)" size="18" color="#0960bd" v-if="index+1<formData.formItem.length"></Icon>
                                      </div>
                                      <div class="r">
                                        <Icon icon="mdi:arrow-up-bold" size="18" @click="handelUpWeigh(item.id,item.weigh,formData.formItem[index-1].id,formData.formItem[index-1].weigh)" color="#0960bd" v-if="index>0"></Icon>
                                      </div>
                                  </div>
                                </td>
                                <td class="table-cell alleft operat">
                                   <div class="opbtn">
                                     <div class="op_left" @click="handelEditItem(index,item)">
                                      <Icon icon="clarity:note-edit-line" color="#0960bd" size="18"/>
                                     </div>
                                     <div class="op_midle"></div>
                                     <div class="op_right"  @click="handelDelItem(index,item)">
                                      <Icon icon="ant-design:delete-outlined" color="#ED6F6F" size="18"/>
                                     </div>
                                   </div>
                                </td>
                              </tr>
                            </template>
                            <tr v-if="!formData.formItem||formData.formItem.length==0">
                              <td colspan="6">
                                <div class="empty">
                                   暂无表单内容~
                                </div>
                              </td>
                            </tr>
                          </tbody>
                      </table>
                    </div>
                  </div>
              </div>
              <!--高级信息-->
              <div class="hcontent" v-show="activeKey==2">
                <FormItem label="按钮文字" name="button_text" :rules="[{ required: true }]">
                  <a-input v-model:value="formData.button_text" placeholder="请输入提交按钮文字" maxlength="50" style="width: 410px;" allow-clear/>
                </FormItem>
                <FormItem label="提交成功提示" name="success_tig" :rules="[{ required: true }]">
                  <a-input v-model:value="formData.success_tig" placeholder="请输入提交成功提示语" maxlength="150" style="width: 410px;" allow-clear/>
                </FormItem>
                <FormItem label="备注" name="des">
                  <a-textarea v-model:value="formData.des" placeholder="填写表单的备注" :rows="4" show-count :maxlength="255" allow-clear style="width: 410px;"/>
                </FormItem>
              </div>
          </div>
        </Form>
        </el-scrollbar>
      </div>
        <!--表单项-->
        <ItemModal @register="ItemModals"  @success="upItemData"/>
        <!--表单规则-->
        <RuleModal @register="RuleModals" />
     </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed,reactive, unref,toRefs } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import ItemModal from './ItemModal.vue';
  import RuleModal from './RuleModal.vue';
  import { useModal } from '/@/components/Modal';
  //API
  import { upWeigh ,getItemList ,upItem,upRequired,delItem} from '/@/api/form/item';
  import { saveForm } from '/@/api/form/manage';
  //组件
  import { Tabs,TabPane,Form,FormItem,Radio,DatePicker,Select,FormInstance,Switch,Checkbox} from 'ant-design-vue';
  import { ReplaceUrl } from '/@/utils/imgurl';
  import { Tinymce } from '/@/components/Tinymce/index';
  import {PlusOutlined,PhoneOutlined} from '@ant-design/icons-vue';
  import { FileManage } from '/@/components/FileManage';
  import { Form_item } from './data';
  // 局部引入element UI
   import { ElScrollbar } from 'element-plus'
  export default defineComponent({
    name: 'FormModal',
    components: { 
      BasicModal, Tinymce,PlusOutlined,PhoneOutlined,FileManage,Icon,ItemModal,RuleModal,
      // BasicForm,
      Tabs,TabPane,Form,FormItem,ARadio:Radio,ARadioGroup:Radio.Group,DatePicker,ASelect:Select,ASelectOption:Select.Option,Switch,
      ElScrollbar,Checkbox,CheckboxGroup:Checkbox.Group,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const formRef = ref<FormInstance>();
      const isUpdate = ref(true);
      //表单项
      const [ItemModals, { openModal: openItem }] = useModal();
      //编辑表单规则
      const [RuleModals, { openModal: openRule }] = useModal();
      //表单数据
      const form_item: Form_item[] = [] // 定义表单项自结构
      const pagedata=reactive({
        formData:{
            id:0,
            name:"",
            des:"",
            button_text:"提交",
            success_tig:"数据已提交成功",
            formItem:form_item
          },
        activeKey:1,
      })
      const {createMessage,createConfirm} = useMessage();
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await formRef.value?.resetFields()//重置表单
        pagedata.activeKey=1
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          //获取内容
          pagedata.formData.id=data.record.id
          pagedata.formData.name=data.record.name
          pagedata.formData.des=data.record.des
          //获取对用的表单项
          onGetFormItem()
        }else{
          pagedata.formData= {
              id:0,
              name:"",
              des:"",
              button_text:"提交",
              success_tig:"数据已提交成功",
              formItem:form_item
            }
          pagedata.formData.formItem=[]
        }
      });
      //获取表单项数据
      async function onGetFormItem(){
          const fdata = await getItemList({form_id: pagedata.formData.id});
          if(fdata){
            pagedata.formData.formItem=fdata
          }
      }
      const getTitle = computed(() => (!unref(isUpdate) ? '新增表单' : '编辑表单'));
      //提交表单数据
      async function handleSubmit() {
        try {
           if(await (formRef.value?.validate())){
            const values =pagedata.formData;
              setModalProps({ confirmLoading: true });
              try {
                createMessage.loading({ content: '提交中...', key:"saveForm",duration:0});
                const resultdata = await saveForm(values);
                closeModal();
                if(resultdata){
                  createMessage.success({ content: '提交成功！', key:"saveForm", duration: 2 });
                  emit('success', { isUpdate: unref(isUpdate), values: { ...values } });
                }else if(resultdata==0){
                  createMessage.success({ content: '已提交！', key:"saveForm", duration: 2 });
                }
              } catch {
                createMessage.destroy("saveForm");
              }
           }
        }  catch {
          createMessage.error({ content: '请填写必填项', key:"saveForm", duration: 2 })
          }finally {
          setModalProps({ confirmLoading: false });
        }
      }
      /***********************函数*********************************************************************** */
      //更新状态
      async function handelUpForm(item){
          try {
            createMessage.loading({ content: '更新状态中...', key:"upPro",duration:0});
            const resultdata = await upItem({id:item.id,status:item.status});
            if(resultdata){
              createMessage.success({ content: '更新成功！', key:"upPro", duration: 2 });
            }else if(resultdata==0){
              createMessage.success({ content: '已更新！', key:"upPro", duration: 2 });
            }
          } catch {
            createMessage.destroy("upPro");
          }
      }
      //更新必填
      async function handelUpRequired(item){
          try {
            createMessage.loading({ content: '更新必填状态中...', key:"upPro",duration:0});
            const resultdata = await upRequired({id:item.id,required:item.required});
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
            const resultdata = await upWeigh({id:id,weigh:weigh,rpId:rpId,rpweigh:rpweigh});
            if(resultdata){
              onGetFormItem()
              createMessage.success({ content: '更新成功！', key:"upPro", duration: 2 });
            }else if(resultdata==0){
              createMessage.success({ content: '已更新！', key:"upPro", duration: 2 });
            }
          } catch {
            createMessage.destroy("upPro");
          }
      }
      //添加规则
      function handelOpenRule(){
        openRule(true,{
          form_id: pagedata.formData.id
        })
      }
      //添加表单项
      function handelAddItem(){
        openItem(true,{
          isUpdate: false,
          record:{form_id: pagedata.formData.id}
        })
      }
      //编辑表单项
      function handelEditItem(index,record){
        openItem(true,{
          record,
          index:index,
          isUpdate: true,
        })
      }
      //删除表单项
      function handelDelItem(index,record){
         if(record.id==0){
          pagedata.formData.formItem.splice(index, 1); 
         }else{
              createConfirm({
                iconType: "warning",
                title: '您确定删除吗？',
                content: '删除后将无法恢复！',
                onOk:(async()=>{
                  createMessage.loading({ content: '删除中...', key:"delItem",duration:0});
                  const resultdata = await delItem({ids:[record.id]});
                  if(resultdata){
                    pagedata.formData.formItem=pagedata.formData.formItem.filter((data)=>data.id!=record.id)
                    createMessage.success({ content: '删除成功！', key:"delItem", duration: 2 });
                  }else {
                    createMessage.error({ content: '删除失败', key:"delItem", duration: 2 });
                  }
                })
              });
         }
      }
      //编辑表单项返回
      function upItemData(tiem){
        if(tiem.isUpdate){
          pagedata.formData.formItem[tiem.index]=tiem.values
        }else{
          pagedata.formData.formItem.push(tiem.values)
        }
      }
      //文本选项转数组
      function optionToArray(data){
        var snsArr =data.split(/[(\r\n)\r\n]+/);
        return snsArr
      }
      return { 
        ...toRefs(pagedata),
        getTitle, 
        tapList:[
          {id:1,name:"常规"},
          {id:2,name:"表单设置"},
        ],
        layout:{
          labelCol: { span: 4 },
          wrapperCol: { span: 20 },
        },
        registerModal,
        // registerForm, 
        handleSubmit,
        ReplaceUrl,
        //form
        formRef,
        //表单
        handelUpWeigh,handelUpForm,upWeigh,handelUpRequired,
        handelAddItem,upItemData,ItemModals,handelEditItem,handelDelItem,
        RuleModals,handelOpenRule,
        optionToArray,
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
  //表单内容
  .toolbtn{
    display: flex;
    margin-right:40px ;
    .left{
      flex: 1;
    }
    .right{

    }
  }
  //设置表单项
  .tableform{
    .tableraw{
      padding: 20px;
      table{
        width: 720px;
        text-align: left;
        border-radius: 2px 2px 0 0;
        border-collapse: separate;
        border-spacing: 0;
        border: 1px solid #f0f0f0;
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
        .empty{
          text-align: center;
          padding: 20px;
        }
        //操作
        .opbtn{
          display: flex;
          .op_left{
            flex:1;
            user-select: none;
            cursor: pointer;
          }
          .op_midle{
            position: relative;
            top: 4px;
            display: inline-block;
            height: 0.9em;
            vertical-align: middle;
            border-top: 0;
            border-left: 1px solid rgba(0, 0, 0, 0.06);
            display: table;
            box-sizing: border-box;
            padding: 0;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5715;
            list-style: none;
            margin: 0 8px;
          }
          .op_right{
            flex:1;
            user-select: none;
            cursor: pointer;
          }
        }
      }
      table>thead>tr:first-child th:first-child {
          border-top-left-radius: 2px;
      }
      table>thead>tr>th{
        border-right: 1px solid #e3e2e8;
      }
      table>tbody>tr>td{
        padding: 10px;
      }
      table>thead>tr>th:last-child{
        border-right: 0px solid #e3e2e8;
      }
    .table-tbody{
      .table-cell{
        .checkbox{
          text-align: left;
        }
        .textname{
          padding-left: 10px;
        }
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
      .radiobox{
        text-align: left;
      }
      .imgbox{
        display: flex;
        align-items: center;
        .info{
          flex:1;
        }
      }
    }
   }
  }
  :deep(.ant-form-horizontal .ant-form-item-label){
    min-width: 100px;
  }
</style>
