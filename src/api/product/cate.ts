/**
 * 文章分类
 */
 import { defHttp } from '/@/utils/http/axios';

 enum Api {
    GetList = '/product/cate/getList',
    SaveCate = '/product/cate/saveCate',
    GetFormCateList = '/product/cate/getFormCateList',
    DelCate = '/product/cate/delCate',
    UpStatus = '/product/cate/upStatus',
 }
 
 
 //1.获取列表
 export const getList = (params) => {
   return defHttp.get({ url: Api.GetList,params:params });
 };
//2.保存
export const saveCate = (params?: object) =>
defHttp.post({ url: Api.SaveCate, params:params}, { errorMessageMode: 'message' });
 
//3.删除
export const delCate = (params?: object) =>
defHttp.delete({ url: Api.DelCate, params:params}, { errorMessageMode: 'message' });

//4.获取表单选择数据
export const getFormCateList = (params) => {
return defHttp.get({ url: Api.GetFormCateList,params:params });
};
//5.更新状态
export const upStatus = (params: object) =>
defHttp.post({ url: Api.UpStatus, params:params}, { errorMessageMode: 'message' });