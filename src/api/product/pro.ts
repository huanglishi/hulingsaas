/**
 * 产品参数
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/product/pro/getList',
    SavePro = '/product/pro/savePro',
    DelPro = '/product/pro/delPro',
    UpPro = '/product/pro/upPro',
    UpWeigh = '/product/pro/upWeigh',
 }
 
 
 //1.获取参数数据
 export const getList = (params) =>defHttp.get({ url: Api.GetList,params:params });
 //2.保存数据
 export const savePro = (params?: object) =>defHttp.post({ url: Api.SavePro, params:params}, { errorMessageMode: 'message' });
 //3.删除
 export const delPro = (params?: object) =>defHttp.delete({ url: Api.DelPro, params:params}, { errorMessageMode: 'message' });
 //4.更新状态
 export const upPro = (params?: object) =>defHttp.post({ url: Api.UpPro, params:params}, { errorMessageMode: 'message' });
 //4.更新状态
 export const upWeigh = (params?: object) =>defHttp.post({ url: Api.UpWeigh, params:params}, { errorMessageMode: 'message' });