import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { upLock,upTop} from  '/@/api/product/manage';
import { useMessage } from '/@/hooks/web/useMessage';
import dayjs, {  } from 'dayjs';
export const columns: BasicColumn[] = [
  {
    title: '产品名称',
    dataIndex: 'title',
  },
  {
    title: '归属分类',
    dataIndex: 'catename',
  },
  {
    title: '标签',
    dataIndex: 'labelname',
  },
  {
    title: '价格',
    dataIndex: 'author',
  },
  {
    title: '上架',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === 0,
        checkedChildren: '上架',
        unCheckedChildren: '下架',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 0 : 1;
          const { createMessage } = useMessage();
          upLock({id:record.id, status:newStatus})
            .then(() => {
              record.status = newStatus;
              createMessage.success({ content: `已成功修改状态`, key:"upLock", duration: 2 });
            })
            .catch(() => {
              createMessage.error('修改状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '发布时间',
    dataIndex: 'releasetime',
    width: 180,
    customRender: ({ record }) => {
      const timestamp = record.releasetime;
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
      // var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes;
    },
  },
  {
    title: '置顶',
    dataIndex: 'top',
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.top > 0,
        checkedChildren: '顶',
        onChange(checked: boolean) {
          const { createMessage } = useMessage();
          upTop({id:record.id,checked:checked})
            .then((res) => {
              record.top = res;
              createMessage.success({ content: res>0?`置顶成功`:`取消置顶成功`, key:"upTop", duration: 2 });
            })
            .catch(() => {
              createMessage.error('修改失败');
            })
            .finally(() => {
            });
        },
      });
    },
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

//表单数据
export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'cid',
    label: '分组',
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
    required: true,
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
    field: 'des',
    component: 'InputTextArea',
  },
];
//参数列表
export interface ProItem {
  id:number;
  type: number;
  keyname: string;
  name: string;
  val:string;
  vallist:[];
}
//参数返回值
export interface ProItemVal {
  id:number;
  val:string;
}
