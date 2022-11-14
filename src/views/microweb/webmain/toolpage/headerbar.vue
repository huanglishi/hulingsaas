<template>
    <section class="buttons">
      <div class="btnline">
        <div class="pagelist">
          <div class="pagebtn">
            <Tabs
                :tab-position="'top'"
                :style="{ height: '100%',width: '100%',marginTop:'5px' }"
                :tabBarStyle="{userSelect:'none' }"
                v-model:activeKey="activeKeyS"
                type="editable-card"
                :destroyInactiveTabPane="true"
                :animated="true"
                @edit="onEditPageList"
                @change="changePageList"
              >
                <TabPane v-for="item in pageList" :key="item.pageSetup.uuid" :closable="pageList.length>1" :tab="item.pageSetup.name" >
                  <template #closeIcon>
                    <a-tooltip placement="bottomRight">
                       <template #title>
                        <span>删除页面</span>
                      </template>
                      <Icon icon="mi:delete" :size="18" ></Icon>
                    </a-tooltip>
                  </template>
                </TabPane>
              </Tabs>
            <!-- <a-button type="primary" shape="circle" ><Icon icon="material-symbols:add" :size="20" /></a-button> -->
          </div>
        </div>
        <div class="funbtn">
          <a-button @click="resetPage" color="error"> 清空 </a-button>
          <a-button @click="preview" type="default" preIcon="icon-park-outline:preview-open"> 预览 </a-button>
          <a-popconfirm placement="bottomRight" ok-text="关闭" :showCancel="false" :visible="visibleMvbox" @confirm="closeMobileview">
            <template #icon><Icon icon="iconoir:scanning" :size="20" /></template>
            <template #title>
              <div class="mobileview">
                <div class="htitle">手机扫一扫真机测试</div>
                <div class="realqrcode">
                  <div class="left">
                    <QrCode
                      :value="siteqrCodeUrl"
                      class="enter-x flex justify-center xl:justify-start"
                      :width="200"
                      :options="{
                        color: { 
                          dark: '#00BABDFF',
                        },
                      }"
                    />
                    <div class="title">整站预览<a-button  @click="copyLink(siteqrCodeUrl)" type="link"> 复制链接 </a-button></div>
                  </div>
                  <div class="right">
                    <QrCode
                      :value="webqrCodeUrl"
                      class="enter-x flex justify-center xl:justify-start"
                      :width="200"
                    />
                    <div class="title">当前页面预览<a-button  @click="copyLink(webqrCodeUrl)" type="link"> 复制链接 </a-button></div>
                  </div>
                </div>
              </div>
            </template>
            <a-button ghost color="success" :loading="qrLoading" :preIcon="(!qrLoading?'teenyicons:mobile-outline':'')" @click="mvsave">
              真机 
            </a-button>
          </a-popconfirm>
          <a-button color="success" @click="save" preIcon="mdi:content-save"> 保存 </a-button>
          <a-button type="primary"  @click="finish" preIcon="line-md:telegram"> 发布 </a-button>
          <a-button @click="saveTpl" ghost color="warning" preIcon="lucide:layout-template"> 存为模板 </a-button>
          <a-button @click="selectWebTpl" ghost color="success" > 选用模板 </a-button>
          <a-button @click="closeEditor" preIcon="ion:arrow-return-left"> 返回 </a-button>
          <a-button type="primary" ghost @click="editWebPage" preIcon="ri:file-edit-fill">编辑轻站</a-button>
        </div>
      </div>
    </section>
