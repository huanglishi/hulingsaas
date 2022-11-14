import { defHttp } from '/@/utils/http/axios';
import { ParentParams,RebackData }  from '/@/api/model/commonModel';

enum Api {
  GetList = '/microweb/webmain/getList',
  GetGroupList = '/microweb/webmain/getGroupList',
  GetGroupTree = '/microweb/webmain/getGroupTree',
  SaveWebData = '/microweb/webmain/saveWebData',//保存微站
  SavePageData = '/microweb/webmain/savePageData',//保存页面
  SaveAllPageData = '/microweb/webmain/saveAllPageData',//保存全部页面
  Del_url = '/microweb/webmain/del',//删除微站
  UpStatus = '/microweb/webmain/upStatus',//更新微站状态
  DelPage = '/microweb/webmain/delPage',//删除页面
  UpLock = '/microweb/webmain/upLock',
  GetEditData = '/microweb/webmain/getEditData',
  GetGroupData = '/microweb/webmain/getGroupData',
  addTplURL = '/microweb/webmain/addTpl',
  DelTpl= '/microweb/webmain/delTpl',
  AddWebTpl = '/microweb/webmain/addWebTpl',
  DelWebTpl= '/microweb/webmain/delWebTpl',
  GetTpl = '/microweb/webmain/getTpl',
  getTplData = '/microweb/webmain/getTplData',
  ChangHomePage = '/microweb/webmain/changHomePage',
  AddQrTpl = '/microweb/webmain/addQrtpl',
  GetQrTpl = '/microweb/webmain/getQrTpl',
  DelQrTpl = '/microweb/webmain/delQrTpl',
  AddMaterial = '/microweb/webmain/addMaterial',
  GetMaterial = '/microweb/webmain/getMaterial',
  //获取选择模板
  GetSelectTplGroup= '/microweb/webmain/getSelectTplGroup',
  GetSelectTplList= '/microweb/webmain/getSelectTplList',
}


/**1.获取数据列表 */
export const getList = (params?: any) => {
  return defHttp.get({ url: Api.GetList , params:params});
};
//2选择分组子数据
export const getGroupList = (params?: ParentParams) => defHttp.get({ url: Api.GetGroupList, params });
//2.1选择分组-二维
export const getGroupTree = (params?: any) => defHttp.get({ url: Api.GetGroupTree, params });
//3添加微站
export const saveWebData = (params?: object) =>
defHttp.post({ url: Api.SaveWebData, params:params}, { errorMessageMode : 'message' });
//3.1添加页面
export const savePageData = (params?: object) =>
defHttp.post({ url: Api.SavePageData, params:params}, { errorMessageMode : 'message' });
//3.1添加保存全部页面
export const saveAllPageData = (params?: object) =>
defHttp.post({ url: Api.SaveAllPageData, params:params}, { errorMessageMode : 'message' });
//3.2切换页面首页设置
export const changHomePage = (params?: object) =>
defHttp.post({ url: Api.ChangHomePage, params:params}, { errorMessageMode : 'message' });
//3.3更新微站状态
export const upStatus = (params: object) =>
defHttp.post({ url: Api.UpStatus, params:params}, { errorMessageMode: 'message' });
//4删除微站
export const delData = (ids: any) =>
defHttp.delete<RebackData>({ url: Api.Del_url, params:{ids:ids}}, { successMessageMode: 'message' });
//4。1删除页面
export const delPage = (id: any) =>
defHttp.delete<RebackData>({ url: Api.DelPage, params:{id:id}}, { successMessageMode: 'message' });
//5更新状态
export const upLock = (ids?: any,status?:number) =>
defHttp.post({ url: Api.UpLock, params:{ids:ids,status:status}});
/**6.获取单数据 */
export const getEditData = (params?: any) => {
  return defHttp.get({ url: Api.GetEditData , params:params});
};
//7.1.添加单页模板
export const addTpl = (params?: object) =>
defHttp.post({ url: Api.addTplURL, params:params}, { errorMessageMode : 'message' });
//7.2.添加整站模板
export const addWebTpl = (params?: object) =>
defHttp.post({ url: Api.AddWebTpl, params:params}, { errorMessageMode : 'message' });
//8.获取模板
export const getTpl = (params?: any) => {
  return defHttp.get({ url: Api.GetTpl , params:params});
};
//9.使用模板
export const getTplData = (params?: any) => {
  return defHttp.get({ url: Api.getTplData , params:params});
};
//10.1.添加模板
export const addQrTpl = (params?: object) =>
defHttp.post({ url: Api.AddQrTpl, params:params}, { errorMessageMode : 'message' });
//10.2.获取模板
export const getQrTpl = (params?: any) => {
  return defHttp.get({ url: Api.GetQrTpl , params:params});
};
//10.3.删除模板
export const delQrTpl = (params?: any) => {
  return defHttp.delete({ url: Api.DelQrTpl , params:params});
};
//11.1添加素材
export const addMaterial = (params?: object) => {
  return defHttp.post({ url: Api.AddMaterial , params:params});
};
//11.2.获取素材
export const getMaterial = (params?: any) => {
  return defHttp.get({ url: Api.GetMaterial , params:params});
};

//12.1.获取选择模板分类
export const getSelectTplGroup = (params?: any) => {
  return defHttp.get({ url: Api.GetSelectTplGroup , params:params});
};
//12.2.获取选择模板
export const getSelectTplList = (params?: any) => {
  return defHttp.get({ url: Api.GetSelectTplList , params:params});
};
//1删除整模板
export const delWebTpl = (params?: any) => {
  return defHttp.delete({ url: Api.DelWebTpl , params:params});
};
//2删除整模板
export const delTpl = (params?: any) => {
  return defHttp.delete({ url: Api.DelTpl , params:params});
};


