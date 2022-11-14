<template>
  <div class="topcard">
     <div class="panel_content">
        <div class="flex_wrapper">
          <div class="wrapper_item bg_mobile">
              <div class="title"><Icon icon="teenyicons:mobile-outline" :size="18"></Icon> 手机网站</div>
              <div class="des">手机端网站，个人名片，产品宣传</div>
              <div class="btn"  >
                <a-button color="#ffffff" shape="round" @click="openTapWin('webeditor')">去设计<Icon icon="line-md:telegram" :size="16"></Icon></a-button>
              </div>
          </div>
          <div class="wrapper_item bg_oldweb"  >
              <div class="title"><Icon icon="teenyicons:mobile-outline" :size="18"></Icon> 手机网站-旧版</div>
              <div class="des">手机端网站，个人名片，产品宣传</div>
              <div class="btn"  >
                <a-button color="#ffffff" shape="round" @click="openTapWin('oldditor')">去设计<Icon icon="line-md:telegram" :size="16"></Icon></a-button>
              </div>
          </div>
          <div class="site_info_warppe">
              <div class="site_name">
                <div class="title">网站名称</div>
                <div class="btn"><Icon icon="line-md:edit-twotone" :size="18"></Icon></div>
              </div>
              <!-- <div class="domain_link">
                <a :href="viewUrl(1)" target="_blank">{{viewUrl(1)}}</a>
              </div> -->
              <div class="site_qrcode_box">
                  <div class="qrcode_img">
                    <QrCode
                        :value="viewUrl(1)"
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
                  <div class="btn">
                    <div class="btnbox">
                       <div class="download" @click="download('网站')">
                        <div class="icons"><Icon icon="line-md:download-loop" :size="20"></Icon></div>
                         <div class="text">下载</div>
                       </div>
                       <div class="copy" @click="copyLink(viewUrl(1))">
                        <div class="icons"><Icon icon="ph:copy-simple-fill" :size="18"></Icon></div>
                         <div class="text">复制</div>
                       </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div class="info_functions">
          <div class="functions_item" @click="openSelfWin('articleManage')">
             <div class="icon article_icon"></div>
             <div class="text">文章管理</div>
          </div>
          <div class="functions_item" @click="openSelfWin('productManage')">
             <div class="icon product_icon"></div>
             <div class="text">产品管理</div>
          </div>
          <div class="functions_item" @click="openSelfWin('formManage')">
             <div class="icon form_icon"></div>
             <div class="text">表单管理</div>
          </div>
          <div class="functions_item" @click="openSelfWin('memberManage')">
             <div class="icon member_icon"></div>
             <div class="text">会员管理</div>
          </div>
          <!-- <div class="functions_item" @click="openSelfWin('wechatManage')">
             <div class="icon weixin_icon">
              <Icon icon="uiw:weixin" :size="28"></Icon>
             </div>
             <div class="text">微信管理</div>
          </div> -->
          <div class="line_separator"></div>
          <div class="functions_item"  @click="openSelfWin('paymentConfig')">
             <div class="icon pay_icon"></div>
             <div class="text">支付配置</div>
          </div>
          <div class="functions_item" @click="openSelfWin('resourceManage')">
             <div class="icon file_icon"></div>
             <div class="text">附件管理</div>
            </div>
          <div class="functions_item" @click="openSelfWin('orderManage')">
             <div class="icon order_icon"></div>
             <div class="text">订单管理</div>
          </div>
        </div>
     </div>
  </div>
