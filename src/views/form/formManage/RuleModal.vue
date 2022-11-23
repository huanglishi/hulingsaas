<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="660px" minHeight="500">
     <div class="list_box">
       <div class="header_tool">
        <div class="left">规则列表：</div>
        <div class="right">
          <a-button @click="addRule">添加规则</a-button>
        </div>
       </div>
       <div class="content_box">
         <div class="content_item" v-for="(item,index) in rulelist">
            <div class="bartool" >
              <div class="left" @click="item.isdow=!item.isdow">
                <Icon :icon="item.isdow?'radix-icons:triangle-down':'radix-icons:triangle-right'" size="18" color="#262626"></Icon>
                规则{{index+1}}</div>
              <div class="right"  @click="delItem(item)">
                <Icon icon="mingcute:delete-2-line" size="18"></Icon>
              </div>
            </div>
            <!--编辑选项-->
            <div class="formdata" v-show="item.isdow">
              <div class="selectdata">
                <div class="selectForm">
                  <div class="label">当</div>
                  <div class="data">
                    <a-select v-model:value="item.form_item_id" style="width: 220px" @change="(value)=>{item.value=null;optionToArray(value,item)}" placeholder="请选择">
                      <template v-for="list in formitemlist">
                        <a-select-option v-if="['radio','checkbox','select'].indexOf(list['type'])>-1" :value="list['id']">{{list['name']}}</a-select-option>
                      </template>
                    </a-select>
                  </div>
                </div>
                <div class="selectForm">
                  <div class="label">选中</div>
                  <div class="data">
                    <a-select v-model:value="item.value" style="width: 220px" placeholder="请选择">
                        <a-select-option v-for="val in item.selectval" :value="val">{{val}}</a-select-option>
                    </a-select>
                  </div>
                </div>
              </div>
              <!--显示字段-->
              <div class="showfield">
                <div class="text">显示</div>
                <div class="field">
                   <div class="item" v-for="text in item.show_item_text">
                      {{text}}
                      <span class="delbtn">
                        <Icon  icon="line-md:close-circle" color="#f50" size="18" @click="handelDelShowItem(item,text)"></Icon>
                      </span>
                   </div>
                   <div class="itembtn">
                     <div class="btn" v-if="item.showadd" @click="()=>{item.showadd=false}"><Icon icon="ri:add-fill" size="18"></Icon></div>
                     <a-select v-else  @change="(value)=>{addShowField(value,item)}" style="width: 150px" placeholder="请选择显示字段">
                      <template v-for="list in formitemlist">
                        <a-select-option v-if="list['id']!=item.form_item_id&&item.show_item_ids.indexOf(list['id'])==-1" :value="list['id']">{{list['name']}}</a-select-option>
                      </template>
                    </a-select>
                   </div>
                </div>
              </div>
            </div>
         </div>
         <div class="empty" v-if="!rulelist||rulelist.length==0">
            <div><img :src="imgroot+'/resource/staticfile/formRule.gif'" /></div>
         </div>
       </div>
     </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref,reactive ,toRefs} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Select,Radio} from 'ant-design-vue';
  import { RuleItem,formTypeList,Form_item } from './data';
  import { Icon } from '/@/components/Icon';
  import { buildUUID} from '/@/utils/uuid';
  //API
  import { getRuleAndselectData,saveRule,delRuleItem } from '/@/api/form/rule';
  export default defineComponent({
    name: 'ItemModal',
    components: { BasicModal,Icon,
      ASelect:Select,ASelectOption:Select.Option,ARadio:Radio,ARadioGroup:Radio.Group
    },
    emits: ['success', 'register'],
    setup() {
      const isUpdate = ref(true);
      const {createMessage,createConfirm} = useMessage();
      //单项数据
      const rule_data=  ref<RuleItem[]>([]);// 定义表单项自结构
      const form_item: Form_item[] = [] // 定义表单项自结构
      const pagedata=reactive({
        rulelist:rule_data,
        formitemlist:form_item,
        form_id:0,
      })
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        pagedata.form_id=data.form_id
        const ruledata= await getRuleAndselectData({form_id:data.form_id})
        pagedata.rulelist=ruledata.rulelist
        pagedata.formitemlist=ruledata.formitemlist
        console.log("获取后台数据：",ruledata)
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '表单项显示规则' : '表单项显示规则'));
      //提交表单数据
      async function handleSubmit() {
        try {
              const values =pagedata.rulelist;
              setModalProps({ confirmLoading: true });
              try {
                createMessage.loading({ content: '提交中...', key:"saveRule",duration:0});
                const resultdata = await saveRule(values);
                if(resultdata){
                  createMessage.success({ content: '提交成功！', key:"saveRule", duration: 2 });
                }
                closeModal();
              } catch {
                createMessage.destroy("saveRule");
              }
        }finally {
          setModalProps({ confirmLoading: false });
        }
      }
      //添加规则
      function addRule(){
        pagedata.rulelist.push({
          id:0,
          uuid:buildUUID(),
          form_id:pagedata.form_id,
          form_item_id:null,
          selectval:[],
          value:null,
          show_item_ids:[],
          show_item_text:[],
          showadd:true,
          isdow:true,
        })
      }
      //删除
      function delItem(item){
        if(item.id>0){
          createConfirm({
            iconType: "warning",
            title: '您确定删除吗？',
            content: '删除后将无法恢复！',
            onOk:(async()=>{
              createMessage.loading({ content: '删除中...', key:"delPro",duration:0});
              const resultdata = await delRuleItem({ids:[item.id]});
              if(resultdata){
                pagedata.rulelist=pagedata.rulelist.filter((data)=>data.id!=item.id)
                createMessage.success({ content: '删除成功！', key:"delPro", duration: 2 });
              }else {
                createMessage.error({ content: '删除失败', key:"delPro", duration: 2 });
              }
            })
          });
        }else{
          pagedata.rulelist=pagedata.rulelist.filter((data)=>data.uuid!=item.uuid)
        }
      }
      //添加显示字段
      function addShowField(value,item){
        console.log("添加显示字段",value)
        item.showadd=true
        item.show_item_ids.push(value)
        //文本
        const name_str=pagedata.formitemlist.find((data)=>data.id==value)
        if(name_str){
          item.show_item_text.push(name_str.name)
        }
        
      }
      //删除显示字段
      function delShowField(item){
        item.showadd=true
      }
      //文本选项转数组
      function optionToArray(data,item){
          if(data){
            const opdata=pagedata.formitemlist.find((item)=>item.id==data)
            var snsArr =opdata?.option.split(/[(\r\n)\r\n]+/);
            item.selectval=snsArr
          }else{
            item.selectval= []
          }
      }
      //删除
      function handelDelShowItem(item,text){
        item.show_item_text=item.show_item_text.filter((data)=>data!=text)
        createMessage.success({ content: '删除成功！', key:"show_item_text", duration: 2 });
      }
      return {  
        imgroot:window["globalConfig"]["ROOT_IMG"],
        ...toRefs(pagedata),
        registerModal, 
        getTitle, formTypeList,
        handleSubmit,addRule,delItem,
        addShowField,delShowField,optionToArray,
        handelDelShowItem,
      };
    },
  });
