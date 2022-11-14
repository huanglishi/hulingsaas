/**
 * 系统设置-支付配置
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
  SavePay = '/system/paymentConfig/savePay',
  GetPayIinfo = '/system/paymentConfig/getPayIinfo',
 }
//1获取数据
export const getPayIinfo = (params) => {
return defHttp.get({ url: Api.GetPayIinfo,params:params });
};
//2.保存支付配置
export const savePay = (params?: object) =>
defHttp.post({ url: Api.SavePay, params:params}, { errorMessageMode: 'message' });