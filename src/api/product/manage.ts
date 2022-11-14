/**
 * 文章列表数据
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/product/manage/getList',
    SaveProduct = '/product/manage/saveProduct',
    DelProduct = '/product/manage/delProduct',
    UpLock = '/product/manage/upLock',
    GetProduct = '/product/manage/getProduct',
    UpTop = '/product/manage/upTop',
 }
 
 
 //1.获取文章列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList,params:params });
 };
//2.保存文章
export const saveProduct = (params?: object) =>
defHttp.post({ url: Api.SaveProduct, params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const delProduct = (params?: object) =>
defHttp.delete({ url: Api.DelProduct, params:params}, { errorMessageMode: 'message' });

//4.更新状态
export const upLock = (params?: object) =>
defHttp.post({ url: Api.UpLock, params:params}, { errorMessageMode: 'message' });

//5.获取大内容字段-content
export const getProduct = (params?: object) =>
defHttp.get({ url: Api.GetProduct, params:params}, { errorMessageMode: 'message' });
 
//6.置顶
export const upTop = (params?: object) =>
defHttp.post({ url: Api.UpTop, params:params}, { errorMessageMode: 'message' });
 