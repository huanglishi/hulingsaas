import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.globEager('./modules/**/*.ts');
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};
// 根路由
export const dashboardAnalysis: AppRouteRecordRaw = {
  path: '/dashboard/analysis',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};
// 根路由
export const Dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};
//登录
export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};
//轻站编辑器
export const webeditor: AppRouteRecordRaw = {
  path: '/webeditor',
  name: 'webeditor',
  component: () => import('/@/views/microweb/webeditor/index.vue'),
  meta: {
    title: "轻站编辑器",
  },
};
//轻站编辑器-旧版本
export const oldditor: AppRouteRecordRaw = {
  path: '/oldditor',
  name: 'oldditor',
  component: () => import('/@/views/microweb/webmain/webEditor.vue'),
  meta: {
    title: "旧版编辑器",
  },
};

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  webeditor,oldditor,
  LoginRoute,
  RootRoute,Dashboard,
  dashboardAnalysis,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
