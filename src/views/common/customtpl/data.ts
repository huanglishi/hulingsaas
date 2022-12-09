import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import {   h } from 'vue';
import { Tinymce } from '/@/components/Tinymce/index';
export const columns: BasicColumn[] = [
  {
    title: '标题',
    dataIndex: 'name',
    align:"left"
  },
  {
    title: '描述',
    dataIndex: 'des',
  },
  {
    title: '处理时间',
    dataIndex: 'backtime',
    customRender: ({ record }) => {
      const timestamp = record.backtime;
      if(!timestamp){
          return "未处理";
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
