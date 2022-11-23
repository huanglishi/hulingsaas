import { defHttp } from '/@/utils/http/axios';

enum Api {
    DelWebTpl= '/microweb/webtpl/delWebTpl',
    //获取选择模板
    GetSelectTplGroup= '/microweb/webtpl/getSelectTplGroup',
    GetSelectTplList= '/microweb/webtpl/getSelectTplList',
}

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