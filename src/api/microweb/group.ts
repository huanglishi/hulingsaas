import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetList = '/microweb/group/getList',
  ParentList = '/microweb/group/getParentList',
  Save_url = '/microweb/group/save',
  Del_url = '/microweb/group/del',
  UpLock = '/microweb/group/upLock',
  UpGrouppid = '/microweb/group/upGrouppid',
}


/**1.获取数据列表 */
export const getList = () => {
  return defHttp.get({ url: Api.GetList });
};
//2选择父级数据
export const getParentList = (params?: ParentParams) => defHttp.get({ url: Api.ParentList, params });
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { errorMessageMode: 'showmsg' });
//4删除
export const delData = (ids: any) =>
defHttp.delete<RebackData>({ url: Api.Del_url, params:{ids:ids}}, { errorMessageMode: 'showmsg' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status==1?0:1}});
//5修改分组父级
export const upGrouppid = (params?:object) =>
defHttp.post({ url: Api.UpGrouppid, params:params}, { errorMessageMode: 'showmsg' });