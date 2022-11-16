/**
 * 表单项
 */
 import { defHttp } from '/@/utils/http/axios';
 enum Api {
  GetItemList = '/form/item/getItemList',
  SaveItem = '/form/item/saveItem',
  DelItem = '/form/item/delItem',
  UpItem = '/form/item/upItem',
  UpRequired = '/form/item/upRequired',
  UpWeigh = '/form/item/upWeigh',
}


//1.获取参数数据
export const getItemList = (params) =>defHttp.get({ url: Api.GetItemList,params:params });
//2.保存数据
export const saveItem = (params?: object) =>defHttp.post({ url: Api.SaveItem, params:params}, { errorMessageMode: 'message' });
//3.删除
export const delItem = (params?: object) =>defHttp.delete({ url: Api.DelItem, params:params}, { errorMessageMode: 'message' });
//4.更新状态
export const upItem = (params?: object) =>defHttp.post({ url: Api.UpItem, params:params}, { errorMessageMode: 'message' });
//5.更新必填状态
export const upRequired = (params?: object) =>defHttp.post({ url: Api.UpRequired, params:params}, { errorMessageMode: 'message' });
//6.更新状态
export const upWeigh = (params?: object) =>defHttp.post({ url: Api.UpWeigh, params:params}, { errorMessageMode: 'message' });
