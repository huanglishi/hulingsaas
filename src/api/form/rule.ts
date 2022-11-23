/**
 * 表单规则
 */
 import { defHttp } from '/@/utils/http/axios';
 enum Api {
    GetRuleAndselectData = '/form/rule/getRuleAndselectData',
    SaveRule = '/form/rule/saveRule',
    DelRuleItem = '/form/rule/delRuleItem',
}

//1.获取参数数据
export const getRuleAndselectData = (params) =>defHttp.get({ url: Api.GetRuleAndselectData,params:params });
//2.保存数据
export const saveRule = (params?: object) =>defHttp.post({ url: Api.SaveRule, params:params}, { errorMessageMode: 'message' });
//3.删除
export const delRuleItem = (params?: object) =>defHttp.delete({ url: Api.DelRuleItem, params:params}, { errorMessageMode: 'message' });
