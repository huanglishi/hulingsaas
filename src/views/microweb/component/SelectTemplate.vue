<template>
  <BasicModal
    @register="register"
    @visible-change="openChang"
    @height-change="heightChange"
    title="选择模板"
    :showOkBtn="false"
    :showCancelBtn="false"
     width="85%"
     :minHeight="590"
    :bodyStyle="{ background: '#ededed'}"
  >
    <div class="listbox">
      <div class="leftmenu">
          <div class="listitem " v-for="item in grouplist" :key="item['id']" :class="{selected:pcid==item['id']}" @click="changCate(item['id'],item['children'])">
            <a-popover placement="right">
              <template #content>
                 <div class="catedata">
                    <div class="cateitem" v-for="list in item['children']" :key="list['id']" :class="{selecteditem:cid==list['id']}" @click="changCateItem(list['pid'],list['id'],item['children'])">{{list['name']}}</div> 
                 </div>
              </template>
              <template #title>
                <span>分类</span>
              </template>
              <div class="text">
                {{item['name']}}<Icon class="icons" size="15" v-if="pcid==item['id']" icon="ant-design:right-outlined"></Icon>
              </div>
            </a-popover>
          </div>
      </div>
      <div class="rightlist">
        <div class="lefTopCate">
          <div class="ltc_item" :class="{active:(pcid!=cid&&cid==0)||pcid==cid}" @click="changCateItem(pcid,pcid,topCate)">全部</div>
          <div class="ltc_item" v-for="item in topCate" :key="item['id']" :class="{active:cid==item['id']}" @click="changCateItem(item['pid'],item['id'],topCate)">{{item['name']}}</div>
        </div>
        <div class="leftContent" :style="{height:(winHeight-42)+'px'}">
           <div class="scrollbox">
            <a-spin :spinning="dataloading" tip="加载中...">
                <div class="contentbox">
                  <div class="template_item" v-for="item in list" :key="item['id']">
                    <div class="p_template">
                      <img :src="item['image']" class="preview_img">
                      <div class="code_layer" >
                        <QrCode
                          :value="tplpreviewurl+'?tplId='+item['id']"
                          tag="img"
                          class="preview_code"
                          :width="130"
                          :options="{
                            margin:1,
                            scale:5
                          }"
                      />
                        <div class="template_btn use_btn" @click="useWeb(item['id'])">马上使用</div>
                        <div class="template_btn preview_btn" @click="previewWenb(item['id'],item['title'])">点击预览</div>
                        <div class="template_btn del_btn" v-if="(is_admin==1)" @click="del(item['id'],item['title'])">删除</div>
                      </div>
                    </div>
                  </div>
                  <!--找不到-->
                  <div class="template_item" >
                    <div class="p_template template_emty">
                      <div class="emptybox">
                        <Icon class="emptyicon" size="120"  icon="ph:question-thin"></Icon>
                        <div class="emptytext">
                          <div class="tig">未找到您想要的模板</div>
                          <div class="btn" @click="addCustomtpl"><a>提交需求</a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a-spin>
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

        <!--添加模板需求-->
        <addTplModal @register="registerModal"  />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent ,nextTick,onMounted, reactive,toRefs,ref} from 'vue';
  //APi
  import {getSelectTplGroup, getSelectTplList,delWebTpl } from '/@/api/microweb/webtpl';
  //组件
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Popover,Spin } from 'ant-design-vue';
  import { QrCode} from '/@/components/Qrcode/index';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  //组件
  import { useModal } from '/@/components/Modal';
  import addTplModal  from '/@/views/common/customtpl/addTplModal.vue';
  export default defineComponent({
    name:"SelectTemplate",
    components: { BasicModal,Icon,[Popover.name]:Popover,QrCode,[Spin.name]:Spin,addTplModal},
    emits: ['upcateData','upWebTpl'],
    setup(_, { emit }) {
      //提示
      const {
        createConfirm,
      } = useMessage();
      const iframedata=ref({
        show:false,
        content:"",
        title:"",
      })
      //用户信息
      const userStore = useUserStore();
      const tplpreviewurl = ref(userStore.getUserInfo?.tplpreviewurl || '');
      const is_admin = ref(userStore.getUserInfo?.is_admin || 0);
      const router = useRouter();
      //打开窗口
      const isUpdate = ref(true);
      const [register, { closeModal }] = useModalInner(async (data) => {
         isUpdate.value = !!data?.isUpdate;
      });
      function upcateData(){
        emit('upcateData');
      }
      //监听打开关闭
      function openChang(visible:boolean){
       if(visible){
        initdata();
       }
      }
      const datas=reactive({
        pcid:0,//父级id
        cid:0,//子id
        grouplist:[],//分类数据
        list:[],//产品数据
        topCate:[],//右边顶部分类
      })
      //2.初始获取分类数据
     async function initdata(){
        datas.grouplist= await getSelectTplGroup()
       nextTick(()=>{
        const ndata=datas.grouplist[0]
        datas.pcid=ndata["id"]
        datas.topCate=ndata["children"]
         getlist()
       })
      }
      //3.获取模板数据
      const dataloading=ref(true)
      async function getlist(){
        dataloading.value=true
        datas.list= await getSelectTplList({pcid:datas.pcid,cid:datas.cid})
        nextTick(()=>{
          dataloading.value=false
        })
      }
      //1.初始执行
      onMounted(() => {
       
      });
      //切换一级分类
      function changCate(pcid,children){
        datas.cid=0
        datas.pcid=pcid
        datas.topCate=children
        getlist()
      }
      //选择子分类
      function changCateItem(pcid,cid,children){
        datas.pcid=pcid
        datas.cid=cid
        datas.topCate=children
        getlist()
      }
      //高度变化监听
      const winHeight=ref(0)
      function heightChange(h){
        winHeight.value=h
      }
      //选择模板
      function useWeb(id){
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
              closeModal()
              window.open(routeUrl.href, '_blank');
            },
          });
      }
      //预览
      function previewWenb(id,title){
        iframedata.value={
            show:true,
            content:`${tplpreviewurl.value}?tplId=${id}`,
            title:title,
          }
      }
      //删除模板
      function del(id,title){
        createConfirm({
          iconType: "warning",
          title: '删除提示',
          content: `您确定要删除“${title}”吗？`,
          onOk:(async()=>{
           const result= await delWebTpl({id:id});
           if(result){
            getlist()
           }
          })
        });
      }
      //提交模板需求
      const [registerModal, { openModal }] = useModal();
      function addCustomtpl(){
        openModal(true, {
          isUpdate: false,
        });
      }
      return {
        ...toRefs(datas),changCate,
        openChang,heightChange,winHeight,dataloading,
        register,
        closeModal,
        upcateData,changCateItem,
        useWeb,previewWenb,tplpreviewurl,iframedata,del,is_admin,
        registerModal,addCustomtpl,
      };
    },
  });
