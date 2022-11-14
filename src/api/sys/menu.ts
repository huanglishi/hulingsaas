import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/auth/rule/getMenuList',
}


/**
 * @description: Get user menu based on id
 */
/**1.权限菜单 */
export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};