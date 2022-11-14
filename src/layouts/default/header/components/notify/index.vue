<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in mlist" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList :list="item.list" v-if="item.key === '1'" @title-click="onNoticeClick" />
              <NoticeList :list="item.list" v-else />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import {  ListItem ,TabItem} from './data';
  //API
  import { getList ,setRead} from '/@/api/sys/message';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  // import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      // const { createMessage } = useMessage();
      const mlist=ref<TabItem[]>([]);

      const count = computed(() => {
        let count = 0;
        for (let i = 0; i < mlist.value.length; i++) {
          count += mlist.value[i].list.length;
        }
        return count;
      });
      //获取消息
     
      async function getMesage() {
        const list=await getList({usertype:3})
        let nlist = [{key: '1', name: '通知',list:[]},{key: '2', name: '消息',list:[]},{key: '3', name: '代办',list:[]}];
        for (let i = 0; i < list.items.length; i++) {
          let item=list.items[i];
          if(item.type==1){
            nlist[0].list.push(item);
          }else if(item.type==2){
            nlist[1].list.push(item);
          }else if(item.type==3){
            nlist[2].list.push(item);
          }
        }
        mlist.value=nlist
      }
      getMesage()
      async function onNoticeClick(record: ListItem) {
        if(!record.isread){
          const result=await setRead({ids:record.id})
          if(result){
             // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
            record.isread = !record.isread;
          }
        }
      }

      return {
        prefixCls,
        count,mlist,
        onNoticeClick,
        numberStyle: {},
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
