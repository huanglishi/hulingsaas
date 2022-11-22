/**
 * 首页桌面-文章
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
  GetArticle = '/home/base/getArticle',
  GetMicweb = '/home/base/getMicweb',
  SaveMicweb = '/home/base/saveMicweb',
 }
 
 
 //1 获取系统文章
 export const getArticle = (params) => {
   return defHttp.get({ url: Api.GetArticle,params:params });
 };
 //2 获取微站数据
 export const getMicweb = (params) => {
   return defHttp.get({ url: Api.GetMicweb,params:params });
 };
 //2.保存
export const saveMicweb = (params?: object) =>
defHttp.post({ url: Api.SaveMicweb, params:params}, { errorMessageMode: 'message' });