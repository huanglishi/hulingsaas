// import { useGlobSetting } from '/@/hooks/setting';
import { useUserStore } from '/@/store/modules/user';
export function ReplaceUrl(url: string) {
   if(url){
      if (url.indexOf('http') > -1) {
          return url
      } else{
        const userStore = useUserStore();
        var rooturl=userStore.getUserInfo 
        return rooturl["rooturl"]+url
      }
   }else{
     return ""
   }
}
//微站连接
export function GetWebLink(text: string) {
  const userStore = useUserStore();
  var rooturl=userStore.getUserInfo 
  let param = encodeURLS(text) // 第二次加密
  return `${rooturl["mwurl"]}web?id=${param}`
}
//加密工具
export function encodeURLS(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(_, p1) {
      return String.fromCharCode( `0x${p1}` );
  }));
}
