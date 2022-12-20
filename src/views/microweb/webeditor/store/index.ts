import { defineStore } from 'pinia';
import _ from 'lodash';
import { initPageData } from '../initData'
import { ElMessage } from 'element-plus'

const siteData = defineStore('data', {
    state: () => ({
        pageConfig: {}, // 当前编辑的页面
        navList: {}, // 底部导航列表
        pageList: [], // 所有页面列表
        activePageId: '', // 当前页面
        activeComponentId: '', // 编辑中的组件id
        editMode: '', // 编辑模式 page component footerNav nav
        navId: '', // 编辑魔方导航项id
        baseCompId:'', // 图片、按钮、文本id
        micwebInfo: {}, // 站点信息
        editType:'', // 编辑模式
        isInFreeContainer: false, // 是否在自由容器内，用于判断拖拽
        systemPage: {
            activeId: '',
            list: [
                {
                    name: '会员登录',
                    id: _.uniqueId(),
                    component: 'Login',
                },
                {
                    name: '会员注册',
                    id: _.uniqueId(),
                    component: 'Regstry',
                },
                {
                    name: '会员中心',
                    id: _.uniqueId(),
                    component: 'MemberCenter',
                }
            ]
        }, // 系统页面
    }),
    getters: {
        // 当前编辑中的组件列表数据
        getCurPageComponents(state) {
            return state.pageConfig.component;
        },

        // 当前编辑中得页面配置数据
        getCurPageConfig(state) {
            return state.pageConfig
        },

        getActiveComponetId(state) {
            return state.activeComponentId
        }
    },
    actions: {
        // 添加一个默认页面
        addPage() {
            const newPage = _.cloneDeep(initPageData);
            const pageId = _.uniqueId('page_');
            newPage.id = pageId;
            // 如果页面列表为空，则选中新加的页面
            if (_.size(this.pageList) === 0) {
                this.activePageId = pageId;
            }
            this.pageList.push(newPage);
        },

        // 选择魔方导航
        selectMofangNav(datas, compId) {
            const component = _.find(this.pageConfig.component, ['id', compId]);
            component.datas.navs = datas;
        },

        // 编辑魔方导航项
        editMofangNav(navId) {
            this.editMode = 'nav';
            this.navId = navId;
        },

        // 编辑组件
        changeComponent(id) {
            // this.baseCompId = '';
            this.editMode = 'component'
            this.activeComponentId = id;
        },

        // 编辑页面
        editPage(id) {
            this.activeComponentId = ''
            this.editMode = ''
            this.activePageId = id;
        },

        // 编辑底部导航
        editNav() {
            this.editMode = 'footerNav'
            this.activeComponentId = ''
        },

        // 切换选中页面
        changePage(id) {
            this.editMode = 'page'
            this.activePageId = id;
            this.activeComponentId = ''
        },

        // 删除页面
        deletePage(id) {
            if (_.size(this.pageList) <= 1) {
                ElMessage({
                    message: '至少保留一个页面',
                    type: 'warning'
                })
                return
            }
            const pages = _.cloneDeep(this.pageList);
            this.pageList = _.filter(pages, (item) => item.id !== id);
        },

        // 删除组件
        deleteComponent(id) {
            if (id === this.activeComponentId) {
                this.activeComponentId = '';
                this.editMode = '';
            }
            this.pageConfig.component = _.filter(this.pageConfig.component, (item) => item.id !== id)
        },

        // 更新页面中组件的数据
        updatePageComponent(newData) {
            const index = _.findIndex(this.pageList, (item) => item.id === this.activePageId);
            this.pageList[index].componentsList = newData;
        }
    }
})
export {
    siteData
}