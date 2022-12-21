<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleCreate"> 新增分类 </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <!-- <template v-if="column.key === 'status'"  >
            ss{{ record.status }}
        </template> -->
        <template v-if="column.key === 'action'"  >
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
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
  import { getList } from '/@/api/member/manage';
  import { columns, searchFormSchema } from './data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  //组件
  import FormModal from './FormModal.vue';
  export default defineComponent({
    name: 'memberManage',
    components: { BasicTable, TableAction,FormModal, Icon,[Popconfirm.name]:Popconfirm},
    setup() {
      const [registerTable, { reload ,updateTableDataRecord}] = useTable({
        title: '会员列表',
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
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });
    const [registerModal, { openModal }] = useModal();
    //表单提交回调
    function handleSuccess({ isUpdate, values }){
        if (isUpdate) {
           updateTableDataRecord(values.id, values);
        } else {
          reload();
        }
      }
      function handleCreate() {
        reload()
      }
      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        console.log(record);
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
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        statusFont,
        handleSuccess,registerModal,
      };
    },
  });
</script>
