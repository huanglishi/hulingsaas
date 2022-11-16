<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" width="660px" minHeight="500">
     <div class="form_box">
        <div class="form_content">
          <Form ref="formItemRef" :model="formData" >
              <FormItem label="表单项名称" name="name" :rules="[{ required: true }]">
                <a-input v-model:value="formData.name" placeholder="请输入表单项名称" style="width: 410px;"/>
              </FormItem>
              <FormItem label="表单项类型" name="type" :rules="[{ required: true }]">
                  <div>
                    <a-radio-group v-model:value="formData.type" size="large">
                      <div class="radio_list"> 
                         <div  class="type_button" v-for="(item,index) in formTypeList" :key="index" :class="{tb_activity:formData.type==item.type}">
                            <a-radio :value="item.type" >
                              <Icon class="icons" :icon="item.icon" size="15"/>{{item.name}}
                            </a-radio>
                        </div>
                      </div>
                    </a-radio-group>
                  </div>
              </FormItem>
              <FormItem label="是否必填" name="required" style="margin-bottom: 5px;">
                  <a-radio-group v-model:value="formData.required">
                    <a-radio :value="0">是</a-radio>
                    <a-radio :value="1">否</a-radio>
                  </a-radio-group>
              </FormItem>
              <FormItem label="提醒文字" v-if="['input','date','mobile','select','textarea','IDcard','email'].indexOf(formData.type)>-1" name="placeholder"   style="margin-bottom: 5px;">
                <a-input v-model:value="formData.placeholder" placeholder="请输入提醒文字" style="width: 410px;"/>
              </FormItem>
              <FormItem label="字数限制" v-if="['input','textarea'].indexOf(formData.type)>-1" name="wordlimit" >
                <a-input v-model:value="formData.wordlimit" placeholder="请输入字数限制" style="width: 410px;"/>
              </FormItem>
              <FormItem label="选项" v-if="['radio','select'].indexOf(formData.type)>-1" name="option" extra="每行一个选项（换行分隔）">
                <a-textarea  v-model:value="formData.option" placeholder="请输入下拉选项值（每行一个选项）" style="width: 410px;" :rows="4"/>
              </FormItem>
              <FormItem label="图片最大数量" v-if="['image'].indexOf(formData.type)>-1" name="number" >
                <a-input v-model:value="formData.number" placeholder="请输入图片最大数量" style="width: 410px;" type="number"/>
              </FormItem>
          </Form>
        </div>
     </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref,reactive ,toRefs} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Select,Form,FormItem,FormInstance,Radio} from 'ant-design-vue';
  import { Form_item,formTypeList } from './data';
  import { Icon } from '/@/components/Icon';
  //API
  // import { saveItem } from '/@/api/form/item';
  export default defineComponent({
    name: 'ItemModal',
    components: { BasicModal, Icon,
      ASelect:Select,ASelectOption:Select.Option,Form,FormItem,ARadio:Radio,ARadioGroup:Radio.Group,ARadioButton:Radio.Button  
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const formItemRef = ref<FormInstance>();
      const {createMessage,} = useMessage();
      //初始数据
      const indata={
          id:0,
          form_id:0,
          type: "input",
          weigh: 0,
          status: 0,
          name: "",
          value:"",
          required:1,
          placeholder:"",
          wordlimit:50,
          option:"",
          number:1,
      }
      const Item_data=  ref<Form_item>(indata);// 定义表单项自结构
      const pagedata=reactive({
        formData:Item_data,
        index:-1,
      })
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await formItemRef.value?.resetFields()//重置表单
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          const record=JSON.stringify(data.record)
          pagedata.formData= JSON.parse(record);
          pagedata.index = data?.index;
        }else{
          pagedata.formData= indata;
          pagedata.index = -1;
        }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增表单项' : '编辑表单项'));
      //提交表单数据
      async function handleSubmit() {
        try {
           if(await (formItemRef.value?.validate())){
              const values =pagedata.formData;
              setModalProps({ confirmLoading: true });
              try {
                if (unref(isUpdate)) {
                  // createMessage.loading({ content: '提交中...', key:"saveItem",duration:0});
                  // const resultdata = await saveItem(values);
                  // if(resultdata){
                  //   createMessage.success({ content: '提交成功！', key:"saveItem", duration: 2 });
                  //   emit('success', { isUpdate: unref(isUpdate), values: { ...values},index:pagedata.index});
                  // }
                  emit('success', { isUpdate: unref(isUpdate), values: { ...values},index:pagedata.index});
                }else{
                   emit('success', { isUpdate: unref(isUpdate), values: { ...values} });
                }
                closeModal();
              } catch {
                createMessage.destroy("saveItem");
              }
           }
        }  catch {
          createMessage.error({ content: '请填写必填项', key:"saveItem", duration: 2 })
          }finally {
          setModalProps({ confirmLoading: false });
        }
      }
      return {  
        ...toRefs(pagedata),
        registerModal, 
        getTitle, formTypeList,
        formItemRef,
        handleSubmit
      };
    },
  });
</script>
<style lang="less" scoped>
.form_box{
  padding: 24px;
  .form_content{
    .radio_list{
      .type_button{
        font-size: 14px;
        user-select: none;
        color: #333;
        cursor: pointer;
        min-width: 80px;
        height: 30px;
        line-height: 30px;
        float: left;
        cursor: pointer;
        position: relative;
        border: 1px solid #e3e2e8;
        padding: 0 5px;
        margin: 0 20px 12px 0;
        border-radius: 2px;
        &:hover{
          border-color: #5874d8;
          color: #5874d8;
        }
        .icons{
          padding-right: 5px;
          display:inline-flex !important;
          margin-bottom: -3px;
        }
      }
      .tb_activity{
        border-color: #5874d8;
        color: #5874d8;
      }
      :deep(.ant-radio){
        visibility: hidden;
        width: 0px;
        height: 0px;
      }
      :deep(.ant-radio-wrapper){
        margin-right: 0px;
      }
    }
    :deep(.ant-form-horizontal .ant-form-item-label){
      min-width: 100px;
    }
  }
}

</style>
