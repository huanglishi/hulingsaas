import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel ,Qrcode,QrcodeData,Qrback,QrbackData} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Getqrcode = '/wechat/login_qrcode?wechatid=1',
  Qrbackdata = '/wechat/qrbackdata',
  Login = '/user/login',
  Logout = '/user/logout',
  GetUserInfo = '/user/userinfo',
  GetPermCode = '/auth/rule/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 获取登录二维码
 */
 export function getQrcode(params:Qrcode) {
  return defHttp.get<QrcodeData>({ url: Api.Getqrcode,params }, { errorMessageMode: 'none'  });
}
/**
 * @description: 获取登录二维码返回
 */
export function getQrbackdata(params:Qrback, mode: ErrorMessageMode = 'none') {
  return defHttp.get<QrbackData>({ url: Api.Qrbackdata,params }, { errorMessageMode: mode  });
}
/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'modal' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
