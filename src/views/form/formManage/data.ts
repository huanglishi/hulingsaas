import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs, {  } from 'dayjs';
export const columns: BasicColumn[] = [
  {
    title: '表单名称',
    dataIndex: 'name',
  },
  {
    title: '备注',
    dataIndex: 'des',
  },
  {
    title: '创建时间',
    dataIndex: 'createtime',
    width: 180,
    customRender: ({ record }) => {
      const timestamp = record.createtime;
      if(!timestamp){
          return "---";
      }else if(typeof timestamp == 'object'){
        return  dayjs(timestamp).format('YYYY-MM-DD HH:mm')
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

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'des',
    label: '备注',
    component: 'Input',
    colProps: { span: 8 },
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
    label: '备注',
    field: 'des',
    component: 'InputTextArea',
  },
];
//表单项
export interface Form_item {
  id:number;
  form_id:number;
  type: string;
  weigh: number;
  status: number;
  name: string;
  value:string;
  required:number;
  uuid: string;
}