/**
 * 会员列表
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/member/manage/getList',
    SaveMember = '/member/manage/saveMember',
    DelMember = '/member/manage/delMember',
    UpLock = '/member/manage/upLock',
 }
 
 
 //1.获取会员列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList,params:params });
 };
//2.保存会员
export const saveMember = (params?: object) =>
defHttp.post({ url: Api.SaveMember, params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const delMember = (params?: object) =>
defHttp.delete({ url: Api.DelMember, params:params}, { errorMessageMode: 'message' });

//4.更新状态
export const upLock = (params?: object) =>
defHttp.post({ url: Api.UpLock, params:params}, { errorMessageMode: 'message' });

 
 