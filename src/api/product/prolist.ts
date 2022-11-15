/**
 * 产品参数值数据
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/product/prolist/getProlist',
    SavePro = '/product/prolist/saveProlist',
    DelPro = '/product/prolist/delProlist',
    UpPro = '/product/prolist/upProlist',
    UpWeigh = '/product/prolist/upWeighlist',
 }
 
 
 //1.获取参数数据
 export const getProlist = (params) =>defHttp.get({ url: Api.GetList,params:params });
 //2.保存数据
 export const saveProlist = (params?: object) =>defHttp.post({ url: Api.SavePro, params:params}, { errorMessageMode: 'message' });
 //3.删除
 export const delProlist = (params?: object) =>defHttp.delete({ url: Api.DelPro, params:params}, { errorMessageMode: 'message' });
 //4.更新状态
 export const upProlist = (params?: object) =>defHttp.post({ url: Api.UpPro, params:params}, { errorMessageMode: 'message' });
 //4.更新状态
 export const upWeighlist = (params?: object) =>defHttp.post({ url: Api.UpWeigh, params:params}, { errorMessageMode: 'message' });