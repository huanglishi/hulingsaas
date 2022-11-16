<template>
  <div class="tablebox">
    <div class="headerbrar">
       <div class="bar">
         <span class="rootbar" @click="goBack">表单管理</span>
         <span class="linebar">/</span>
         <span class="nowbar">{{bartitle}}</span>
       </div>
    </div>
    <BasicTable @register="registerTable">
      <template #tableTitle>
         <div class="searchbox">
          <div class="searchItem">
            <a-select
              ref="select"
              v-model:value="searchkeyword.type"
              style="width: 120px"
            >
              <a-select-option value="itemvalue">表单项内容</a-select-option>
              <a-select-option value="user">会员账号</a-select-option>
            </a-select>
          </div>
          <div class="searchItem">
            <a-input v-model:value="searchkeyword.keyword" placeholder="请输入" style="width: 120px;"/>
          </div>
         </div>
      </template>
      <template #toolbar>
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
  import { defineComponent,ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getList } from '/@/api/article/manage';
  import { columns, searchFormSchema } from './data';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm,Select} from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  export default defineComponent({
    name: 'formdata',
    components: { 
      BasicTable, TableAction, Icon,[Popconfirm.name]:Popconfirm,
      ASelect:Select,ASelectOption:Select.Option,
    },
    setup() {
      const bartitle=ref("表单数据")
      const searchkeyword=ref({
         type:"itemvalue",
         keyword:"",
      })

      const go = useGo();
      const [registerTable, { reload }] = useTable({
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: false,
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
      //返回
      function goBack() {
        go('/form/formManage');
      }

      function handleEdit(record: Recordable) {
        console.log(record)
      }

      function handleDelete(record: Recordable) {
        console.log(record);
        reload()
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
        searchkeyword,
        bartitle,
        registerTable,
        handleEdit,
        handleDelete,
        statusFont,
        goBack,
      };
    },
  });
</script>
<style lang="less" scoped>
.tablebox{
  padding: 0px 16px 16px 16px;
  .searchbox{
    display: flex;
    .searchItem{
       margin-right: 10px;
    }
  }
}
.headerbrar{
  height: 55px;
  line-height: 55px;
  .bar{
    font-size: 15px;
    user-select: none;
    .rootbar{
      color: #606972;
      cursor: pointer;
      &:hover{
        color: #5874d8;
      }
    }
    .linebar{
      color: #606972;
      padding: 10px;
    }
    .nowbar{
        cursor: auto;
        color: #5874d8;
        font-weight: 700;
    }
  }
}
</style>
