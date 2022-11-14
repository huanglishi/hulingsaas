import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
    {
        title: '类型',
        dataIndex: 'out_in',
        fixed: 'left',
        width: 200,
        customRender: ({ record }) => {
            return record.out_in=="in"?"登录":"退出登录" 
        }
        },
        {
        title: '登录IP',
        dataIndex: 'loginIP',
        },
        {
        title: '操作日期',
        dataIndex: 'createtime',
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
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '部门名称',
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

