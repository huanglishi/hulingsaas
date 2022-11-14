import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { DemoParams, DemoListGetResultModel } from './model/tableModel';

enum Api {
  uploadUrl = '/common/uploadfile/onefile',
  GetCateList = '/common/attachment/getList',
  AddCate = '/common/attachment/addCate',
  delCate = '/common/attachment/delCate',
  GetImgList = '/common/attachment/getImgList',
  Delurl = '/common/attachment/delfile',
  Upurl = '/common/attachment/upfile',
}

/**
 * 上传附件接口
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: Api.uploadUrl,
      onUploadProgress,
    },
    params,
  );
}
//删除
export const delApi = (id:number) =>
defHttp.delete({ url: Api.Delurl, params:{id:id}}, { errorMessageMode: 'showmsg' });
//更新附件
export const updateApi = (params) =>
defHttp.post({ url: Api.Upurl, params:params}, { errorMessageMode: 'showmsg' });
/**附件分类 */
//1获取附件分类列表
export const getCateList = (params) => {
  return defHttp.get({ url: Api.GetCateList , params:params});
};
//2添加分类
export const AddCate = (params?: object) =>
defHttp.post({ url: Api.AddCate, params:params}, { errorMessageMode: 'showmsg' });
//3删除分类
export const delCate = (id: any) =>
defHttp.delete({ url: Api.delCate, params:{id:id}}, { errorMessageMode: 'showmsg' });
//3获取附件列表
// export const getImgList = (params) => {
//   return defHttp.get({ url: Api.GetImgList , params:params});
// };
export const getImgList = (params: DemoParams) =>
  defHttp.get<DemoListGetResultModel>({
    url: Api.GetImgList,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });

