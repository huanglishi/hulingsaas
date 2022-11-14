/**
 * 系统消息
 */
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetList = '/common/message/getList',
  SetRead = '/common/message/setRead',
}

//1获取消息
export const getList = (params) => {
  return defHttp.get({ url: Api.GetList,params:params });
};
//2设为已读
export const setRead = (params?: object) =>
defHttp.post({ url: Api.SetRead, params:params}, { errorMessageMode: 'message' });