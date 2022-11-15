import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '账号',
    dataIndex: 'username',
  },
  {
    title: '分组',
    dataIndex: 'groupname',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '注册时间',
    dataIndex: 'createtime',
    width: 180,
    customRender: ({ record }) => {
      const timestamp = record.createtime;
      if(!timestamp){
          return "---";
      }
      // 计算年月日时分的函数
      var date = new Date(timestamp*1000)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var H = date.getHours() +":" 
      var S= date.getMinutes()  
      return Y + M + D +H +S
    },
  },
  {
    title: '备注',
    dataIndex: 'des',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
];

