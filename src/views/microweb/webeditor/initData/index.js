import _ from 'lodash';

const footerNavItem = {
    isActive: false, // 是否激活
    icon: 'footerNav.svg', // 默认图标
    activeIcon: 'footerNav.svg', // 选中图标
    navName: '导航项', // 导航名
    jumpType: 'not', // 跳转方式  not不跳转 interior站内 exterior站外
    urlInfo: {
        pageName: '', // 跳转页面名称
        pageId: '',  // 页面id
        url: '', // 最终要跳转的地址
    }, // 跳转地址信息
    id: _.uniqueId('footer-nav')
}

// 底部导航初始数据
const initfooterNav = {
    navBg: '', // 导航背景
    defaultTextColor: '#8c8c8c', // 文字默认颜色
    activeTextColor: '#5874D8', // 选中项文字颜色
    showDividedLine: false, // 是否显示分割线
    dividedLine: '',  // 分割线样式
    navs: [
        _.cloneDeep({
            ...footerNavItem,
            id: _.uniqueId('footer-nav')
        }),
        _.cloneDeep({
            ...footerNavItem,
            id: _.uniqueId('footer-nav')
        }),
        _.cloneDeep({
            ...footerNavItem,
            id: _.uniqueId('footer-nav')
        }),
        _.cloneDeep({
            ...footerNavItem,
            id: _.uniqueId('footer-nav')
        }),
        _.cloneDeep({
            ...footerNavItem,
            id: _.uniqueId('footer-nav')
        }),
    ]
}

// 顶部页头初始数据
const initHeader = {}

const initPageData = {
    name: '新页面',
    details: '页面描述',
    ishome: false,
    orderNum: 1,
    templateJson: {
        backgroundColor: 'rgb(248,248,248)',
        showFooterNav: false,
        backgroundImage: '',
        headerConfig: {
            showHeader: true,
            showLeftBtn: false,
            headerHeight: 40,
            showRightBtn: false,
            rightText: '我的',
            rightTextColor: '#ccc',
            rightTextFontSize: 18,
            backBtnFontSize: 18,
            jumpType: 'not',
            urlInfo: {}
        },
    },
    component: [],
}

// 自由容器数据
const freeContainerData = {
    text: "自由容器",
    icon: "icon-rongqi",
    componentName: "freeContainer",
    styleComponent: "freeContainerStyle",
    id: _.uniqueId(),
    containerConfig: {
        selectStyle: 1,
        title: "自由容器",
        showTitle: true,
        color: "rgb(255,114,20)",
        backgroundColor: "#fff",
    },
    datas: {
        bgMode: 'default',
        defaultBg: '#fff',
        customBg: '#000000',
        bgColor: '#fff',

        heightModel: 'default',
        defaultHeight: 230,
        customHeight: 230,
        height: 230,
        component: []
    }
}

export {
    initPageData,
    initfooterNav,
    initHeader,
    footerNavItem,
    freeContainerData
}