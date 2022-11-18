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
              allowClear
            >
              <a-select-option value="itemvalue">表单项内容</a-select-option>
              <a-select-option value="user">会员账号</a-select-option>
            </a-select>
          </div>
          <div class="searchItem">
            <a-input v-model:value="searchkeyword.keyword" placeholder="请输入" style="width: 150px;" allowClear/>
          </div>
          <div class="searchItem">
            <a-range-picker @change="pickerDate"> </a-range-picker>
          </div>
          <div class="searchItem">
            <a-button type="primary" style="margin-right: 3px;" @click="handelSearch">查找</a-button>
            <a-button @click="()=>{searchkeyword={type:'itemvalue',keyword:'',date_start:'',date_end:''}}">重置</a-button>
          </div>
         </div>
      </template>
      <template #toolbar>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'"  >
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑表单',
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
  </div>
</template>
<script lang="ts">
  import { defineComponent,ref,onMounted,unref,nextTick} from 'vue';
  import { BasicTable, useTable, TableAction,BasicColumn} from '/@/components/Table';
  import { Icon } from '/@/components/Icon';
  import { Popconfirm,Select,RangePicker} from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRoute } from 'vue-router';
  //api
  import { getFormField,getFormDataList,delData } from '/@/api/form/data';
  export default defineComponent({
    name: 'formdata',
    components: { 
      BasicTable, TableAction, Icon,[Popconfirm.name]:Popconfirm,
      ASelect:Select,ASelectOption:Select.Option,ARangePicker:RangePicker,
    },
    setup() {
      const bartitle=ref("表单数据")
      const go = useGo();
      //获取传参id
      const route = useRoute();
      const formId = ref(route.params?.id);
      const searchkeyword=ref({
         type:"itemvalue",
         keyword:"",
         date_start:"",
         date_end:"",
      })
      //页面数据
      const form_columns: BasicColumn[] = [] // 定义表单字段
      const searchInfo_arr=ref({form_id:unref(formId)})
      const [registerTable, { reload,setColumns }] = useTable({
        api: getFormDataList,
        rowKey: 'id',
        columns:form_columns,
        useSearchForm: false,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,//隐藏序号
        searchInfo:searchInfo_arr,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // fixed: undefined,
        },
      });
      //返回
      function goBack() {
        go('/form/formManage');
      }
      //编辑
      function handleEdit(record: Recordable) {
        console.log(record)
      }
      //删除
      async function handleDelete(record: Recordable) {
        const result =await delData({ids:[record.id]})
        if(result){
          reload();
        }
      }
      //选择日期
      function pickerDate(_,dateString){
       if(dateString){
        searchkeyword.value.date_start=dateString[0]
        searchkeyword.value.date_end=dateString[1]
       }
      }
      //获取页面标表头
      async function getPageField(){
        var fdata = await getFormField({form_id: unref(formId)});
          if(fdata){
            const  parnt_columns: BasicColumn[] = [{dataIndex: 'createtime', title: '提交时间',width: 110}] // 定义表单字段
            setColumns(parnt_columns.concat(fdata.list))
            bartitle.value=fdata.title
          }
      }
      //页面初始化
      onMounted(() => {
        getPageField();
      });
      //搜索
      function handelSearch(){
        searchInfo_arr.value={form_id: unref(formId),...unref(searchkeyword)}
        nextTick(()=>{
          reload();
        })
      }
      return {
        searchkeyword,
        bartitle,
        registerTable,
        handleEdit,
        handleDelete,
        goBack,pickerDate,
        handelSearch,
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
