import { FormSchema } from '/@/components/Form';
import { useUserStore } from '/@/store/modules/user';
import {  isAccountExist } from '/@/api/sys/account';
export const infoschemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '姓名',
      required:true,
      colProps: {
        span: 12,
      },
      componentProps: {
      },
    },
    {
      field: 'username',
      component: 'Input',
      label: '用户账号',
      required:true,
      colProps: {
        span: 12,
      },
      componentProps: {
        placeholder:"登录后台账号"
      },
      rules: [
      {
        required: true,
        message: '请输入账号',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            const userStore = useUserStore();
            const accountID = userStore.getUserInfo?.userId||0;
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
      field: 'mobile',
      component: 'Input',
      label: '手机号码',
      colProps: {
        span: 12,
      },
      componentProps: {
      },
    },
     {
      field: 'email',
      component: 'Input',
      label: '邮箱',
      colProps: {
        span: 12,
      },
      componentProps: {
      },
    },
    {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: {
      span: 12,
    },
    }
  ];