/**
 * 产品分类
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/product/label/getList',
    GetFormLabelList = '/product/label/getFormLabelList',
    SaveLabel = '/product/label/saveLabel',
    DelLabel = '/product/label/delLabel',
    UpStatus = '/product/label/upStatus',
 }
 
 
//1.获取列表
export const getList = (params) => {
  return defHttp.get({ url: Api.GetList,params:params });
};
//1.获取表单选择列表
export const getFormLabelList = (params) => {
  return defHttp.get({ url: Api.GetFormLabelList,params:params });
};
//2.保存
export const saveLabel = (params?: object) =>
defHttp.post({ url: Api.SaveLabel, params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const delLabel = (params?: object) =>
defHttp.delete({ url: Api.DelLabel, params:params}, { errorMessageMode: 'message' });

//5.更新状态
export const upStatus = (params: object) =>
defHttp.post({ url: Api.UpStatus, params:params}, { errorMessageMode: 'message' });