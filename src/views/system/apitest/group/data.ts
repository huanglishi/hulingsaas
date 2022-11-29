import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    align:"left"
  },
  {
    title: '上级',
    dataIndex: 'pidname',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
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

//表单数据
export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'pid',
    label: '上级',
    slot: 'pid',
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
    field: 'useFrom',
    label: '调用接口',
    component: 'RadioGroup',
    defaultValue: "pc",
    componentProps: {
      options: [
        { label: 'PC端', value: "pc" },
        { label: '手机端', value: "phone" },
      ],
    },
    required: true,
  },
];
