<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增部门 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="record.status==0?'green' : 'red'" @click="uplock(record.id,record.status)" style="user-select: none;">{{record.status==0?"启用":"停用"}}</Tag>
        </template>
        <template v-if="column.key === 'action'">
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
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { Tag } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getDeptList ,delData,upLock} from '/@/api/sys/dept';

  import { useModal } from '/@/components/Modal';
  import DeptModal from './DeptModal.vue';

  import { columns, searchFormSchema } from './dept.data';
import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'DeptManagement',
    components: { BasicTable, DeptModal, TableAction,Tag },
    setup() {
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '部门列表',
        api: getDeptList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        pagination: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

    async function handleDelete(record: Recordable) {
          await delData([record.id]);
          reload();
      }

      function handleSuccess() {
        reload();
      }
      //修改字段
      async function uplock(id,status) {
        const { createMessage } = useMessage();
        createMessage.loading({
          content:"更新状态中...",
          duration: 1,
        });
        try {
           await upLock([id],status);
          reload();
        } finally {
          setTimeout(()=>{
            createMessage.destroy()
          },800)
        }
      }
      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        uplock
      };
    },
  });
</script>
