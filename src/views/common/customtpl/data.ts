import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {   h } from 'vue';
import { Tinymce } from '/@/components/Tinymce/index';
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
    title: '排序',
    dataIndex: 'weigh',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
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
    label: '需求简述',
    field: 'des',
    component: 'InputTextArea',
  },
  {
    field: 'content',
    component: 'Input',
    label: '需求详情',
    colProps: {
      span: 24,
    },
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        toolbar:"fontsizeselect fontselect lineheight bold italic alignleft aligncenter alignright outdent indent forecolor backcolor hr bullist numlist link",
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
  },
];
