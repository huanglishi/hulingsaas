<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-custom="{model, field}"> 
        <a-select
            v-model:value="model[field]"
            show-search
            allowClear
            placeholder="选择分组"
            style="width: 100%"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="searchGroup"
            @focus="searchGroup('')"
          >
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
          <a-select-option v-for="item in grouplist"  :value="item['id']+''"><span v-html="item['name']"></span></a-select-option>
        </a-select>
      </template>
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
  import { defineComponent,ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList } from '/@/api/member/manage';
  import { columns, searchFormSchema } from './data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm,Select,Spin} from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  //组件
  import FormModal from './FormModal.vue';
  import { getGroupList } from '/@/api/member/group';
  export default defineComponent({
    name: 'memberManage',
    components: { BasicTable, TableAction,FormModal, Icon,[Popconfirm.name]:Popconfirm,
        ASelect:Select,ASelectOption:Select.Option ,Spin},
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
      //搜索分组
      function searchGroup(val) {
        getFormGroupList(val)
      }
       //获取分组数据
       const grouplist = ref([]);
       const fetching = ref(false);
       async function getFormGroupList(keyword){
        fetching.value=true
        let treeData= await getGroupList({keyword:keyword})
        if(!treeData) treeData=[]
        grouplist.value = treeData
        fetching.value=false
      }
      return {
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        statusFont,
        handleSuccess,registerModal,
        searchGroup,grouplist,fetching,
      };
    },
  });
</script>
