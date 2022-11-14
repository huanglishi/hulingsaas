import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//表格数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: '文件数',
    dataIndex: 'num',
    width: 120,
  },
  {
    title: '提交时间',
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
];
//2.搜索
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '名称',
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
    field: 'pid',
    label: '上级',
    slot: 'pid',
    component: 'Input',
    required: true,
  },
  {
    field: 'weigh',
    label: '排序',
    component: 'InputNumber',
  },
];
//类型
export interface CateItem {
  id:number;
  pid: number;
  title: string;
  title_txt: string;
}