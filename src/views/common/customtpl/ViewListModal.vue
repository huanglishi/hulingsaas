<template>
  <BasicModal 
  v-bind="$attrs" 
  @register="registerModal" 
  @ok="handleSubmit" 
  title="申请模板列表" 
  width="920px" 
  :minHeight="590"
  :showCancelBtn="false"
  :showOkBtn="false"
  >
   <div class="customtpl">
     <div class="left">
      <BasicTable @register="registerTable" @rowClick="selectData" :striped="false">

      </BasicTable>
     </div>
     <div class="right">
        <div class="viewbox" v-if="pagedata">
            <div class="backdata">
              <a-divider>处理返回</a-divider>
              <div class="showdata">
                <div class="field" v-if="(pagedata['tpl_id']>0)">
                  <div class="label">定制模板：</div>
                  <div class="text">
                    <a-button type="primary" @click="useCusTpl(pagedata)">使用模板</a-button>
                    <Popconfirm placement="leftTop" ok-text="复制" cancel-text="关闭" @confirm="copyData(pagedata['tpl_id'])">
                      <template #title>
                         <div class="viewqrcode">
                          <QrCode
                              :value="viewUrl(pagedata['tpl_id'])"
                              tag="img"
                              ref="qrRef"
                              class="preview_code"
                              :width="130"
                              :options="{
                                margin:1,
                                scale:5
                              }"
                          />
                         </div>
                      </template>
                    <a-button type="link" style="margin-left: 20px;">预览模板</a-button>
                    </Popconfirm>
                  </div>
                </div>
                <div class="field" >
                  <div class="label">建议说明：</div>
                  <div class="text">
                    <div class="html" v-bind:innerHTML="pagedata['backcontent']"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="quedata" ref="wrapEl">
              <a-divider>提交的模板需求</a-divider>
              <div class="showdata">
                <div class="field">
                  <div class="label">标题：</div>
                  <div class="text">{{pagedata['name']}}</div>
                </div>
                <div class="field">
                  <div class="label">描述：</div>
                  <div class="text">{{pagedata['des']?pagedata['des']:"---"}}</div>
                </div>
                <div class="field">
                  <div class="label">内容：</div>
                  <div class="text"> 
                    <div class="html" v-bind:innerHTML="pagedata['content']"></div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="empty" v-else>
          <Empty description="请选择查看数据" />
        </div>
     </div>
   </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref ,unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  //表格
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns } from './data';
  import { useMessage } from '/@/hooks/web/useMessage';
  //API
  import { getList,getCustomtpl } from '/@/api/common/customtpl';
  import { Empty ,Divider,Popconfirm} from 'ant-design-vue';
  //路由
  import { useRouter } from 'vue-router';
  import { useLoading } from '/@/components/Loading';
  import { useUserStore } from '/@/store/modules/user';
  import { QrCode } from '/@/components/Qrcode/index';
  //复制
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  export default defineComponent({
    name: 'ViewListModal',
    components: { BasicModal,Empty,BasicTable,ADivider:Divider,Popconfirm,QrCode},
    emits: ['success', 'register'],
    setup( ) {
      const pagedata = ref(null);
      const wrapEl = ref<ElRef>(null);
      const {
          createConfirm,
        } = useMessage();
      const {createMessage} = useMessage();
      const [registerModal, { setModalProps ,closeModal}] = useModalInner(async () => {
        setModalProps({ confirmLoading: false });
        reload()
        // pagedata.value = await getArticle({id:data.id});
      });
      function handleSubmit(){
        closeModal();
      }
      const { clipboardRef, copiedRef } = useCopyToClipboard(); //复制
      //表格
      const [registerTable, { reload}] = useTable({
        api: getList,
        rowKey: 'id',
        columns,
        immediate: false,
        useSearchForm: false,
        showTableSetting: false,
        bordered: false,
        pagination: true,
        showIndexColumn: false,
        maxHeight:490,
        // actionColumn: {
        //   width: 80,
        //   title: '操作',
        //   dataIndex: 'action',
        //   fixed: undefined,
        // },
      });
      //获取一条完整数据
      async function selectData(record:Recordable){
        openWrapLoading();
        pagedata.value = await getCustomtpl({id:record.id});
        closeWrapLoading();
      }
      //使用定制模板
      const router = useRouter();
      function useCusTpl(pagedata){
        let routeUrl = router.resolve({
          path: "/webeditor",
          query: {id:pagedata['tpl_id']}
        });
        createConfirm({
          iconType: "info",
          title: '您确定使用该模板吗?',
          content: '如果之前已经编辑，将覆盖原来数据。',
          okText:"使用",
          onOk(){
            window.open(routeUrl.href, '_blank');
          },
        });
      }
      //加载
      const [openWrapLoading, closeWrapLoading] = useLoading({
        target: wrapEl,
        props: {
          tip: '加载中...',
          absolute: true,
        },
      });
      const userStore = useUserStore();
      const tplpreviewurl = ref(userStore.getUserInfo?.tplpreviewurl || '');
      //预览地址
      function viewUrl(id:any) {
        return  unref(tplpreviewurl)+"?tplId="+id
      }
      //复制
      function copyData(id:any){
        const value= unref(tplpreviewurl)+"?tplId="+id
          if (!value) {
              createMessage.warning('要拷贝的内容为空！');
              return;
            }
            clipboardRef.value = value;
            if (unref(copiedRef)) {
              createMessage.success({ content: '复制成功！', key:"webcopyLink",duration:2});
            }else{
              createMessage.warning('要拷贝的内容失败！');
            }
      }
      return { 
         registerModal, 
         handleSubmit,
         pagedata,
         registerTable,
         reload,selectData,useCusTpl,wrapEl,viewUrl,
         copyData,
        };
    },
  });
</script>
<style lang="less" scoped>
 .customtpl{
  display: flex;
  height: 590px;
  .left{
    height: 100%;
    flex: 1;
    border-right: 1px solid #f0f0f0;
  }
  .right{
    flex: 1;
    height: 100%;
    .viewbox{
      .showdata{
        padding: 10px;
        .field{
          display: flex;
          margin-bottom: 10px;
          .label{
             min-width: 50px;
            font-weight: 600;
            text-align: right;
          }
          .text{
            flex: 1;
            padding-left: 10px;
          }
        }
      }
    }
    .empty{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
 }
 .viewqrcode{
   margin-right: 20px;
 }
</style>