</template>
<script lang="ts" setup>
  // import { GrowCardItem } from './data';
  // //api
  // import { getModels } from '/@/api/home/models';
  // //组件
  import { ref,unref } from 'vue';
  import { QrCode , QrCodeActionType} from '/@/components/Qrcode/index';
  import { Icon } from '/@/components/Icon';
   //复制
   import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  //路由
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { encodeURLS } from '/@/utils/imgurl';
  import { useMessage } from '/@/hooks/web/useMessage';
  const router = useRouter();
  const userStore = useUserStore();
  const tplpreviewurl = ref(userStore.getUserInfo?.tplpreviewurl || '');
  const { clipboardRef, copiedRef } = useCopyToClipboard(); //复制
  // const datalist = ref<GrowCardItem[]>([]);
  // const gatlist  =async ()=>{
  //   datalist.value=await getModels({}) 
  // }
  // gatlist()
  //提示弹框
  const {
    createMessage,
   } = useMessage();
  function openTapWin(path){
    let routeUrl = router.resolve({
     path: `/${path}`,
     query: {}
   });
   window.open(routeUrl.href, '_blank');
  }
  function openSelfWin(pathname){
    router.push({
     name: pathname,
     query: {}
    });
  }
  //下载二维码
  const qrRef = ref<Nullable<QrCodeActionType>>(null);
  function download(filename) {
    const qrEl = unref(qrRef);
    if (!qrEl){
      createMessage.warning('下载失败');
    }else{
      qrEl.download(filename);//文件名
    }
  }
  function viewUrl(id) {
    return  unref(tplpreviewurl)+'/#/preview?id='+encodeURLS(id)
  }
  //复制
  function copyLink(value){
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
    .panel_content{
      padding: 24px 15px;
      .flex_wrapper{
        display: flex;
        color: #fff;
        .wrapper_item{
          flex: 1 1;
          max-width: 350px; 
          height: 130px;
          border-radius: 6px;
          padding-top: 28px;
          padding-left: 34px;
          position: relative;
          box-sizing: border-box;
          cursor: pointer;
          transition: all .5s;
          transform: translateZ(0);
          height: 170px;
          padding-left: 20px;
          .title{
            font-size: 20px;
          }
          .des{
            box-sizing: border-box;
            font-size: 15px;
            color: #fff;
            margin-top: 13px;
            margin-bottom: 23px;
            display: block;
            width: 100%;
          }
          .btn{
            user-select: none;
             border: none;
            top: 115px;
            font-size: 14px;
          }
          &.bg_mobile{
            background-image: url(../../../assets/images/site_mbg_v2.png);
            background-color: transparent;
            margin-right: 30px;
            background-position: -430px -450px;
          }
          &.bg_oldweb{
            background-image: url(../../../assets/images/site_mbg_v2.png);
           background-color: #4f83f1;
           background-position:-15px -450px;
           margin-right: 20px;
          }
        }
        /**网站访问 */
        .site_info_warppe{
          flex: 1 1;
          color: #333;
          margin-left: 5px;
          max-width: 380px;
          min-width: 200px;
            .site_name{
                max-width: 180px;
                font-size: 20px;
                display: flex;
                margin-bottom: 10px;
               .title{
                margin-right: 5px;
                max-width: calc(100% - 55px);
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: top;
               }
               .btn{
                color: #999;
                cursor: pointer;
                user-select: none;
                &:hover{
                  color: #2a7dc9;
                }
               }
            }
            .site_qrcode_box{
              display: flex;
              .qrcode_img{
                height: 130px;
                width: 130px;
              }
              .btn{
                margin-left: 10px;
                 cursor: pointer;
                 user-select: none;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                .btnbox{
                  text-align: center;
                  .download{
                    margin-bottom: 15px;
                    &:hover{
                      color: #2a7dc9;
                    }
                  }
                  .copy{
                    &:hover{
                      color: #2a7dc9;
                    }
                  }
                  .icons{
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    :deep(.app-iconify){
                      display: flex;
                      justify-content: center;
                    }
                  }
                }
              }
            }
        }
      }
      /**功能导航 */
      .info_functions{
        box-sizing: border-box;
        height: 110px;
        border-top: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: flex-start;/**左对齐 */
        // justify-content: space-around;/**两边对齐 */
        margin: 27px 0 0 0;
        .functions_item{
          margin: 0 15px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          &:hover{
            color: #5874d8;
            .icon{
              height: 46px;
            }
          }
          .icon{
            height: 45px;
            margin: 0 0 10px 0;
            &.article_icon{
              background-image: url(../../../assets/images/site_mbg_v2.png);
              background-position: 3px 0;
            }
            &.product_icon{
              background-image: url(../../../assets/images/site_mbg_v2.png);
              background-position: -54px 0;
            }
            &.form_icon{
              background-image: url(../../../assets/images/site_mbg_v2.png);
              background-position: -392px 0;
            }
            &.member_icon{
              background-image: url(../../../assets/images/site_mbg_v2.png);
              background-position: -166px 0;
            }
            &.weixin_icon{
              color: #5997ff;
              display: flex;
              justify-content: center;
              align-items: center;
              // background-image: url(../../../assets/images/site_mbg_v2.png);
              // background-position: -166px 0;
            }
            &.pay_icon{
              background-image: url(../../../assets/images/site_mbg_v2.png);
              background-position: -448px 0;
            }
            &.file_icon{
              background-image: url(../../../assets/images/site_mbg_v2.png);
              background-position: -111px 0;
            }
            &.order_icon{
              background-image: url(../../../assets/images/site_mbg_v2.png);
              background-position: -280px 0;
            }
          }
          .text{
             user-select: none;
          }
        }
        .line_separator{
          width: 1px;
          height: 80px;
          background: #eee;
        }
      }
    }
  }
</style>
