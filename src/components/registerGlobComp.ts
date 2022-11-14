import type { App } from 'vue';
import { Button } from './Button';
import { Input, Layout } from 'ant-design-vue';
//全局引入vant组件
import Vant from 'vant'
import { s3Layer } from 'vue3-layer';
export function registerGlobComp(app: App) {
  app.component('s3-layer', s3Layer);
  app.use(Input).use(Button).use(Layout).use(Vant);
}
