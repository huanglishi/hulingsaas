<template>
  <div class="topcard">
    <div class="panel_header">
      <div class="templates_header">
         <div class="left">
            <div class="templates_text">使用模板极速建站：</div>
            <div class="templates_kind" v-for="item in datagrouplist" :key="item.id" @click="selectByGroup(item.id)" :class="{active:cid==item.id}">{{item.name}}</div>
         </div>
         <div class="right">
          <div class="templates_kind" @click="handelSelectTemplate">更多</div>
         </div>
      </div>
    </div>
    <div class="panel_content">
        <div class="templates_content" draggable="false">
          <div class="templates_list " >
              <div class="template_item_wrap" v-for="list in datatpllist">
                <div class="template_image" :style="{backgroundImage:`url(${list.image})`}"></div>
                <div class="template_image_mask">
                  <div class="qrcode_img">
                    <QrCode
                        :value="(tplpreviewurl+list.id)"
                        tag="img"
                        class="preview_code"
                        :width="130"
                        :options="{
                          margin:1,
                          scale:5
                        }"
                    />
                  </div>
                  <div class="template_operation">
                    <div class="template_operation_btn template_preview" @click="previewWenb(list.id,list.title)">预览</div> 
                    <div class="template_operation_btn template_copy" @click="openTapWin(list.id)">使用</div>
                  </div>
                </div>
              </div>
               <!--找不到-->
               <div class=" template_item" v-if="!datatpllist||datatpllist.length==0">
                    <div class=" template_emty">
                      <div class="emptybox">
                        <Icon class="emptyicon" size="120"  icon="line-md:question"></Icon>
                        <div class="emptytext">
                          <div class="tig">未找到您想要的模板</div>
                          <div class="btn" @click="addCustomtpl"><a>提交需求</a></div>
                        </div>
                      </div>
                    </div>
                </div>
          </div>
        </div>
    </div>
    <s3-layer
      v-model="iframedata.show"
      :content="iframedata.content"
      :type="2"
      :title="iframedata.title"
      :maxmin="false"
      :closeBtn="2"
      :area="['380px', '667px']"
    >
    </s3-layer>
     <!--选择模板-->
     <SelectTemplate @register="selectTemplateModal" />
     <!--添加模板需求-->
    <addTplModal @register="registerModal"  />
  </div>
