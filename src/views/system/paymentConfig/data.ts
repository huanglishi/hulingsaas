export interface WXpayItem {
  appId:string;//公众账号ID
  mchID: string;//商户号
  mchAPIv3Key: string;//#商户APIv3密钥
  mchCertificateSerialNumber: string;//#商户证书序列号
  privatekey:string;//商户私钥.pem文件
}
export interface submitPasswordItem {
  show:boolean;//显示
  loading:boolean;//加载样式
  password: string;//密码
  from: string;//来自
  data: object;//数据
}
