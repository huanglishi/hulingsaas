<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleCreate"> 新增文章 </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'"  >
          <a-tag :color="statusFont(record.status,'color')">
              <template #icon>
                <Icon :about="statusFont(record.status,'icon')"></Icon>
              </template>
              {{statusFont(record.status,'text')}}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'"  >
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList } from '/@/api/article/manage';
  import { columns, searchFormSchema } from './role.data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm } from 'ant-design-vue';
  export default defineComponent({
    name: 'formManage',
    components: { BasicTable, TableAction, Icon,[Popconfirm.name]:Popconfirm},
    setup() {
      const [registerTable, { reload }] = useTable({
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
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        reload()
      }

      function handleEdit(record: Recordable) {
        console.log(record)
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
      };
    },
  });
</script>
