/**
 * 表单管理
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/form/manage/getList',
    SaveForm  = '/form/manage/saveForm ',
    DelForm  = '/form/manage/delForm',
    UpLock = '/form/manage/upLock',
 }
 
 
//1.获取列表
export const getList = (params) => {
  return defHttp.get({ url: Api.GetList,params:params });
};
//2.保存表单
export const saveForm = (params?: object) =>
defHttp.post({ url: Api.SaveForm , params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const delForm  = (params?: object) =>
defHttp.delete({ url: Api.DelForm , params:params}, { errorMessageMode: 'message' });

//4.更新状态
export const upLock = (params?: object) =>
defHttp.post({ url: Api.UpLock, params:params}, { errorMessageMode: 'message' });

 
 