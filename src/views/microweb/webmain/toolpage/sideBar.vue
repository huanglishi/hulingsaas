<template>
   <div class="side-bar">
    <a-tabs v-model:activeKey="activeKey" tab-position="left" :style="{ width: '100%' }"  @change="handeleChange">
        <a-tab-pane :key="1" :style="{ padding: '8px 4px' }">
            <template #tab>
            <div class="item">
                <Icon class="icon" icon="ant-design:highlight-outlined" :size="30" />
                <div class="text">基础</div>
            </div>
            </template>
        </a-tab-pane>
        <a-tab-pane :key="2">
            <template #tab>
            <div class="item">
                <Icon class="icon" icon="ant-design:play-circle-outlined" :size="30" />
                <div class="text">媒体</div>
            </div>
            </template>
        </a-tab-pane>
        <a-tab-pane :key="3">
            <template #tab>
            <div class="item">
                <Icon class="icon" icon="ic:baseline-dashboard-customize" :size="30" />
                <div class="text">业务</div>
            </div>
            </template>
        </a-tab-pane>
        <a-tab-pane :key="4">
            <template #tab>
            <div class="item">
                <Icon class="icon" icon="mdi:google-photos" :size="30" />
                <div class="text">素材</div>
            </div>
            </template>
        </a-tab-pane>
        <a-tab-pane :key="5">
            <template #tab>
            <div class="item">
                <Icon class="icon" icon="icon-park-outline:page-template" :size="30" />
                <div class="text">模板</div>
            </div>
            </template>
        </a-tab-pane>
        <a-tab-pane :key="6" >
            <template #tab>
            <div class="item">
                <Icon class="icon" icon="iconoir:multiple-pages" :size="30" />
                <div class="text">页面</div>
            </div>
            </template>
        </a-tab-pane>
    </a-tabs>
    </div>
</template>
<script >
  import { defineComponent,ref} from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  export default defineComponent({
    name: 'sideBar',
    components: {ATabs: Tabs, ATabPane: Tabs.TabPane,Icon  },
    emits: ['change'],//在emits选项中声明
    setup(_, { emit }) {
        // 默认基础
        const activeKey = ref(1)
        function handeleChange(activeKey) {
            emit('change', activeKey);
        }
        return {
            activeKey,
            handeleChange
        };
    },
  });
</script>
<style lang="less" scoped>
/* 侧边栏 */
    .side-bar {
      width: 75px;
      height: 100%;
      border-right: 1px solid #ebedf0;
      background: #fff;
      box-sizing: border-box;
      padding-top: 32px;
      .item{
        .text{
          width: 100%;
          text-align: left;
          font-weight: 500;
          font-size: 14px;
          user-select: none;
        }
      }
    }
</style>
