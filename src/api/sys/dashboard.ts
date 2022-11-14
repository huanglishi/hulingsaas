/**
 * 首页桌面
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetWeather = '/common/mapapi/weather',
  GetNumList = '/dashboard/analysis/getNumList',
  GetWebPayList = '/dashboard/analysis/getWebPayList',
  SavaPayOrder = '/dashboard/analysis/savaPayOrder',
  IsHaseMicroweb = '/dashboard/analysis/isHaseMicroweb',//判断是否含有
}


/**1. workbench导航面板*/
//获取天气预报数据
export const getWeather = (params) => {
  return defHttp.get({ url: Api.GetWeather,params:params });
};
/**2. analysis统计*/
//1获取统计
export const getNumList = (params) => {
  return defHttp.get({ url: Api.GetNumList,params:params });
};
//2获取轻站支付预置套餐
export const getWebPayList = (params) => {
  return defHttp.get({ url: Api.GetWebPayList,params:params });
};
//3添加订单
export const savaPayOrder = (params?: object) =>
defHttp.post({ url: Api.SavaPayOrder, params:params}, { errorMessageMode: 'showmsg' });
//判断是否含有
export const isHaseMicroweb = () => {
  return defHttp.get({ url: Api.IsHaseMicroweb });
};