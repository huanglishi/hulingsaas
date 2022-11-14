<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增分类 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'"  >
           <div class="titlebox">
            <span v-html="record.spacer"></span>{{record.title}}
           </div>
        </template>
        <template v-if="column.key === 'action'" >
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
                  title: '是否确认删除(连同里面图片)',
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
  import { useMessage } from '/@/hooks/web/useMessage';

  import { getList,delFile } from '/@/api/resource/cate';
  import { columns, searchFormSchema } from './data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  //组件
  import FormModal from './FormModal.vue';
  export default defineComponent({
    name: 'resourceCate',
    components: { BasicTable, TableAction, Icon,[Popconfirm.name]:Popconfirm,FormModal},
    setup() {
      const {createMessage} = useMessage();
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload,updateTableDataRecord }] = useTable({
        title: '文件夹列表',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        pagination: false,
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
      //新增
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
       //表单提交回调
       function handleSuccess({ isUpdate, values }){
        if (isUpdate) {
           updateTableDataRecord(values.id, values);
        } else {
          reload();
        }
      }
      //删除
      async function handleDelete(record: Recordable) {
        createMessage.loading({ content: '删除中...', key:"delFile",duration:0});
        const resultdata = await delFile({ids:[record.id]});
        if(resultdata){
          reload()
          createMessage.success({ content: '删除成功！', key:"delFile", duration: 2 });
        }else {
          createMessage.error({ content: '删除失败', key:"delFile", duration: 2 });
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
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        statusFont,
        registerModal,handleSuccess,
      };
    },
  });
</script>
<style lang="less" scoped>
.titlebox{
  width: 100%;
  text-align: left;
}
</style>
