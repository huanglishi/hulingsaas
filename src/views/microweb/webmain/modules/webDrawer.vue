<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    :maskClosable="false"
    @ok="handleSubmit"
  >
  <a-form
      layout="vertical"
      ref="formRef"
      :model="datas"
      :rules="rules"
    >
        <a-form-item ref="name" label="轻站名称" name="title">
          <a-input v-model:value="datas.title"  placeholder="请填写轻站标题"  maxlength="25"/>
        </a-form-item>
        <a-form-item label="分组" class="lef" name="groupid">
          <a-select
              v-model:value="datas.groupid"
              show-search
              allowClear
              placeholder="选择分组"
              style="width: 100%"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="searchGroup"
            >
              <a-select-option v-for="item in grouplist" :key="item.id" :value="item.id"><span v-html="item.name_txt"></span></a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="页面描述" name="des">
          <a-textarea v-model:value="datas.des"  placeholder="用户通过微信分享给朋友时，会自动显示页面描述"/>
        </a-form-item>
    </a-form>
  </BasicDrawer>
</template>
<script >
  import { defineComponent, ref, computed, nextTick } from 'vue';
  import { BasicForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {Form, Select} from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  //APi
  import { getGroupTree,saveWebData } from '/@/api/microweb/webmain';
  export default defineComponent({
    name: 'webDrawer',
    components: { BasicDrawer, BasicForm ,
       AForm: Form, AFormItem: Form.Item , ASelect:Select,ASelectOption:Select.Option},
    props: {
      datas: Object,
    },
    emits: ['success', 'register'],
    setup(props, { emit }) {
      const grouplist = ref([]);
      //提示
      const {
        createMessage,
      } = useMessage();
      let dosavepageparams=null
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
         getGroupList("")
         dosavepageparams=data
      });
      const getTitle = computed(() => ("编辑轻站"));
     //提交数据
      async function handleSubmit() {
        try {
            //提交到数据库
            if(!props.datas.title||!props.datas.groupid||props.datas.groupid==0){
              createMessage.warning("有必填项没填")
              return
            }
          setDrawerProps({ confirmLoading: true });
          const resultdata = await saveWebData(props.datas);
          if(resultdata){
            props.datas.id=resultdata//返回id
            createMessage.success("轻站保存成功！") 
            closeDrawer();
            emit('success',dosavepageparams);
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
       //搜索分组
       function searchGroup(val) {
            getGroupList(val)
        }
       //关闭页面
       async function onClose() {
        const resultdata = await saveWebData(props.datas);
          if(resultdata){
            props.datas.id=resultdata//返回id
            createMessage.success("轻站保存成功！") 
          }
       }
      //获取分组数据
      async function getGroupList(keyword){
        grouplist.value= await getGroupTree({keyword:keyword})
        nextTick(()=>{
          if(props.datas.groupid||props.datas.groupid==0){
              if(grouplist.value&&grouplist.value.length>0){
                props.datas.groupid=grouplist.value[0].id
              }else{
                props.datas.groupid=""
              }
            }
        })
        }
      return {
        registerDrawer,
        getTitle,onClose,
        handleSubmit,
        searchGroup,
        grouplist,
        rules: {
            //校验表单输入
            title: [
              //名称
              { required: true, message: '请输入轻站名称', trigger: 'blur' },
            ],
            groupid: [
              //选择分组
              { required: true, message: '请选择分组', trigger: 'blur' },
            ],
          },
      };
    },
  });
</script>
