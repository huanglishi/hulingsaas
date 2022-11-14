import { defHttp } from '/@/utils/http/axios';

enum Api {
  // The address does not exist
  Error = '/system/error/list',
}

/**
 * @description: Trigger ajax error
 */

export const fireErrorApi = () => defHttp.get({ url: Api.Error });
