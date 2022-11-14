<template>
  <div class="GroupwBox">
    <BasicTable @register="registerTable">
     <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
        <TableAction :actions="createActions(record, column)" />
      </template>
      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="handleAdd"> 新增分组 </a-button>
  </div>
</template>
<script lang="ts" >
  import { defineComponent } from 'vue';
  import { getCateList ,AddCate,delCate} from '/@/api/common/upload';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      editRow: false,
    },
    {
      title: '分组名称',
      dataIndex: 'name',
      editRow: true,
    },
  ];

  export default defineComponent({
    name:"groupTable",
    components: { BasicTable, TableAction },
    emits: ['upgroup'],
    setup(_, { emit }) {
      const [registerTable, {reload, getDataSource }] = useTable({
        columns: columns,
        showIndexColumn: false,
        api: getCateList,
        searchInfo:{filetype:1},
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
        },
        pagination: false,
      });

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true);
      }
       //取消
     async function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false);
        if (record.isNew) {
          const data = getDataSource();
          const index = data.findIndex((item) => item.key === record.key);
          data.splice(index, 1);
        }
      }
      //删除
      async function handleDel(record: EditRecordRow) {
        record.onEdit?.(false);
        if (record.isNew) {
          const data = getDataSource();
          const index = data.findIndex((item) => item.key === record.key);
          data.splice(index, 1);
        }else{//删除
          await delCate(record.id);
        }
        reload();
        emit('upgroup')
      }
      //保存
     async function handleSave(record: EditRecordRow) {
        record.onEdit?.(false, true);
        let savedata={id:0,name:""}
        if(record.isNew){
          savedata={id:0,name:record.name}
        }else{
          savedata={id:record.id,name:record.name}
        }
        await AddCate(savedata);
        emit('upgroup')
      }
      //添加
      function handleAdd() {
        const data = getDataSource();
        const addRow: EditRecordRow = {
          name: '',
          no: '',
          dept: '',
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
        };
        data.push(addRow);
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
              popConfirm: {
                title: '是否删除？',
                placement: 'left',
                confirm: handleDel.bind(null, record, column),
              },
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            onClick: handleCancel.bind(null, record, column),
          },
        ];
      }
      return {
        registerTable,
        handleEdit,
        createActions,
        handleAdd,
        getDataSource,
      };
    },
  });
</script>
<style lang="less" scoped>
.GroupwBox{
    padding: 0px 2px 10px 2px;
}
:deep(.ant-table-body){
  height:auto !important;
}
</style>
