/**
 * 首页桌面
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
   GetModels = '/home/models/getModels',
 }
 
 
 //1获取功能模块
 export const getModels = (params) => {
   return defHttp.get({ url: Api.GetModels,params:params });
 };