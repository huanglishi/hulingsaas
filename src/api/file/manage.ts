/**
 * 附件
 */
 import { defHttp } from '/@/utils/http/axios';
 import { UploadApiResult } from '../model/uploadModel';
 import { UploadFileParams } from '/#/axios';
 import { useGlobSetting } from '/@/hooks/setting';
 enum Api {
    GetFiles = '/file/manage/getFiles',
    SaveFile = '/file/manage/saveFile',
    UploadFile = '/file/manage/uploadFile',
    DelFile = '/file/manage/delFile',
    UpFile = '/file/manage/upFile',
    UpImgPid = '/file/manage/upImgPid',
    GetCateList = '/file/manage/getCateList',
    GetPicture = '/file/manage/getPicture',
 }
 const globSetting = useGlobSetting();
 console.log("上传路径",globSetting.fileuploadUrl)
//保存数据
export const saveFile = (params?: object) =>
defHttp.post({ url: Api.SaveFile, params:params}, { errorMessageMode: 'message' });
//更新附件名称
export const upFile = (params?: object) =>
defHttp.post({ url: Api.UpFile, params:params}, { errorMessageMode: 'message' });
//更新图片目录
export const upImgPid = (params?: object) =>
defHttp.post({ url: Api.UpImgPid, params:params}, { errorMessageMode: 'message' });
//上传文件
export function uploadFile(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
   return defHttp.uploadFile<UploadApiResult>({url:globSetting.fileuploadUrl+Api.UploadFile,onUploadProgress}, params); 
}
//获取文件列表
 export const getFiles = (params) => {
   return defHttp.get({ url: Api.GetFiles,params:params });
 };

//获取文件列表
export const delFile = (params?: object) =>
defHttp.delete({ url: Api.DelFile, params:params}, { errorMessageMode: 'message' });

//获取图库分类
export const getCateList = (params) => {
  return defHttp.get({ url: Api.GetCateList,params:params });
};

//获取图库分类
export const getPicture = (params) => {
  return defHttp.get({ url: Api.GetPicture,params:params });
};