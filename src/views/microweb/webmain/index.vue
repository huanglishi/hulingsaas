<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" ref="cateTreeRef" @select="handleSelect" @openGroup="openGroup" v-bind:style="{'max-width':'230px'}"/>
    <BasicTable @register="registerTable" class="w-3/4 xl:w-5/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" v-auth="'100'" :disabled="ishasepack" preIcon="heroicons-solid:template" @click="handelSelectTemplate">选择模板建站</a-button>
        <a-button type="primary" v-auth="'100'" :disabled="ishasepack" preIcon="ant-design:plus-outlined" @click="handleCreate">直接新建</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tooltip placement="rightTop" >
              <template #title>
                <span>{{statusFont(record.status,'tig')}}</span>
              </template>
              <Tag :color="statusFont(record.status,'color')" @click="onPublish(record.status,record.title,record.id)" :style="{userSelect:'none',cursor:record.status==0?'pointer':'default'}">
                <template #icon>
                  <sync-outlined v-if="record.status==0" :spin="true" />
                  <clock-circle-outlined v-else-if="record.status==1" :spin="true"/>
                  <check-circle-outlined v-else-if="record.status==2"/>
                  <close-circle-outlined v-else-if="record.status==3"/>
                </template>
                {{statusFont(record.status,'text')}}
              </Tag>
            </Tooltip>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:qrcode-outlined',
                tooltip: '查看二维码',
                onClick: handleQrcode.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'fa6-solid:share-from-square',
                color: 'warning',
                tooltip: '分享',
                onClick: handleShare.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <!--显示二维码-->
    <QrCodeModal @register="QrCodeModals" />
    <!--分组-->
    <groupModal @register="groupModals"  @upcateData="upcateData"/>
    <!--选择模板-->
    <SelectTemplate @register="selectTemplateModal" />
    <!--分享弹框-->
    <a-modal v-model:visible="shareShow" title="分享页面" :footer="null" wrapClassName="mymodal" :bodyStyle="{background:' #fafafb'}">
       <div class="barbtn">
          <div class="bitem">
            <div class="text" @click="shareFun(1)">
              <div ><Icon icon="fa:weibo" color="#e6172d" :size="25"></Icon></div>
              <div class="title">微博</div>
            </div>
          </div>
          <div class="bitem">
            <div class="text" @click="shareFun(2)">
              <div ><Icon icon="ant-design:qq-circle-filled" color="#1296db" :size="28"></Icon></div>
              <div class="title">QQ</div>
            </div>
          </div>
          <div class="bitem">
            <div class="text" @click="shareFun(3)">
              <div ><Icon icon="simple-icons:qzone" color="#f5be3f" :size="25"></Icon></div>
              <div class="title">QQ空间</div>
            </div>
          </div>
          <div class="bitem" style="padding: 0px;">
            <QrCode
                  :value="ShareLink"
                  ref="qrRef"
                  class="enter-x flex justify-center xl:justify-start"
                  :options="{
                    width:100,
                    margin: 2
                  }"
                  :logo="{
                    src: WeixinImg,
                    logoSize: 0.2,
                    borderSize: 0.05,
                    borderRadius: 5,
                    bgColor: 'white',
                  }"
              />
          </div>
       </div>
    </a-modal>
  </PageWrapper>
