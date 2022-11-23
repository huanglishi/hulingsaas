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
  value?:string|any[];
  required:number;
  placeholder:string;//提示
  wordlimit:number;//字数限制
  option:string;//下拉选项
  number:number;//上传图片数量
}
//表单项类型
export const formTypeList = [
  {
    name: '单行文本',
    type:"input",
    icon: 'fluent:text-field-16-regular',
  },
  {
    name: '单选按钮',
    type:"radio",
    icon: 'gg:radio-checked',
  },
  {
    name: '多选按钮',
    type:"checkbox",
    icon: 'carbon:checkbox-checked',
  },
  {
    name: '日期选项',
    type:"date",
    icon: 'uiw:date',
  },
  {
    name: '手机号',
    type:"mobile",
    icon: 'octicon:device-mobile-24',
  },
  {
    name: '上传图片',
    type:"image",
    icon: 'ooui:image-add-ltr',
  },
  {
    name: '下拉选项',
    type:"select",
    icon: 'gg:select-r',
  },
  {
    name: '多行文本',
    type:"textarea",
    icon: 'bi:textarea-resize',
  },
  {
    name: '省市县区',
    type:"address",
    icon: 'entypo:location',
  },
  {
    name: '身份验证',
    type:"IDcard",
    icon: 'fa6-regular:address-card',
  },
  {
    name: '邮箱验证',
    type:"email",
    icon: 'ic:outline-email',
  },
];

//规则
export interface RuleItem {
  id:number;
  uuid:string;
  form_id:number;
  form_item_id?:number|null;
  selectval:string[];
  value?:string|any[]|null;
  show_item_ids:number[];//显示字段id
  show_item_text:string[];//显示字段文字
  showadd:boolean,//显示添加按钮
  isdow:boolean,//是否展开
}