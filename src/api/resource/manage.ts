/**
 * 附件
 */
 import { defHttp } from '/@/utils/http/axios';
 import { UploadApiResult } from '../model/uploadModel';
 import { UploadFileParams } from '/#/axios';
 import { useGlobSetting } from '/@/hooks/setting';
 enum Api {
    GetFiles = '/resource/manage/getFiles',
    SaveFile = '/resource/manage/saveFile',
    UploadFile = '/resource/manage/uploadFile',
    DelFile = '/resource/manage/delFile',
    UpFile = '/resource/manage/upFile',
    GetPicture = '/resource/manage/getPicture',
    DelTest = '/resource/manage/delTest',
 }
const globSetting = useGlobSetting();
//保存数据
export const saveFile = (params?: object) =>
defHttp.post({ url: Api.SaveFile, params:params}, { errorMessageMode: 'message' });

//更新附件名称
export const upFile = (params?: object) =>
defHttp.post({ url: Api.UpFile, params:params}, { errorMessageMode: 'message' });

//上传文件
export function uploadFile(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
   return defHttp.uploadFile<UploadApiResult>({url:globSetting.fileuploadUrl+Api.UploadFile,onUploadProgress}, params); 
}

//获取文件列表
export const getFiles = (params) => {
  return defHttp.get({ url: Api.GetFiles,params:params });
};

//获取删除文件
export const delFile = (params?: object) =>
defHttp.delete({ url: Api.DelFile, params:params}, { errorMessageMode: 'message' });

//删除测试
export const delTest = (params?: object) =>
defHttp.delete({ url: Api.DelTest, params:params}, { errorMessageMode: 'message' });

//获取图库分类
export const getPicture = (params) => {
  return defHttp.get({ url: Api.GetPicture,params:params });
};