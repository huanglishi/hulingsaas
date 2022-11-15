<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ref, nextTick, provide } from 'vue'
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import 'dayjs/locale/zh-cn';
  // support Multi-language
  const { getAntdLocale } = useLocale();
  // Listening to page changes and dynamically changing site titles
  useTitle();
   
 //刷新组件页面
let isRouterAlive = ref(true)
// reload无感刷新事件
const reload = () => {
  isRouterAlive.value = false
  // nextTick：在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide('reload', reload) 
</script>
<style>
    .componentsbox{
        position: relative;
      }
      .p{
        margin: 0px;
        padding: 0px;
      }
      .oldformbox{
        padding: 20px;
      }
</style>