</script>
<style lang="less" scoped>
  .listbox{
    display: flex;
    height: 100%;
    overflow: hidden;
    .leftmenu{
        width: 188px;
        background: #fff;
        box-shadow: 0px 0px 15px 0px rgb(0 0 0 / 10%);
        border-radius: 4px;
        .listitem{
          padding-left: 16px;
          height: 37px;
          line-height: 100%;
          .text{
            font-size: 14px;
            line-height: 37px;
            cursor: pointer;
            position: relative;
            .icons{
              position: absolute;
              top: 12px;
              right: 10px;
              align-items: flex-end;
            }
          }
          &:hover{
            background: rgba(37, 165, 137, 0.09);
            color: #55D187;
          }
          &.selected{
            background: #2f68ca;
            color: #fff;
            transition: background ease .3s,color ease .3s;
          }
        }
    }
    .rightlist{
      flex: 1;
      margin-left: 32px;
      .lefTopCate{
        display: flex;
        .ltc_item{
          min-width: auto;
          height: 32px;
          line-height: 32px;
          margin-left: 0px;
          margin-bottom: 10px;
          padding-left: 16px;
          padding-right: 16px;
          border-radius: 4px;
          cursor: pointer;
          &:hover{
            color: #2f68ca;
          }
          &.active{
            background: #2f68ca;
            color: #fff;
            transition: background ease .3s,color ease .3s;
          }
        }
      }
      .leftContent{
        overflow: hidden;
        position: relative;
        width: 100%;
         .scrollbox{
           position: relative;
           height: 100%;
          //  &:hover{
            overflow-y: scroll;
          //  }
         }
        .contentbox{
          margin: 0;
          font-size: 0;
          padding-top: 20px;
          padding-left: 8px;
          min-height: 250px;
          .template_item{
            display: inline-block;
            vertical-align: top;
            margin: 0 40px 30px 0;
            .p_template{
              display: inline-block;
              vertical-align: top;
              border-radius: 8px;
              position: relative;
              transition: transform .3s ease,box-shadow .3s ease;
              width: 178px;
              height: 317px;
              box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 15%);
              &:hover{
                box-shadow:0px 10px 20px -5px rgba(0,0,0,.25);
                transform:translate3d(0, -8px, 0)
              }
              .preview_img{
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 8px;
                position: relative;
              }
              /**焦点浮窗 */
              .code_layer{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,.4);
                border-radius: 8px;
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                display: none;
                .preview_code{
                  height: 130px;
                  width: 130px;
                  :deep(img){
                    height: 100%;
                    width: 100%;
                    border-radius: 4px;
                    background: #fff;
                  }
                }
                .template_btn{
                  font-size: 13px;
                  text-align: center;
                  user-select: none;
                  cursor: pointer;
                  width: 130px;
                  height: 30px;
                  border-radius: 15px;
                  line-height: 30px;
                  &:hover{
                    font-size: 14px;
                  }
                  &.use_btn{
                    background: #fff;
                    color: #5874d8;
                    margin-top: 15px;
                  }
                  &.preview_btn{
                    background: #5874d8;
                    color: #fff;
                    margin-top: 8px;
                  }
                  &.del_btn{
                    background: #ff4d4f;
                    color: #fff;
                    margin-top: 8px;
                  }
                }
              }
              &:hover{
                .code_layer{
                  display: flex;
                }
              }
              /**空内容提示 */
              &.template_emty{
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .emptyicon{
                text-align: center;
                color: #cccccc;
              }
              .emptytext{
                font-size: 13px;
                text-align: center;
                .tig{
                  
                }
                .btn{

                }
              }
            }
          }
        }
      }
    }
  }
  /**气泡弹框 */
  .catedata{
    display: flex;
    .cateitem{
      padding: 2px 5px;
      margin-right: 5px;
      cursor: pointer;
      &:hover{
        background: rgba(37, 165, 137, 0.09);
        color: #55D187;
        border-radius: 3px;
      }
      &.selecteditem{
        color: #55D187;
      }
    }
  }
</style>