</script>
<style lang="less" scoped>
.list_box{
  padding: 24px;
  .header_tool{
    display: flex;
    .left{
      flex:1;
    }
  }
  .content_box{
    .content_item{
      border: 1px solid #e3e2e8;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 10px;
      .bartool{
        display: flex;
        height: 39px;
        background-color: #f7f7f7;
        padding: 10px;
        .left{
          flex:1;
          user-select: none;
          cursor: pointer;
        }
        .right{
          user-select: none;
          cursor: pointer;
        }
      }
      .formdata{
        padding: 10px;
        .selectdata{
          display: flex;
          .selectForm{
            display: flex;
            justify-content: center;
            align-items: center;
            .label{
              padding: 10px;
            }
          }
        }
        .showfield{
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 3px;
          .text{
            padding: 5px;
          }
          .field{
            flex: 1;
            display: flex;
            .item{
              display: inline-block;
              height: 34px;
              line-height: 34px;
              background: #f1f1f1;
              padding: 0 10px;
              border-radius: 2px;
              margin-right: 5px;
              position: relative;
              &:hover{
                .delbtn{
                   display: block;
                }
              }
              .delbtn{
                display: none;
                position: absolute;
                top: -8px;
                right: -4px;
              }
            }
            .itembtn{
              .btn{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 34px;
                background: #f1f1f1;
                padding: 0 10px;
                border-radius: 2px;
              }
            }
          }
          
        }
      }
    }
    //空
    .empty{
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>
