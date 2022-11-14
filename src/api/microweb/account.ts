import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetList = '/microweb/account/getList',
  GetGroupList = '/microweb/account/getGroupList',
  Save_url = '/microweb/account/save',
  Del_url = '/microweb/account/del',
  UpLock = '/microweb/account/upLock',
  //获取全账号
  IsAccountExist = '/microweb/account/isAccountExist',
  GetAccount = '/microweb/account/getAccount',
  GetLoginLogList = '/microweb/account/getLoginLogList',
}


/**1.获取数据列表 */
export const getList = (params?: any) => {
  return defHttp.get({ url: Api.GetList , params:params});
};
//2选择父级数据
export const getGroupList = (params?: ParentParams) => defHttp.get({ url: Api.GetGroupList, params });
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { successMessageMode: 'message',errorMessageMode : 'message' });
//4删除
export const delData = (ids: any) =>
defHttp.delete<RebackData>({ url: Api.Del_url, params:{ids:ids}}, { successMessageMode: 'message' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status}});
//账号
export type RoleParams = {
  roleName?: string;
  status?: string;
};
export interface RoleListItem {
  id: string;
  roleName: string;
  roleValue: string;
}
export type RoleListGetResultModel = RoleListItem[];

//检查账号是否存在
export const isAccountExist = (account: string,id: any) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account,id } }, { errorMessageMode: 'none' });
//获取账号信息
export const getAccount = (id?:any) =>
  defHttp.get({ url: Api.GetAccount,params:{id:id}}, { errorMessageMode: 'none'});
//获取登录操作日志
export const getLoginLogList = (params?: any) =>
  defHttp.get({ url: Api.GetLoginLogList,params:params}, { errorMessageMode: 'message'});


