<template>
  <div>
    <BasicTable @register="registerTable" >
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增分类 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'"  >
           <div  v-html="record.name_txt"></div>
        </template>
        <template v-if="column.key === 'status'"  >
          <a-switch v-model:checked="record.status" @change="(checked)=>{onUpStatus(record.id,checked)}" checked-children="启用" :checkedValue="0" un-checked-children="禁用" :unCheckedValue="1"/>
        </template>
        <template v-if="column.key === 'action'"  >
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <!--添加表单-->
    <FormModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './data';
  import { Icon } from '/@/components/Icon';
  import { Switch } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  //组件
  import FormModal from './FormModal.vue';
  //api
  import { getList,delCate,upStatus } from '/@/api/article/cate';
  export default defineComponent({
    name: 'articleCate',
    components: { BasicTable, TableAction, FormModal,Icon,[Switch.name]:Switch,},
    emits: ['upcateData'],
    setup(_, { emit }) {
      const {createMessage,} = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload,updateTableDataRecord}] = useTable({
        title: '分类列表',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: false,
        pagination: false,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          fixed: undefined,
        },
      });
      //添加
      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }
      //编辑
      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      //删除
     async function handleDelete(record: Recordable) {
        const result =await delCate({id:record.id})
        if(result){
          reload();
        }
      }
      //表单提交回调
      function handleSuccess({ isUpdate, values }){
        if (isUpdate) {
           updateTableDataRecord(values.id, values);
        } else {
          reload();
        }
        emit('upcateData');
      }
      //状态
      function statusFont(status,type) {
        let text="",icon="",color="";
          if(status==0){

          }else if(status==1){

          }
          if(type=="text"){
            return text
          }else if(type=="icon"){
            return icon
          }else if(type=="color"){
            return color
          }
      }
      //更新状态
     async function onUpStatus(id,checked) {
        try {
            createMessage.loading({ content: '更新状态中...', key:"saveArticle",duration:0});
            const resultdata = await upStatus({id:id,status:checked});
            if(resultdata){
              createMessage.success({ content: '更新成功！', key:"saveArticle", duration: 2 });
            }else if(resultdata==0){
              createMessage.success({ content: '已更新！', key:"saveArticle", duration: 2 });
            }
          } catch {
            createMessage.destroy("saveArticle");
          }
      }
      return {
        registerModal,
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        statusFont,
        handleSuccess,onUpStatus,
      };
    },
  });
</script>
