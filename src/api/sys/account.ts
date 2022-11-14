import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetList = '/system/account/getList',
  ParentList = '/system/account/getParentList',
  Save_url = '/system/account/save',
  Del_url = '/system/account/del',
  UpLock = '/system/account/upLock',
  //获取全账号
  GetAllRoleList = '/system/account/getAllRoleList',
  GetRoleList = '/system/account/getRoleList',
  IsAccountExist = '/system/account/isAccountExist',
  GetAccount = '/system/account/getAccount',
  GetLoginLogList = '/system/account/getLoginLogList',
  //更新用户信息
  UpAvatar = '/system/account/upAvatar',
  ChangePwd = '/system/account/changePwd',
}


/**1.获取数据列表 */
export const getList = (params?: any) => {
  return defHttp.get({ url: Api.GetList , params:params});
};
//2选择父级数据
export const getParentList = (params?: ParentParams) => defHttp.get({ url: Api.ParentList, params });
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { successMessageMode: 'message',errorMessageMode : 'message' });
//更新密码
export const changePwd = (params?: object) =>
defHttp.post({ url: Api.ChangePwd, params:params}, { successMessageMode: 'message',errorMessageMode : 'message' });
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
//获取全部角色
//获取全部角色
export const getAllRoleList = (params?: RoleParams) =>defHttp.get({ url: Api.GetAllRoleList, params });
export const getRoleList = (params?: RoleParams) =>defHttp.get({ url: Api.GetRoleList, params });


//检查账号是否存在
export const isAccountExist = (account: string,id: any) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account,id } }, { errorMessageMode: 'none' });
  //更新头像
export const upAvatar = (url: string) =>
defHttp.post({ url: Api.UpAvatar, params: { url:url } }, { errorMessageMode: 'message' });
//获取账号信息
export const getAccount = (id?:any) =>
  defHttp.get({ url: Api.GetAccount,params:{id:id}}, { errorMessageMode: 'none'});
//获取登录操作日志
export const getLoginLogList = (params?: any) =>
  defHttp.get({ url: Api.GetLoginLogList,params:params}, { errorMessageMode: 'message'});