</template>
<script lang="ts" setup>
  import { GroupItem ,TplItem} from './data';
  //api
  import { getTplGroup , getTpllist } from '/@/api/home/mwebtpl';
  //组件
  import {ref } from 'vue';
  import SelectTemplate from '/@/views/microweb/component/SelectTemplate.vue';
  import { Icon } from '/@/components/Icon';
  import { QrCode} from '/@/components/Qrcode/index';
  import { useUserStore } from '/@/store/modules/user';
  import { encodeURLS } from '/@/utils/imgurl';
  import { useModal } from '/@/components/Modal';
  //路由
  import { useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  //组件
  import addTplModal  from '/@/views/common/customtpl/addTplModal.vue';
  const router = useRouter();
  const userStore = useUserStore();
  const tplpreviewurl = ref(userStore.getUserInfo?.tplpreviewurl || '');
  const datagrouplist = ref<GroupItem[]>([]);
  const cid = ref(0);
  const grouplist  =async ()=>{
    datagrouplist.value=await getTplGroup({}) 
  }
  const [selectTemplateModal, { openModal: openSelectTemplate }] = useModal();//选择模板
   //选择模板
   function handelSelectTemplate(){
      openSelectTemplate(true, {
          isUpdate: false,
      });
    }
  //提示弹框
  const {
    createConfirm,
  } = useMessage();
  //选择
  function selectByGroup(id){
    cid.value=id
    getTpl()
  }
  const datatpllist = ref<TplItem[]>([]);
  async function getTpl(){
    datatpllist.value = await getTpllist({cid:cid.value}) 
  }
  //预览参数
   const iframedata=ref({
    show:false,
    content:"",
    title:"",
  })
  //预览
  function previewWenb(id,title){
    iframedata.value={
        show:true,
        content:`${tplpreviewurl.value}?tplId=${id}`,
        title:title,
      }
  }
  //使用模板
  function openTapWin(id){
    let routeUrl = router.resolve({
      path: "/webeditor",
      query: {id:id}
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
  getTpl()
  grouplist()
  //提交模板需求
  const [registerModal, { openModal }] = useModal();
  function addCustomtpl(){
    openModal(true, {
      isUpdate: false,
    });
  }
  defineProps({
    loading: {
      type: Boolean,
    },
  });
</script>
<style lang="less" scoped>
  .topcard{
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    margin-top: 20px;
    .panel_header{
      padding-left: 20px;
      padding-right: 20px;
      line-height: 50px;
      border-bottom: 1px solid #eee;
      color: #666;
      font-size: 16px;
      .templates_header{
        height: 50px;
        display: flex;
        .left{
          flex:1;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          .templates_text{
            font-size: 14px;
            color: #333;
            white-space: nowrap;
          }
        }
        .right{
          width: auto;
          .templates_kind{
            padding-right: 1px;
          }
        }
        .templates_kind{
          font-size: 14px;
          color: #666;
          cursor: pointer;
          user-select: none;
          transition: all .3s ease;
          padding: 0 20px;
          white-space: nowrap;
          &.active,&:hover{
            color: #5874d8;
            font-size: 15px;
            font-weight: 700;
          }
        }
      }
    }
    /**模板内容 */
    .panel_content{
      width: 100%;
      overflow: hidden;
      .templates_content{
        position: relative;
        display: flex;
        height: 360px;
        padding: 10px;
        .templates_list{
          flex: 1 1;
          display: flex;
          align-items: center;
          justify-content: space-around;
          // justify-content: flex-start;
          .template_item_wrap{
            position: relative;
            width: 212px;
            height: 330px;
            transition: transform .3s ease;
            border-radius: 10px;
            background-color: #f3f4f5;
            margin-right: 10px;
            .template_image{
              position: absolute;
              top: 6px;
              left: 6px;
              width: calc(100% - 12px);
              height: calc(100% - 12px);
              background-repeat: no-repeat;
              background-size: cover;
              background-position-x: center;
              border-radius: 8px;
              overflow: hidden;
            }
            .template_image_mask{
              position: absolute;
              top: 6px;
              left: 6px;
              z-index: 1;
              width: calc(100% - 12px);
              height: calc(100% - 12px);
              border-radius: 8px;
              background-color: rgba(0,0,0,.7);
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              display: none;
              .qrcode_img{
                height: 130px;
                width: 130px;
                :deep(img){
                  height: 100%;
                  width: 100%;
                  border-radius: 4px;
                  background: #fff;
                }
              }
              .template_operation{
                width: 100%;
                margin-top: 20px;
                display: flex;
                justify-content: space-around;
                border-radius: 18px;
                padding: 0 20px;
                .template_operation_btn{
                  width: 60px;
                  height: 34px;
                  line-height: 34px;
                  color: #fff;
                  text-align: center;
                  font-size: 14px;
                  border-radius: 18px;
                  cursor: pointer;
                  user-select: none;
                  &.template_preview{
                    background-color: #3583fb;
                  }
                  &.template_copy{
                    background-color: #fb5d46;
                  }
                }
              }
            }
            &:hover{
              transform:translate3d(0, -8px, 0);
              .template_image_mask{
                display: flex;
              }
            }
          }
          .template_item{
            .template_emty{
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .emptybox{
                
                .emptyicon{
                  text-align: center;
                  color: #cccccc;
                }
                .btn{
                  text-align: center;
                  user-select: none;
                  margin-top: 5px;
                }
              }
          }
        }
      }
    }
  }
  .templates_content::-webkit-scrollbar {
      display: none;
  }
 
</style>