</template>
<script >
  
  import { ref,unref,defineComponent,reactive,watch} from 'vue';
  import { Popconfirm ,Tabs,Tooltip} from 'ant-design-vue';
  import { Icon } from '/@/components/Icon/index';
  import { QrCode } from '/@/components/Qrcode/index';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    name: 'headerbar',
    components: { APopconfirm:Popconfirm,Icon,QrCode ,Tabs,TabPane:Tabs.TabPane,[Tooltip.name]:Tooltip},
    emits: ['preview',"resetPage","save","finish",'mvsave',"closeEditor","saveTpl","editWebPage","editPage","changePage","selectWebTpl"],
    props: {//数据
      pageList: Object,
      activePageKey: String
    },
    setup(props, { emit }) {
    //变量
    const siteqrCodeUrl=ref("")//整个站点页面
    const webqrCodeUrl=ref("")//当前页面
    const visibleMvbox=ref(false);
    const qrLoading=ref(false);
    const activeKeyS=ref(props.activePageKey);
    const { createMessage } = useMessage();
    const { clipboardRef, copiedRef } = useCopyToClipboard();
    //页面
    watch(
        () => props.activePageKey,
        (newval) => {
          activeKeyS.value =newval
        }
      )
    //切换面板的回
    function changePageList(activeKey) {
      emit('changePage', activeKey);
    }
    //预览
    function preview() {
      emit('preview', true);
    }
    // 重置
    const resetPage = () => {
       emit('resetPage');
    }
    // 保存
    const save = () => {
      emit('save');
    }
    // 完成
    const finish = () => {
      emit('finish');
    }
    // 真机测试前先保存
    const mvsave = () => {
      qrLoading.value=true
      emit('mvsave');
    }
    // 选择模板
    const selectWebTpl = () => {
      emit('selectWebTpl');
    }
    // 存为模板
    const saveTpl = () => {
      emit('saveTpl');
    }
    // 关闭编辑器
    const closeEditor = () => {
      emit('closeEditor');
    }
    // 编辑轻站页面
    const editWebPage = () => {
      emit('editWebPage');
    }
    //新增页面
    const onEditPageList = (targetKey, action) => {
      emit('editPage',{targetKey, action});
    }
    // 复制访问地址
    const copyLink = (value) => {
        if (!value) {
          createMessage.warning('要拷贝的内容为空！');
          return;
        }
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          createMessage.success({ content: '复制成功！', key:"webcopyLink",duration:2});
        }
    }
    // 关闭扫码
    const closeMobileview = () => {
      visibleMvbox.value = false;
    }
    function encodeURLS(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }
    //父页面回调显示扫码
    const userStore = useUserStore();
    const mwurl = ref(userStore.getUserInfo?.mwurl || '');
    const showQrcode= (siteid,webid) => {
      siteid  = encodeURLS(siteid) // 加密
      webid  = encodeURLS(webid) // 加密
      siteqrCodeUrl.value=`${unref(mwurl)}web?id=${siteid}`
      webqrCodeUrl.value=`${unref(mwurl)}web?id=${webid}`
      visibleMvbox.value=true
      qrLoading.value=false
    }
    return {
        resetPage,preview,save,finish,mvsave,closeEditor,saveTpl,editWebPage,onEditPageList,
        siteqrCodeUrl,webqrCodeUrl,showQrcode,closeMobileview,copyLink,
        visibleMvbox,qrLoading,changePageList,activeKeyS,selectWebTpl,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-top > .ant-tabs-nav::before){
    border-bottom: 0px solid #f0f0f0;
  }
  :deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-add){
    min-height: 40px;
  }
/* 按钮集合 */
.buttons {
  width:100% ;
  height: 46px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
  box-sizing: border-box;
  overflow-x: auto;
  .btnline{
       width: 100%;
       height:  100%;
       display: flex;
       justify-content: space-between;
      align-items: center;
      white-space:nowrap;
      .pagelist{
      padding: 0px;
      margin: 0px;
      height:  100%;
      width: -moz-calc(100% - 750px);
      width: -webkit-calc(100% - 750px);
      width: calc(100% - 750px);
      border-right: 1px solid #ebedf0;
      .pagebtn {
        height:  100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
    }
    .funbtn{
      height:  100%;
      width: 835px;
      padding: 0px;
      margin: 0px;
      white-space:nowrap;//不换行
      display: flex;
      justify-content: end;
      align-items: center;
      padding-right: 10px;
      .ant-btn {
        font-size: 14px;
        height: 30px;
        margin-left: 5px;
      }
    }
  }
}
.mobileview{
  .htitle{
    font-size: 15px;
    font-weight: 700;
    padding-left: 5px;
    padding-top: 3px;
  }
  .realqrcode{

    display: flex;
    .left{
      flex: 1;
    } 
    .right{
      flex: 1;
      padding-left: 15px;
    }
    .title{
      text-align: center;
      font-weight: 600;
    }
  }
}
:deep(.ant-tabs-tab-remove){
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
