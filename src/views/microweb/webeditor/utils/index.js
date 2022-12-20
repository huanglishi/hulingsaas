import _ from 'lodash'
// 格式化导入组件
const importComponent = (files) => {
    const utilFuns = {};
    Object.keys(files).forEach(key => {
        const nameArr = key.split('/');
        utilFuns[_.nth(nameArr, -2)] = files[key].default
    })
    return utilFuns
}

// 处理跳转方式
const disposeJump = ({ jumpType, urlInfo: { pageName, pageId, url } }) => {
    switch (jumpType) {
        case '':
        case 'not':
            return 'javascript:;';
        case 'interior':
            return `${location.origin}/?page=${pageId}`
        default:
            return url
    }
}

// 解析路由参数
const parseUrlParams = (href) => {
    let params = {};
    const arr = href.split("&");
    arr.reduce((pre, val) => {
        console.log(pre, val);
        const keyVal = val.split("=");
        pre[keyVal[0]] = keyVal[1];
        return pre;
    }, params);
    return params;
};

export {
    importComponent,
    disposeJump,
    parseUrlParams
}