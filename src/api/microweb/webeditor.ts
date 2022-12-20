import { defHttp } from '/@/utils/http/axios';

enum Api {
    GetArticleList = '/microweb/webedit/getArticleList',
    getArtic = '/microweb/webedit/getArtic',
    getProductList = '/microweb/webedit/getProductList',
    getFormList = '/microweb/webedit/getFormList',
    getFormField = '/microweb/webedit/getFormField',
    getMicweb = '/microweb/webedit/getMicweb',
    saveMicwebPabe = '/microweb/webedit/saveMicwebPabe',
    saveFooterTabBar = '/microweb/webedit/saveFooterTabBar',
    getMicwebPage = '/microweb/webedit/getMicwebPage',
    delMicwebPage = '/microweb/webedit/delMicwebPage',
    delAddress = '/microweb/webedit/delAddress',
    saveAddress = '/microweb/webedit/saveAddress',
    getAddress = '/microweb/webedit/getAddress',
    getAddressList = '/microweb/webedit/getAddressList',
    upPageIshome = '/microweb/webedit/upPageIshome',
    getArticleCate = '/microweb/webedit/getArticleCate',
    getProduct = '/microweb/webedit/getProduct',
    getServiceList = '/microweb/webedit/getServiceList',
    saveService = '/microweb/webedit/saveService',
    delService = '/microweb/webedit/delService',
    getTplPageGroup = '/microweb/webedit/getTplPageGroup',
    saveTplpage = '/microweb/webedit/saveTplpage',
    getTplpage = '/microweb/webedit/getTplpage',
    getTplGroup = '/microweb/webedit/getTplGroup',
    saveWebTpl = '/microweb/webedit/saveWebTpl',
    delTplpage = '/microweb/webedit/delTplpage',
    getWebTpl = '/microweb/webedit/getWebTpl'
}

//1.关键词查找文章
export const getEssayList = (params) =>
    defHttp.get({ url: Api.GetArticleList, params });
// 2.文章详情
export const getEssayDetailById = (params) =>
    defHttp.get({ url: Api.getArtic, params });
// 3.获取产品列表
export const getProductList = (params) =>
    defHttp.get({ url: Api.getProductList, params });
// 4.获取配置好的表单
export const getFormList = () =>
    defHttp.get({ url: Api.getFormList });
// 5.获取单个表单配置
export const getFormField = (params) => defHttp.get({ url: Api.getFormField, params });
// 6.获取微站信息
export const getMicweb = (params) => defHttp.get({ url: Api.getMicweb, params });
// 8.保存底部导航信息
export const saveFooterTabBar = (params) => defHttp.post({ url: Api.saveFooterTabBar, params });
// 7.保存页面数据
export const saveMicwebPabe = (params) => defHttp.post({ url: Api.saveMicwebPabe, params });
// 9.获取页面数据
export const getMicwebPage = (params) => defHttp.get({ url: Api.getMicwebPage, params });
// 10.删除页面
export const deletePage = (params) => defHttp.delete({ url: Api.delMicwebPage, params });
// 11.获取地址列表
export const getAddressList = () => defHttp.get({ url: Api.getAddressList });
// 12.添加(编辑地址)
export const saveAddress = (params) => defHttp.post({ url: Api.saveAddress, params });
// 13.删除地址
export const delAddress = (params) => defHttp.delete({ url: Api.delAddress, params });
// 14.获取地址详情
export const getAddress = (params) => defHttp.get({ url: Api.getAddress, params });
// 15.更新首页
export const upPageIshome = (params) => defHttp.post({ url: Api.upPageIshome, params });
// 16.产品详情
export const getProduct = (params) => defHttp.get({ url: Api.getProduct, params })
// 17.获取客服列表
export const getServiceList = (params) => defHttp.get({ url: Api.getServiceList, params });
// 18.保存（编辑）客服
export const saveService = (params) => defHttp.post({ url: Api.saveService, params });
// 19.删除客服
export const delService = (params) => defHttp.delete({ url: Api.delService, params });
// 20.单页模板-获取分类
export const getTplPageGroup = (params) => defHttp.get({ url: Api.getTplPageGroup, params });
// 21.单页模板-添加单页模板
export const saveTplpage = (params) => defHttp.post({ url: Api.saveTplpage, params });
// 22.单页模板-获取单页模板
export const getTplpage = (params) => defHttp.get({ url: Api.getTplpage, params });
// 23.获取站点分类
export const getTplGroup = () => defHttp.get({ url: Api.getTplGroup });
// 24.添加站点模板
export const saveWebTpl = (params) => defHttp.post({ url: Api.saveWebTpl, params });
// 25.删除单页模板
export const delTplpage = (params) => defHttp.delete({ url: Api.delTplpage, params });
// 26.获取保存的整站数据
export const getWebTpl = (params) => defHttp.get({ url: Api.getWebTpl, params });