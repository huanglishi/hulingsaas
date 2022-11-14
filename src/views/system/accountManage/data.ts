export interface UserInfoItem {
  nickname:string;
  tel: string;
  email: string;
  city: string;
  remark: string;
}
import { FormSchema } from '/@/components/Form/index';
// 基础设置 form
export const baseSetschemas: FormSchema[] = [
  {
    field: 'nickname',
    component: 'Input',
    label: '昵称',
    colProps: { span: 18 },
  },
  {
    field: 'tel',
    component: 'Input',
    label: '联系电话',
    colProps: { span: 18 },
  },
  {
    field: 'email',
    component: 'Input',
    label: '邮箱',
    colProps: { span: 18 },
  },
  {
    field: 'city',
    component: 'Input',
    label: '城市',
    colProps: { span: 18 },
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '个人简介',
    colProps: { span: 18 },
  },
];
//安全配置
export const formSecurity: FormSchema[] = [
  {
    field: 'passwordOld',
    label: '当前密码',
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'passwordNew',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',

    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('密码不能为空');
            }
            if (value !== values.passwordNew) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
