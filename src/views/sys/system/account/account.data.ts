import {  isAccountExist } from '/@/api/sys/account';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '电话',
    dataIndex: 'mobile',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'rolename',
    customRender: ({ record }) => {
      var rolename_str=""
      if(record.rolename){
        rolename_str=(record.rolename).join("，")
      }
      return rolename_str
    },
  },
  {
    title: '部门',
    dataIndex: 'depname',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createtime',
    width: 110,
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
      return Y + M + D 
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'account',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '用户名',
    component: 'Input',
    required: true,
  },
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    helpMessage: ['登录账号','检验账号唯一性'],
    rules: [
      {
        required: true,
        message: '请输入账号',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            var accountID=sessionStorage.getItem("accountID")
            isAccountExist(value,accountID)
              .then(() => resolve())
              .catch((err) => {
                reject(err.message || '验证失败');
              });
          });
        },
      },
    ],
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    helpMessage: ['默认密码：123456',"不修改请留空"],
    ifShow: true,
  },
  {
    field: 'roleid',
    label: '角色(多选)',
    component: 'Select',
    slot: 'roleSelect',
    required: true,
  },
  {
    field: 'deptid',
    label: '所属部门',
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
    field: 'nickname',
    label: '昵称',
    component: 'Input',
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
