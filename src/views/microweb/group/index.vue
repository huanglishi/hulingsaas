<template>
  <div >
    <BasicTable @register="registerTable" :style="{padding:'3px'}">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增分组 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
         <template v-if="column.key === 'name'">
           <span v-html="record.spacer"></span>{{record.name}}
        </template>
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
    <GrouptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { Tag } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList ,delData,upLock} from '/@/api/microweb/group';

  import { useModal } from '/@/components/Modal';
  import GrouptModal from './GrouptModal.vue';

  import { columns, searchFormSchema } from './dept.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'microwebGroup',
    components: { BasicTable, GrouptModal, TableAction,Tag },
    emits: ['upcateData'],
    setup(_, { emit }) {
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '分组列表',
        api: getList,
        columns,
        indentSize:10,
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
          upCateData()
      }

      function handleSuccess() {
        reload();
        upCateData()
      }
      //返回调用页面刷新
      function upCateData() {
        emit('upcateData');
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
          upCateData()
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