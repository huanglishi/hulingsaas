import type { ProjectConfig } from '/#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/enums/appEnum';
import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting';
import { primaryColor } from '../../build/config/themeConfig';

// ! 改动后需要清空浏览器缓存
const setting: ProjectConfig = {
   // 是否显示SettingButton
  // Whether to show the configuration button
  showSettingButton: true,

  // 是否显示主题切换按钮
  // Whether to show the theme switch button
  showDarkModeToggle: true,

  // 设置按钮位置 可选项
  // SettingButtonPositionEnum.AUTO: 自动选择
  // SettingButtonPositionEnum.HEADER: 位于头部
  // SettingButtonPositionEnum.FIXED: 固定在右侧
  // `Settings` button position
  settingButtonPosition: SettingButtonPositionEnum.AUTO,
  // 权限模式,默认前端角色权限模式
  // ROUTE_MAPPING: 前端模式（菜单由路由生成，默认）
  // ROLE：前端模式（菜单路由分开）
  // BACK 后端
  // Permission mode
  permissionMode: PermissionModeEnum.BACK,
  // 权限缓存存放位置。默认存放于localStorage
  // Permission-related cache is stored in sessionStorage or localStorage
  permissionCacheType: CacheTypeEnum.LOCAL,
   // 会话超时处理方案
  // SessionTimeoutProcessingEnum.ROUTE_JUMP: 路由跳转到登录页
  // SessionTimeoutProcessingEnum.PAGE_COVERAGE: 生成登录弹窗，覆盖当前页面
  // Session timeout processing
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,
  // 项目主题色
  // color
  themeColor: primaryColor,
  // 网站灰色模式，用于可能悼念的日期开启
  // Website gray mode, open for possible mourning dates
  grayMode: false,
  //  色弱模式
  // Color Weakness Mode
  colorWeak: false,
  // 是否取消菜单,顶部,多标签页显示, 用于可能内嵌在别的系统内度
  // Whether to cancel the menu, the top, the multi-tab page display, for possible embedded in other systems
  fullContent: false,
  // 主题内容宽度
  // content mode
  contentMode: ContentEnum.FULL,
  // 是否显示logo
  // Whether to display the logo
  showLogo: true,
  // 是否显示底部信息 copyright
  // Whether to show footer
  showFooter: false,

  // 头部配置
  // Header configuration
  headerSetting: {
    // header bg color 背景色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // Fixed at the top  固定头部
    fixed: true,
    // Whether to show top是否显示顶部
    show: true,
    // theme 主题
    theme: ThemeEnum.LIGHT,
    // Whether to enable the lock screen function  开启锁屏功能
    useLockPage: true,
    // Whether to show the full screen button 显示全屏按钮
    showFullScreen: true, 
    // Whether to show the document button 显示文档按钮
    showDoc: false,
    // Whether to show the notification button 显示消息中心按钮
    showNotice: true,
    // Whether to display the menu search 显示菜单搜索按钮
    showSearch: true,
  },

  // Menu configuration《菜单配置》
  menuSetting: {
    // sidebar menu bg color 背景色
    bgColor: SIDE_BAR_BG_COLOR_LIST[3],
    //  Whether to fix the left menu 是否固定住菜单
    fixed: true,
    // Menu collapse  菜单折叠
    collapsed: false,
    // When sider hide because of the responsive layout  当侧板因响应布局而隐藏时
    siderHidden: false,
    // Whether to display the menu name when folding the menu 折叠菜单时候是否显示菜单名
    collapsedShowTitle: false, 
    // Whether it can be dragged 是否可拖拽
    // Only limited to the opening of the left menu, the mouse has a drag bar on the right side of the menu
    canDrag: false,
    // Whether to show no dom 是否显示
    show: true,
    // Whether to show dom
    hidden: false,
    // Menu width 菜单宽度
    menuWidth: 130, 
    // Menu mode 菜单模式
    mode: MenuModeEnum.INLINE,
    // Menu type 菜单类型
    type: MenuTypeEnum.MIX_SIDEBAR,
    // Menu theme 菜单主题
    theme: ThemeEnum.DARK,
    // Split menu 分割菜单
    split: false,
    // Top menu layout 顶部菜单布局 center
    topMenuAlign: 'start',
    // Fold trigger position 折叠触发器的位置
    trigger: TriggerEnum.HEADER,
    // Turn on accordion mode, only show a menu 手风琴模式，只展示一个菜单
    accordion: true,
    // Switch page to close menu 在路由切换的时候关闭左侧混合菜单展开菜单
    closeMixSidebarOnChange: false,
    // Module opening method ‘click’ |'hover'  左侧混合菜单模块切换触发方式
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // Fixed expanded menu 是否固定左侧混合菜单
    mixSideFixed: true,
  },

  // Multi-label 《多标签》
  multiTabsSetting: {
     // 刷新后是否保留已经打开的标签页
    cache: false,
    // Turn on  开启
    show: false,
    // Is it possible to drag and drop sorting tabs  是否可以拖拽
    canDrag: true, 
    // Turn on quick actions 开启快速操作
    showQuick: true,
    // Whether to show the refresh button  是否显示刷新那妞
    showRedo: true,
    // Whether to show the collapse button  是否显示折叠按钮
    showFold: true,
  },

  // Transition Setting  动画配置
  transitionSetting: {
    //  Whether to open the page switching animation 是否开启切换动画
    // The disabled state will also disable pageLoading
    enable: false,

    // Route basic switching animation  动画名
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // Whether to open page switching loading  是否打开页面切换loading
    // Only open when enable=true
    openPageLoading: true,

    // Whether to open the top progress bar 是否打开页面切换顶部进度条
    openNProgress: false,
  },

   // 是否开启KeepAlive缓存  开发时候最好关闭,不然每次都需要清除缓存
  // Whether to enable KeepAlive cache is best to close during development, otherwise the cache needs to be cleared every time
  openKeepAlive: true,

  // 自动锁屏时间，为0不锁屏。 单位分钟 默认1个小时
  // Automatic screen lock time, 0 does not lock the screen. Unit minute default 0
  lockTime: 0,

  // 显示面包屑
  // Whether to show breadcrumbs
  showBreadCrumb: false,
 
   // 显示面包屑图标
  // Whether to show the breadcrumb icon
  showBreadCrumbIcon: false,

  // Use error-handler-plugin 是否使用全局错误捕获
  useErrorHandle: false,

  // Whether to open back to top 是否开启回到顶部
  useOpenBackTop: true,

  //  Is it possible to embed iframe pages 是否可以嵌入iframe页面
  canEmbedIFramePage: true,
  
  // 切换界面的时候是否删除未关闭的message及notify
  // Whether to delete unclosed messages and notify when switching the interface
  closeMessageOnSwitch: true,

  // 切换界面的时候是否取消已经发送但是未响应的http请求。
  // 如果开启,想对单独接口覆盖。可以在单独接口设置
  // Whether to cancel the http request that has been sent but not responded when switching the interface.
  // If it is enabled, I want to overwrite a single interface. Can be set in a separate interface
  removeAllHttpPending: false,
};

export default setting;
