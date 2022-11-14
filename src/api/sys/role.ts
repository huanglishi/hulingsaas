import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetList = '/system/role/getList',
  ParentList = '/system/role/getParentList',
  Save_url = '/system/role/save',
  Del_url = '/system/role/del',
  UpLock = '/system/role/upLock',
  MenuList = '/system/role/getMenuList',
}


/**1.获取数据列表 */
export const getList = () => {
  return defHttp.get({ url: Api.GetList });
};
//2选择父级数据
export const getParentList = (params?: ParentParams) => defHttp.get({ url: Api.ParentList, params });
//3添加
export const saveData = (params?: object) =>
defHttp.post({ url: Api.Save_url, params:params}, { successMessageMode: 'message',errorMessageMode : 'message' });
//4删除
export const delData = (ids: any) =>
defHttp.delete<RebackData>({ url: Api.Del_url, params:{ids:ids}}, { successMessageMode: 'message' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status}});
//6获取菜单
export const getMenuList = (params?: ParentParams) => defHttp.get({ url: Api.MenuList, params });