/**
 * 接口列表数据
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetApiList = '/system/apitest/getApiList',
    SaveData = '/system/apitest/saveData',
    DelData = '/system/apitest/delData',
    UpLock = '/system/apitest/upLock',
    GetDBField = '/system/apitest/getDBField',
 }
 
 
 //1.获取文章列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetApiList,params:{...params,type:"client"} });
 };
 //获取接口字段
 export const getDBField = (params) => {
   return defHttp.get({ url: Api.GetDBField,params:params});
 };
//2.保存文章
export const saveData = (params?: object) =>
defHttp.post({ url: Api.SaveData, params:{...params,type:"client"} }, { errorMessageMode: 'message' });
 
//3.删除
export const delData = (params?: object) =>
defHttp.delete({ url: Api.DelData, params:params}, { errorMessageMode: 'message' });

//4.更新状态
export const upLock = (params?: object) =>
defHttp.post({ url: Api.UpLock, params:params}, { errorMessageMode: 'message' });

 