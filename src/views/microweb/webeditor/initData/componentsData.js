import _ from 'lodash'
import { freeContainerData } from './index.js'

export default [
    {
        type: "常用",
        id: _.uniqueId(),
        components: [
            {
                text: "文本", // 组件名
                icon: "icon-wenben", // icon图标
                componentName: "textComp", // 展示的组件名
                styleComponent: "textCompStyle", // 控制样式的组件名
                id: _.uniqueId(),
                datas: { // 容器内部的组件配置
                    fontSize: 16,
                    color: '#000',
                    url: '',
                    left: 0,
                    top: 0,
                    jumpType: "not",
                    value: '',
                    urlInfo: {
                        pageName: "",
                        pageId: "",
                        url: "",
                    },
                }
            },
            {
                text: "图片",
                icon: "icon-tupian",
                componentName: "imageComp",
                styleComponent: "",
                id: _.uniqueId(),
                datas: { // 容器内部的组件配置
                    height: 100,
                    width: 100,
                    left: 0,
                    top: 0,
                    image: "",
                    alt: "",
                    borderRadius: "0",
                    opacity: 1,
                    graphics: 0,
                    jumpType: "not",
                    urlInfo: {
                        pageName: "",
                        pageId: "",
                        url: "",
                    },
                }
            },
            {
                text: "按钮",
                icon: "icon-xialaanniu",
                componentName: "buttonComp",
                styleComponent: "",
                id: _.uniqueId(),
                datas: { // 容器内部的组件配置
                    height: 65,
                    width: 150,
                    left: 0,
                    top: 0,
                    text: '按钮',
                    textColor: '#fff',
                    fontSize: 16,
                    backgroundColor: '#F56E13',
                    jumpType: "not",
                    urlInfo: {
                        pageName: "",
                        pageId: "",
                        url: "",
                    },
                }
            },
        ],
    },
    {
        type: '基础',
        id: _.uniqueId(),
        components: [
            {
                text: "魔方导航",
                icon: "icon-mofangdaohang",
                componentName: "cubeNavComp",
                styleComponent: "cubeNavCompFlex",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "魔方导航",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    flexComp: 'flex1',
                    navs: []
                }
            },
            {
                text: "图文展示",
                icon: "icon-tuwen",
                componentName: "imgTextComp",
                styleComponent: "imgTextStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "图文展示",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    text: '请输入文本内容',
                    imgUrl: 'https://mo.faisys.com/image/module/richResource/default.jpg',
                    jumpType: 'not', // 跳转方式  not不跳转 interior站内 exterior站外
                    urlInfo: {
                        pageName: '',
                        pageId: '',
                        url: '',
                    }, // 跳转地址信息
                    width: 100,
                    styleClass: 'wrapper-2',
                }
            },
            {
                text: "列表多图",
                icon: "icon-menu_tplb",
                componentName: "imgList",
                styleComponent: "imgListStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "列表多图",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    moduleStyle: {
                        flexUse: 1, // 模块布局
                        columnNum: 1, // 列数
                        imgPosition: 'right', // 图片位置 
                        showImgName: true, // 显示图片名称
                        showImgDetail: true,  // 显示图片描述
                    },
                    imgList: [ // 图片列表信息
                        {
                            imgUrl: 'https://1.s140i.faiusr.com/2/AIwBCAAQAhgAIJv17NUFKPLrqr8BMIAPOIAK!640x640.jpg',
                            jumpType: 'not',
                            urlInfo: {
                                pageName: '',
                                pageId: '',
                                url: ''
                            },
                            name: '名字',
                            detail: "描述",
                            id: _.uniqueId('img_'),
                        },
                    ]
                }
            },
            {
                text: "轮播多图",
                icon: "icon-lunbotuguanli",
                componentName: "swiper",
                styleComponent: "swipeStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "轮播多图",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    flexUse: 1,
                    showImgName: true,
                    showImgDetail: true,
                    imgList: [
                        {
                            id: _.uniqueId('img_'),
                            imgUrl: 'https://1.s140i.faiusr.com/2/AIwBCAAQAhgAIJr17NUFKMCF-r0GMIAPOPcJ.jpg',
                            jumpType: 'not',
                            urlInfo: {
                                pageName: '',
                                pageId: '',
                                url: ''
                            },
                            name: '名字',
                            detail: "描述",
                        }
                    ]
                }
            },
            {
                text: "文章列表",
                icon: "icon-wenzhangliebioa",
                componentName: "essayList",
                styleComponent: "essayListStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "文章列表",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    moduleStyle: 2, // 模块样式
                    imgPosition: 'left', // 题图位置
                    headerstyle: 1, // 头条样式
                    arrangeUse: 1, // 排列方式
                    showAuthor: true, // 显示作者
                    showPublishTime: true, // 显示发布时间
                    showEssayClassify: true, // 显示文章分类
                    showContent: true, // 显示文章摘要
                    essayList: []
                }
            },
            {
                text: "产品展示",
                icon: "icon-chanpin",
                componentName: "productsComp",
                styleComponent: "productsCompStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "产品展示",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    moduleStyle: 1, // 模块样式
                    columnnUum: 1, // 列数
                    showProductName: true, // 是否显示产品名称
                    paramsName: false, // 是否显示参数名称
                    paramsPane: [], // 参数列表
                    productsList: [], // 展示产品列表
                }
            },
            {
                text: "在线表单",
                icon: "icon-biaodan",
                componentName: "onlineForm",
                styleComponent: "onlineFormStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "在线表单",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    formId: '',
                    formName: '',
                    button_text: '',
                    success_tig: '',
                    formData: [],
                }
            },
            {
                text: "在线视频",
                icon: "icon-shipin",
                componentName: "onlineVideo",
                styleComponent: "onlineVideoStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "在线视频",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    videoOrigin: 'local', // 视频来源 local videoUrl
                    videoUrl: "https://mo.faisys.com/image/module/videoResource/Sun.mp4", // 视频地址
                    loop: true, // 是否循环
                    customVideImg: false, // 是否自定义片头图片
                    videoMainImg: 'https://1.s140i.faiusr.com/2/AIwBCAAQAhgAIJv17NUFKPLrqr8BMIAPOIAK.jpg', // 视频片头图默认地址
                    customVideoMainImg: '', // 片头图片自定义地址
                    playUse: 'modal', // 播放方式modal  play
                }
            }
        ]
    },
    {
        type: '排版',
        id: _.uniqueId(),
        components: [
            {
                ..._.cloneDeep(freeContainerData),
                id: _.uniqueId()
            }
        ]
    },
    {
        type: '营销',
        id: _.uniqueId(),
        components: [
            {
                text: "滚动公告",
                icon: "icon-gonggao",
                componentName: "scrollAd",
                styleComponent: "scrollAdStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "滚动公告",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    moduleFlex: 1, // 模块布局
                    color: 'rgb(255,114,20)', // 颜色
                    selectStyle: 1, // 
                    iconStyle: 1, // icon
                    notice: [
                        {
                            content: '请输入公告内容',
                            id: _.uniqueId('ad_'),
                            jumpType: 'not',
                            urlInfo: {
                                pageName: '',
                                pageId: '',
                                url: ''
                            }
                        }
                    ]
                }
            },
        ]
    },
    {
        type: '互动',
        id: _.uniqueId(),
        components: [
            {
                text: "在线地图",
                icon: "icon-ditu",
                componentName: "onlineMap",
                styleComponent: "onlineMapStyle",
                id: _.uniqueId(),
                containerConfig: {
                    selectStyle: 1,
                    title: "在线地图",
                    showTitle: true,
                    color: "rgb(255,114,20)",
                    backgroundColor: "#fff",
                },
                datas: {
                    lng: 102.749989,
                    lat: 25.125831,
                    addressName: "新增地址",
                    address: "昆明市盘龙区德润中心",
                    addressDetail: "昆明市盘龙区德润中心",
                    phone: "",
                    otherInfo: "",
                },
            },
        ]
    }
]