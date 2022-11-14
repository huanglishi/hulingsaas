<template>
  <PageWrapper
    :title="`用户资料`"
    content=" "
    contentBackground
    @back="goBack"
  >
    <template #extra>
      <a-button type="primary" @click="goBack"> 返回 </a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="用户资料" />
        <a-tab-pane key="logs" tab="登录日志" />
      </a-tabs>
    </template>
    <div class=" desc-wrap">
      <template v-if="currentKey == 'detail'">
          <Description
            :title="accountinfo['name']"
            :column="3"
            :data="accountinfo"
            :schema="schema"
          />
      </template>
      <template v-if="currentKey == 'logs'">
          <BasicTable @register="registerTable"></BasicTable>
      </template>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref,onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { Tabs } from 'ant-design-vue';
  //表单
  import { Description, DescItem } from '/@/components/Description/index';
  //表格
  import { BasicTable,useTable } from '/@/components/Table';
  import { columns } from './detail.data';
  //请求数据
  import { getLoginLogList ,getAccount} from '/@/api/sys/account';
  const schema: DescItem[] = [
    {
      field: 'nickname',
      label: '昵称',
       render: (_, data) => {
        return `${data.nickname}`;
      },
    },
    {
      field: 'username',
      label: '账号',
      render: (_, data) => {
        return `${data.username}`;
      },
    },
    {
      field: 'telephone',
      label: '联系电话',
      render: (_, data) => {
        return `${data.telephone}`;
      },
    },
    {
      field: 'email',
      label: '邮箱',
       render: (_, data) => {
        return `${data.email}`;
      },
    },
    {
      field: 'remark',
      label: '备注',
      render: (_, data) => {
        return `${data.remark}`;
      },
    },
  ];
  export default defineComponent({
    name: 'AccountDetail',
    components: { PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane,BasicTable ,Description},
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const userId = ref(route.params?.id);
      const currentKey = ref('detail');
      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/system/account');
      }
     // 1.用户详情
      // const accountinfo = ref({});
      // const mockData: Recordable = (async()=>{
      //   var uinfo=(await getAccount(userId.value)) as any;
      //   accountinfo.value=uinfo 
      //   return uinfo
      // })
      const accountinfo = ref({});
      async function Account() {
        var uinfo=(await getAccount(userId.value)) as any;
        const mockData: Recordable =uinfo
        accountinfo.value=mockData 
        // 设置Tab的标题（不会影响页面标题）
        //  const { setTitle } = useTabs();
        // setTitle('详情：用户' +  uinfo["name"]);
      }
      //2获取日志数据
      const [registerTable, {  }] = useTable({
        api: getLoginLogList,
        rowKey: 'id',
        columns,
        searchInfo:{uid:userId.value},
        useSearchForm: false,
        striped: false,
        canResize: false,
      });
      onMounted(() => {
        Account();
      });
      return {schema, userId, currentKey, goBack,registerTable,accountinfo };
    },
  });
</script>

<style></style>
