/**
 * 表单数据
 */
 import { defHttp } from '/@/utils/http/axios';
 enum Api {
    GetFormField = '/form/data/getFormField',
    GetFormDataList = '/form/data/getFormDataList',
    DelData = '/form/data/delData',
}


//1.获取表单字段
export const getFormField = (params) =>defHttp.get({ url: Api.GetFormField,params:params });
//2.获取表单用户填写数据
export const getFormDataList = (params) =>defHttp.get({ url: Api.GetFormDataList,params:params });
//3.删除
export const delData = (params?: object) =>defHttp.delete({ url: Api.DelData, params:params}, { errorMessageMode: 'message' });