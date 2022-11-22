/**
 * 测试分类
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/system/apitest/getGroupList',
    SaveGroup = '/system/apitest/saveGroup',
    GetFormGroupist = '/system/apitest/getFormGroupList',
    DelGroup = '/system/apitest/delGroup',
    UpStatus = '/system/apitest/upStatus',
 }
 
 
 //1.获取列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList,params:{...params,type:"client"} });
 };
//2.保存
export const saveGroup = (params?: object) =>
defHttp.post({ url: Api.SaveGroup, params:{...params,type:"client"}}, { errorMessageMode: 'message' });
 
//3.删除
export const delGroup = (params?: object) =>
defHttp.delete({ url: Api.DelGroup, params:params}, { errorMessageMode: 'message' });

//4.获取表单选择数据
export const getFormGroupList = (params) => {
return defHttp.get({ url: Api.GetFormGroupist,params:{...params,type:"client"} });
};
//5.更新状态
export const upStatus = (params: object) =>
defHttp.post({ url: Api.UpStatus, params:params}, { errorMessageMode: 'message' });