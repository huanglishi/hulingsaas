import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '分组',
    dataIndex: 'catename',
    width: 80,
  },
  {
    title: '接口名称',
    dataIndex: 'title',
    align:"left"
  },
  {
    title: '请求地址',
    dataIndex: 'url',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 60,
  },
  {
    title: '添加时间',
    dataIndex: 'createtime',
    width: 130,
    customRender: ({ record }) => {
      const timestamp = record.createtime;
      if(!timestamp){
          return "---";
      }
      // 计算年月日时分的函数
      var date = new Date(timestamp*1000)
      var year=date.getFullYear();
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
      var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes;
    },
  },
];


//表单数据
export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'method',
    label: '请求方式',
    component: 'RadioGroup',
    defaultValue: "get",
    componentProps: {
      options: [
        { label: 'GET', value: "get" },
        { label: 'POST', value: "post" },
        { label: 'DELETE', value: "delete" },
      ],
    },
    required: true,
  },
  {
    field: 'url',
    label: '访问路径',
    component: 'Input',
    required: true,
  },
  {
    label: '默认参数',
    field: 'param',
    component: 'InputTextArea',
  },
  {
    label: '数据库表',
    field: 'tablename',
    component: 'Input',
  },
  {
    field: 'cid',
    label: '分组',
    slot: 'cid',
    component: 'Input',
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    required: true,
  },
  {
    label: '备注',
    field: 'des',
    component: 'InputTextArea',
  },
];
