export interface WXpayItem {
  appId:string;//公众账号ID
  mch_id: string;//商户号
  mch_key: string;//#API商户密钥
}
export interface submitPasswordItem {
  show:boolean;//显示
  loading:boolean;//加载样式
  password: string;//密码
  from: string;//来自
  data: object;//数据
}
