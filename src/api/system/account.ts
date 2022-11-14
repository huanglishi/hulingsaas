/**
 * 系统设置-账户配置
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetUserInfo = '/user/getUserData',
    UpUserInfo = '/user/upUserInfo',
    UpAvatar = '/user/upAvatar',
    ChangePwd = '/user/changePwd',
 }
/**
 * @description: 1获取数据
 */
 export function getUserInfo() {
    return defHttp.get({ url: Api.GetUserInfo }, { errorMessageMode: 'modal' });
  }
  
//2.更新用户数据
export const upUserInfo = (params?: object) =>
defHttp.post({ url: Api.UpUserInfo, params:params}, { errorMessageMode: 'message' });

//3.更新头像
export const upAvatar = (url: string) =>
defHttp.post({ url: Api.UpAvatar, params: { url:url } }, { errorMessageMode: 'message' });
//更新密码
export const changePwd = (params?: object) =>
defHttp.post({ url: Api.ChangePwd, params:params}, { errorMessageMode : 'message' });