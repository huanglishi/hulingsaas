<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
       <template v-if="column.key === 'name'">
           <span v-html="record.spacer"></span>{{record.name}}
        </template>
        <template v-if="column.key === 'action'&&ShowEdit(record.id,userInfo)">
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
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent ,nextTick,computed} from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList,delData } from '/@/api/sys/role';

  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';

  import { columns, searchFormSchema } from './role.data';
  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, RoleDrawer, TableAction },
    setup() {
      const userStore = useUserStore();
      const userInfo = computed(() => {
        const {userId,roles, realName = '', avatar, desc } = userStore.getUserInfo || {};
        return {userId,roles, realName, avatar: avatar , desc };
      });
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload ,expandAll}] = useTable({
        title: '角色列表',
        api: getList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        // useSearchForm: true,
        // showTableSetting: true,
        // bordered: true,
        // showIndexColumn: false,
        //页码
        isTreeTable: true,
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
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        if(record.menu&&record.menu!="*"&&typeof record.menu=="string"){
          record.menu=JSON.parse(record.menu)
        }
        openDrawer(true, {
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
      //  tree默认展开所有表项
      function onFetchSuccess() {
        nextTick(expandAll);
      }
      //判断是否显示编辑
      function ShowEdit(id,userinfo){
        const roles=userinfo.roles
        for(var index in roles){
          var item =roles[index]
          if(item.id==id){
             return false
           }
        }
        return true;
      }
      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        userInfo,
        ShowEdit,
      };
    },
  });
</script>
