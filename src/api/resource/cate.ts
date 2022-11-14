/**
 * 附件
 */
 import { defHttp } from '/@/utils/http/axios';
 enum Api {
    GetList = '/resource/cate/getList',
    GetParentList = '/resource/cate/getParentList',
    SaveFile = '/resource/cate/saveFile',
    DelFile = '/resource/cate/delFile',
    UpFile = '/resource/cate/upFile',
 }
//获取文件分类
export const getList = (params) => {
  return defHttp.get({ url: Api.GetList,params:params });
};
//获取文件分类-父类
export const getParentList = (params) => {
  return defHttp.get({ url: Api.GetParentList,params:params });
};

//保存数据
export const saveFile = (params?: object) =>
defHttp.post({ url: Api.SaveFile, params:params}, { errorMessageMode: 'message' });

//更新附件名称
export const upFile = (params?: object) =>
defHttp.post({ url: Api.UpFile, params:params}, { errorMessageMode: 'message' });


//获取文件列表
export const delFile = (params?: object) =>
defHttp.delete({ url: Api.DelFile, params:params}, { errorMessageMode: 'message' });
