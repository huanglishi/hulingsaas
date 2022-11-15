//参数值
export interface ProlistItem {
  id:number;
  pro_id: number;
  value: string;
  weigh: number;
  status: number;
  uuid: string;
  edit: boolean;//是否编辑
}
//参数列表
export interface ProItem {
  id:number;
  type: number;
  weigh: number;
  status: number;
  keyname: string;
  name: string;
  des: string;
  uuid: string;
  edit: boolean;//是否编辑
}
