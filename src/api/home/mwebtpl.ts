/**
 * 首页微站模板
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
  GetTplGroup = '/home/micwebtpl/getTplGroup',
  GetTpl = '/home/micwebtpl/getTpl',
 }
 
 
 //1获取分类
 export const getTplGroup = (params) => {
   return defHttp.get({ url: Api.GetTplGroup,params:params });
 };
 //2获取模板
 export const getTpllist = (params) => {
   return defHttp.get({ url: Api.GetTpl,params:params });
 };