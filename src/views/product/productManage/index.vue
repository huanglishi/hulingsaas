<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 添加产品 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'catename'"  >
          <a-tag  v-for="item in record.catename">{{item}}</a-tag>
        </template>
        <template v-if="column.key === 'status'"  >
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
  import { Popconfirm,Tag } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  //组件
  import FormModal from './FormModal.vue';
  //api
  import { getList,delProduct } from '/@/api/product/manage';
  export default defineComponent({
    name: 'productManage',
    components: { BasicTable, TableAction, FormModal,Icon,[Popconfirm.name]:Popconfirm,[Tag.name]:Tag},
    setup() {
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload,updateTableDataRecord}] = useTable({
        title: '产品列表',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          fixed: undefined,
        },
      });
      //添加文章
      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }
      //编辑文章
      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      //删除文章
     async function handleDelete(record: Recordable) {
        const result =await delProduct({ids:[record.id]})
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
      return {
        registerModal,
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        statusFont,
        handleSuccess,
      };
    },
  });
</script>
