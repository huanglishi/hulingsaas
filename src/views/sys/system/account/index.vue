<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect"  />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-5/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" v-auth="'100'" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看用户详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
                ifShow: (_action) => {
                  return record.id !== getUserInfo.userId; // 根据业务控制是否显示: 非enable状态的不显示启用按钮
                },
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此账号',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: (_action) => {
                  return record.id !== getUserInfo.userId; // 根据业务控制是否显示: 非enable状态的不显示启用按钮
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive,computed} from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList ,delData} from '/@/api/sys/account';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';

  import { useModal } from '/@/components/Modal';
  import AccountModal from './AccountModal.vue';

  import { columns, searchFormSchema } from './account.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'webmain',
    components: { BasicTable, PageWrapper, DeptTree, AccountModal, TableAction },
    setup() {
      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const {userId,roles, realName = '', avatar, desc } = userStore.getUserInfo || {};
        return {userId,roles, realName, avatar: avatar , desc };
      });
      const go = useGo();
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: '账号列表',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('handleSearchInfoFn', info);
          return info;
        },
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
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
      //删除数据
      async function handleDelete(record: Recordable) {
         await delData([record.id]);
          reload();
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          reload();
        }
      }

      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        reload();
      }

      function handleView(record: Recordable) {
        go('/system/account_detail/' + record.id);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
        getUserInfo,
      };
    },
  });
  // {
  //   field: 'roleid',
  //   label: '角色',
  //   component: 'ApiTreeSelect',
  //   componentProps: {
  //     api: getAllRoleList,
  //     resultField: 'list',
  //   },
  //   required: true,
  // },
</script>
