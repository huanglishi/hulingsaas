<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="menutreeData"
          :fieldNames="{ title: 'menuName', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
          ref="treeRef"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref,nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
 import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';

  import { getMenuList,saveData ,getParentList} from '/@/api/sys/role';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      let Id = ref(0);
      const isUpdate = ref(true);
      const menutreeData = ref<TreeItem[]>([]);
      //操作tree节点
     const treeRef = ref<Nullable<TreeActionType>>(null);
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('操作tree节点：tree is null!');
        }
        return tree;
      }

      const [registerForm, { resetFields, setFieldsValue,updateSchema, validate }] = useForm({
        labelWidth: 90,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
         const id = unref(isUpdate)?data.record.id:0;
         const pid = unref(isUpdate)?data.record.pid:0;
          menutreeData.value = (await getMenuList({id:id,pid:pid})) as any as TreeItem[];

        if (unref(isUpdate)) {
          //删除不赋值字段
          setFieldsValue({
            ...data.record,
          });
          Id.value=data.record.id
          //设置选择中的菜单
          if(data.record.menu == "*"){
            nextTick(()=>{
              getTree().checkAll(true);
            })
          }else{
            getTree().setCheckedKeys(data.record.menu);
          }
        }else{
           Id.value=0;
        }
        //展开
        nextTick(()=>{
           getTree().expandAll(true);
        })
         //父级
        var treeData = await getParentList({id:Id.value});
        if(!treeData) treeData=[]
        var parntList : any=[{id: 0,name: "第一级",pid: 0}];
        treeData = parntList.concat(treeData)
        updateSchema({
          field: 'pid',
          componentProps: { treeData },
        });
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // TODO custom api
            //提交到数据库
           if(Id.value>0){
             values.id=Id.value
           }
          if(values.menu&&values.menu.checked){
             values.menu=values.menu.checked
           }
          const resultdata = await saveData(values);
           console.log("提交结果：",resultdata); 
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      
      return {
        treeRef,
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        menutreeData,
      };
    },
  });
</script>
