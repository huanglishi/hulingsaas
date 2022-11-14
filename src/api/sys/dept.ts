import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetDeptList = '/system/dept/getDeptList',
  ParentList = '/system/dept/getParentList',
  Save_url = '/system/dept/save',
  Del_url = '/system/dept/del',
  UpLock = '/system/dept/upLock',
  UpGrouppid = '/system/dept/upGrouppid',
}


/**1.获取数据列表 */
export const getDeptList = () => {
  return defHttp.get({ url: Api.GetDeptList });
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

//6修改父级
export const upGrouppid = (params?:object) =>
defHttp.post({ url: Api.UpGrouppid, params:params}, { errorMessageMode: 'showmsg' });