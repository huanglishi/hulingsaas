export interface GrowCardItem {
  funkey:string;
  icon: string;
  title: string;
  value: number;
  valueprefix: string;
  valuesuffix: string;
  total: number;
  totalfix: string;
  totalsuffix: string;
  color: string;
  action: string;
}

export interface GroupItem {
  id:number;
  name: string;
}
export interface TplItem {
  id:number;
  title: string;
  image: string;
}
//文章
export interface ArticleItem {
  id:number;
  title: string;
  star:number;
}
//文章信息
export interface MicwebItem {
  id:number;
  title: string;
  status:number;
  approval_err: string;
}
