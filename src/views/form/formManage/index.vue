<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 添加表单 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'"  >
          <TableAction
            :actions="[
              {
                icon: 'mdi:text-box-search-outline',
                tooltip: '查看提交数据',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑表单',
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
  import { useGo } from '/@/hooks/web/usePage';
  //组件
  import FormModal from './FormModal.vue';
  //api
  import { getList,delForm } from '/@/api/form/manage';
  export default defineComponent({
    name: 'formManage',
    components: { BasicTable, TableAction, FormModal,Icon,[Popconfirm.name]:Popconfirm,[Tag.name]:Tag},
    setup() {
      const go = useGo();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload,updateTableDataRecord}] = useTable({
        title: '表单列表',
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
          width: 120,
          title: '操作',
          dataIndex: 'action',
          fixed: undefined,
        },
      });
      //添加表单
      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }
      //编辑表单
      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }
      //删除表单
     async function handleDelete(record: Recordable) {
        const result =await delForm({ids:[record.id]})
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
      //查看表单数据
      function handleView(record: Recordable){
        go('/form/formdata/' + record.id);
      }
      return {
        registerModal,
        registerTable,
        handleCreate,
        handleEdit,handleView,
        handleDelete,
        statusFont,
        handleSuccess,
      };
    },
  });
</script>
