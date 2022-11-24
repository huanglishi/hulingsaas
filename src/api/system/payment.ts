/**
 * 系统设置-支付配置
 */
 import { defHttp } from '/@/utils/http/axios';
 import { UploadApiResult } from '../model/uploadModel';
 import { UploadFileParams } from '/#/axios';
 import { useGlobSetting } from '/@/hooks/setting';

 enum Api {
  SavePay = '/system/paymentConfig/savePay',
  GetPayIinfo = '/system/paymentConfig/getPayIinfo',
  UploadFile = '/system/paymentConfig/uploadFile',//上传秘钥用
 }
//1获取数据
export const getPayIinfo = (params) => {
return defHttp.get({ url: Api.GetPayIinfo,params:params });
};
//2.保存支付配置
export const savePay = (params?: object) =>
defHttp.post({ url: Api.SavePay, params:params}, { errorMessageMode: 'message' });

//上传文件
const globSetting = useGlobSetting();
export function uploadFile(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
    return defHttp.uploadFile<UploadApiResult>({url:globSetting.fileuploadUrl+Api.UploadFile,onUploadProgress}, params); 
 }