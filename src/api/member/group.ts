/**
 * 会员分类
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/member/group/getList',
    SaveGroup = '/member/group/saveGroup',
    DelGroup = '/member/group/delGroup',
    UpStatus = '/member/group/upStatus',
 }
 
 
 //1.获取列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList,params:params });
 };
//2.保存
export const saveGroup = (params?: object) =>
defHttp.post({ url: Api.SaveGroup, params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const delGroup = (params?: object) =>
defHttp.delete({ url: Api.DelGroup, params:params}, { errorMessageMode: 'message' });

//5.更新状态
export const upStatus = (params: object) =>
defHttp.post({ url: Api.UpStatus, params:params}, { errorMessageMode: 'message' });