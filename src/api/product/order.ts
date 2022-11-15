/**
 * 产品列表
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/product/order/getList',
 }
 
 
 //1.获取订单列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList,params:params });
 };