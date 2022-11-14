/**
 * 文章列表数据
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/article/manage/getList',
    SaveArticle = '/article/manage/saveArticle',
    DelArticle = '/article/manage/delArticle',
    UpLock = '/article/manage/upLock',
    GetArticle = '/article/manage/getArticle',
    UpTop = '/article/manage/upTop',
 }
 
 
 //1.获取文章列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList,params:params });
 };
//2.保存文章
export const saveArticle = (params?: object) =>
defHttp.post({ url: Api.SaveArticle, params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const delArticle = (params?: object) =>
defHttp.delete({ url: Api.DelArticle, params:params}, { errorMessageMode: 'message' });

//4.更新状态
export const upLock = (params?: object) =>
defHttp.post({ url: Api.UpLock, params:params}, { errorMessageMode: 'message' });

//5.获取大内容字段-content
export const getArticle = (params?: object) =>
defHttp.get({ url: Api.GetArticle, params:params}, { errorMessageMode: 'message' });
 
//6.置顶
export const upTop = (params?: object) =>
defHttp.post({ url: Api.UpTop, params:params}, { errorMessageMode: 'message' });
 