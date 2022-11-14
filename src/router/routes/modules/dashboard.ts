import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'dashboard',
  component: LAYOUT,
  redirect: '/home',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.dashboard'),
  },
  // children: [
  //   {
  //     path: 'home',
  //     name: 'home',
  //     component: () => import('/@/views/home/index.vue'),
  //     meta: {
  //       // affix: true,
  //       title: "概况",
  //     },
  //   },
  //   // {
  //   //   path: 'workbench',
  //   //   name: 'Workbench',
  //   //   component: () => import('/@/views/dashboard/workbench/index.vue'),
  //   //   meta: {
  //   //     title: t('routes.dashboard.workbench'),
  //   //   },
  //   // },
  // ],
};

export default dashboard;