</template>
<script lang="ts">
  //组件
  import groupModal from './modules/groupModal.vue';
  import SelectTemplate from './modules/SelectTemplate.vue';
  import QrCodeModal from './modules/QrCodeModal.vue';
  import { ref,defineComponent, reactive,computed,nextTick,onMounted} from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  //Api
  import { getList ,delData,upStatus} from '/@/api/microweb/webmain';
  import { isHaseMicroweb } from '/@/api/sys/dashboard';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';
  import { Icon } from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import { useRouter } from 'vue-router';
  import { columns, searchFormSchema } from './webmain.data';
  import { useUserStore } from '/@/store/modules/user';
  import { Modal,Tag,Tooltip } from 'ant-design-vue';
  import { GetWebLink } from '/@/utils/imgurl';
  import { QrCode} from '/@/components/Qrcode/index';
  import WeixinImg from '/@/assets/images/weixin.png';
  import {
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons-vue';
import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'webmain',
    components: { BasicTable, PageWrapper, DeptTree, TableAction,Icon,QrCodeModal,groupModal,
      AModal:Modal,QrCode,SelectTemplate,
      Tag,SyncOutlined,CheckCircleOutlined,CloseCircleOutlined, ClockCircleOutlined,Tooltip},
    setup() {
      //提示
      const {
        createConfirm,
        createMessage,
      } = useMessage();
      const router = useRouter();
      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const {userId,roles, realName = '', avatar, desc } = userStore.getUserInfo || {};
        return {userId,roles, realName, avatar: avatar , desc };
      });
      const [groupModals, { openModal: openGroup }] = useModal();//分组
      const [selectTemplateModal, { openModal: openSelectTemplate }] = useModal();//选择模板
      const [QrCodeModals, { openModal: openQrCode }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: '我的轻站',
        api: getList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('handleSearchInfoFn', info);
          return info;
        },
        actionColumn: {
          width: 140,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });
      //打开h5页面新建
      function handleCreate() {
        // go('/microweb/webeditor/0');
        router.push({
          name:'webeditor', 
          query:{id:0}
        })
      }
      //打开h5页面编辑
      function handleEdit(record: Recordable) {
        router.push({
          name:'webeditor', 
          query:{id: record.id}
        })
      }
      //分享
      const shareShow=ref(false)
      const ShareLink=ref("")
      const Sharerecord=ref()
      function handleShare(record: Recordable) {
        shareShow.value=true
        Sharerecord.value=record
        ShareLink.value = GetWebLink(record.id)
      }
      //删除数据
      async function handleDelete(record: Recordable) {
         await delData([record.id]);
          reload();
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          reload();
        }
      }
      //分类选择
      function handleSelect(deptId = '') {
        searchInfo.cid = deptId;
        reload();
      }
      //刷新数据
      function reflatData() {
        reload();
      }
      //显示二维码
      function handleQrcode(record: any) {
         nextTick(() => {
          openQrCode(true,record)
        });
      }
      //刷新分类数据
      const cateTreeRef = ref();
      function upcateData() {
        cateTreeRef.value.fetch()
      }
      //分享
      function shareFun(type) {
         if(type==1){//微博
          window.open('http://service.weibo.com/share/share.php?url=' + encodeURIComponent(ShareLink.value) + '&sharesource=weibo&title=' + Sharerecord.value.title + '&pic=')
         }else if(type==2){//qq
          window.open('https://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(ShareLink.value) + '&title=' + Sharerecord.value.title + '&desc='+Sharerecord.value.des+'&pics=')
         }else if(type==3){//qq空间
          window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(ShareLink.value) + '&sharesource=qzone&title=' + Sharerecord.value.title + '&pics=&summary=' + Sharerecord.value.des)
          }
      }
      //状态解析
      function statusFont(status,type,msg="") {
          let text = "编辑中"
          let color = "processing";
          let tig = "点击可发布";
          if(status==1){
            text = "审核中";
            color = "warning";
            tig = "等待工作人员审核";
          }else if(status==2){
            text = "已发布";
            color = "success";
            tig = "已正常使用";
          }else if(status==3){
            text = "审核不通过";
            color = "error";
            tig = msg;
          }
          if(type=='text'){
            return text
          }else if(type=='color'){
            return color
          }else if(type=='tig'){
            return tig
          }
      }
       function onPublish(status,name,id){
        if(status==0){
          createConfirm({
          iconType: 'warning',
          title: '发布提示',
          content: `您是否确定发布“${name}”`,
          onOk:(async()=>{
            createMessage.loading({ content: '发布中...', key:"onPublish",duration:0});
            const results= await upStatus({id:id,status:1})
            if(results){
              createMessage.success({ content: '发布成功，等待审核', key:"onPublish", duration: 2 });
              reload();
            }
          })
          });
        }
      }
      //选择模板
      function handelSelectTemplate(){
        openSelectTemplate(true, {
            isUpdate: false,
        });
      }
      //判断套餐是否剩余
      const ishasepack=ref(true)
      onMounted(async() => {
         const hasenum=await isHaseMicroweb() as any
         if(hasenum>0){
            ishasepack.value=false
         }
      });
      
      return {
        registerTable,
        handleCreate,
        handleEdit,
        handleShare,
        handleDelete,
        handleSuccess,
        handleSelect,
        searchInfo,
        getUserInfo,
        handleQrcode,
        openGroup,groupModals,//分组
        openSelectTemplate,handelSelectTemplate,selectTemplateModal,//选择模板
        openQrCode,QrCodeModals,
        upcateData,cateTreeRef,
        shareShow,ShareLink,
        WeixinImg,shareFun,
        statusFont,onPublish,reflatData,
        ishasepack,
      };
    },
    beforeRouteEnter(_, from, next) {
      next((vm) => {
        if(from.name=="webeditor"){
          const instance = vm as any;
          instance.reflatData()
        }
      });
    },
  });
</script>
<style lang="less" scoped>
  .mymodal{
    .barbtn{
      display: flex;
      padding-bottom: 20px;
      .bitem{
        text-align: center;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
        margin: 10px 5px 10px 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .text{
          width: 100px;
          .title{
            margin-top: 5px;
            user-select: none;
          }
        }
      }
    }
  }
</style>
