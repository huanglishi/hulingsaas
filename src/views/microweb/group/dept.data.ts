import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '分组名称',
    dataIndex: 'name',
    width: 180,
    align: 'left',
  },
  {
    title: '排序',
    dataIndex: 'weigh',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createtime',
    customRender: ({ record }) => {
      const createtime = record.createtime;
      return  timestampTodataTime(createtime);
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];
//工具函数
export const timestampTodataTime = (timestamp: number) => {
  if(!timestamp){
      return "---";
  }
  // 计算年月日时分的函数
  var date = new Date(timestamp*1000)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  return Y + M + D   
};
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '分组名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '分组名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'pid',
    label: '上级分组',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'weigh',
    label: '排序',
    component: 'InputNumber',
    // required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
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
    field: 'remark',
    component: 'InputTextArea',
  },
];
