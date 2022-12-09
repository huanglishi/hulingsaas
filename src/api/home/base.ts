/**
 * 首页桌面-文章
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
  GetArticleList = '/home/base/getArticleList',
  GetArticle = '/home/base/getArticle',
  PushStar = '/home/base/pushStar',
  GetMicweb = '/home/base/getMicweb',
  SaveMicweb = '/home/base/saveMicweb',
  PublishMicweb = '/home/base/publishMicweb',
 }
 
 
 //1 获取系统文章
 export const getArticleList = (params) => {
   return defHttp.get({ url: Api.GetArticleList,params:params });
 };
 //1 获取系统文章-详情
 export const getArticle = (params) => {
   return defHttp.get({ url: Api.GetArticle,params:params });
 };
 //添加教程文章的赞
export const pushStar = (params?: object) =>
defHttp.post({ url: Api.PushStar, params:params}, { errorMessageMode: 'message' });

 //2 获取微站数据
 export const getMicweb = (params) => {
   return defHttp.get({ url: Api.GetMicweb,params:params });
 };
 //3.编辑
export const saveMicweb = (params?: object) =>
defHttp.post({ url: Api.SaveMicweb, params:params}, { errorMessageMode: 'message' });
 //4.发布
export const publishMicweb = (params?: object) =>
defHttp.post({ url: Api.PublishMicweb, params:params}, { errorMessageMode: 'message' });
