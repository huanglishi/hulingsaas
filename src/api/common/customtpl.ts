/**
 * 提交模板需求
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetCustomtpl = '/home/micwebtpl/getCustomtpl',
    SaveCustom = '/home/micwebtpl/saveCustom',
 }
 
//1.获取列表
export const getList = (params) => {
   return defHttp.get({ url: Api.GetCustomtpl,params:params });
};
//2.提交需求
export const saveData = (params?: object) =>
defHttp.post({ url: Api.SaveCustom, params:params}, { errorMessageMode: 'message',isTransformResponse:false });