<template>
      <div class="p-2">
      <div class="topcard">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="wxpay" tab="微信支付">
               <div class="formbox">
                <a-form
                    :model="wxpayFome"
                    name="basic"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                  >
                    <a-form-item
                      label="公众账号ID"
                      name="appId"
                      :rules="[{ required: true, message: '请填写绑定的微信公众号账号ID' }]"
                    >
                      <a-input v-model:value="wxpayFome.appId" placeholder="填写绑定的微信公众号账号ID"/>
                    </a-form-item>
                    <a-form-item
                      label="微信支付商户号"
                      name="mchID"
                      :rules="[{ required: true, message: '请填写微信支付商户平台的商户号' }]"
                    >
                      <a-input v-model:value="wxpayFome.mchID" placeholder="写微信支付商户平台的商户号"/>
                    </a-form-item>

                    <a-form-item
                      label="商户APIv3密钥"
                      name="mchAPIv3Key"
                      :rules="[{ required: true, message: '请填写微信支付商户平台的API v3密钥' }]"
                    >
                      <a-input-password v-model:value="wxpayFome.mchAPIv3Key" :disabled="wxpay_key" style="width: calc(100% - 70px);" placeholder="填写微信支付商户平台的商户密钥"/>
                      <a class="edit" @click="showKey">查看</a>
                      <template #help>
                        <div>
                          商户需先在【商户平台】->【API安全】的页面设置该密钥，请求才能通过微信支付的签名校验。密钥的长度为32个字节。
                        <a target="_blank" href="https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay3_2.shtml">了解</a>
                        <a target="_blank" href="https://kf.qq.com/faq/161222NneAJf161222U7fARv.html" style="margin-left: 5px;">API证书</a>
                      </div>
                      </template>
                    </a-form-item>
                    <a-form-item
                      label="商户证书序列号"
                      name="mchCertificateSerialNumber"
                      :rules="[{ required: true, message: '请填写微信支付商户平台的商户证书序列号' }]"
                    >
                      <a-input-password v-model:value="wxpayFome.mchCertificateSerialNumber" :disabled="wxpay_key" style="width: calc(100% - 70px);" placeholder="填写微信支付商户平台的商户证书序列号"/>
                      <a class="edit" @click="showKey">查看</a>
                      <template #help>
                        <div>
                          登陆商户平台【API安全】->【API证书】->【查看证书】，可查看商户API证书序列号。
                        <a target="_blank" href="https://wechatpay-api.gitbook.io/wechatpay-api-v3/chang-jian-wen-ti/zheng-shu-xiang-guan#ru-he-cha-kan-zheng-shu-xu-lie-hao">了解</a>
                      </div>
                      </template>
                    </a-form-item>
                    <a-form-item
                      label="商户私钥"
                      name="privatekey"
                      :rules="[{ required: true, message: '请上传微信支付商户平台的商户私钥' }]"
                      help="请勿更改导致无法正常使用微信支付"
                    >
                    <div class="upbox">
                      <Upload 
                      :show-upload-list="false" 
                      accept=".pem"  
                      :multiple="false" 
                      :before-upload="beforeUpload" 
                      >
                        <div class="pemfile" v-if="wxpayFome.privatekey" title="请勿更改">
                          <Icon icon="bi:filetype-key" size="32" color="#0960bd"></Icon>
                          <span>私钥已上传</span>
                        </div>
                        <a-button v-else preIcon="bi:filetype-key">上传商户私钥文件</a-button>
                      </Upload>
                    </div>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                      <a-button type="primary" html-type="submit">提交</a-button>
                    </a-form-item>
                  </a-form>
               </div>
            </a-tab-pane>
            <a-tab-pane key="aliapy" tab="支付宝支付" >
              暂时不支持
            </a-tab-pane>
          </a-tabs>
        </div> 
        <!--输入密码-->
        <a-modal
            v-model:visible="submitPassword.show"
            title="验证密码"
            :confirm-loading="submitPassword.loading"
            @ok="handleOkPassword"
            :closable="false"
          >
            <div class="ssPassword">
              <div class="label">登录密码：</div>
              <div class="text"><a-input-password v-model:value="submitPassword.password" placeholder="请输入您的登录密码" @pressEnter="handleOkPassword"/></div>
            </div>
          </a-modal>
      </div>
  </template>
  <script lang="ts">
    import { defineComponent ,ref,reactive, unref,onMounted} from 'vue';
    import { Icon } from '/@/components/Icon';
    import { Tabs,TabPane ,Form,FormItem,Modal,Upload} from 'ant-design-vue';
    import { WXpayItem,submitPasswordItem } from './data';
    import { useMessage } from '/@/hooks/web/useMessage';
    import { useUserStore } from '/@/store/modules/user';
    //API
    import { getPayIinfo,savePay,uploadFile } from '/@/api/system/payment';
    import md5 from 'md5'
    export default defineComponent({
      name: 'paymentConfig',
      components: { Icon,Upload,
      [Tabs.name]:Tabs,[TabPane.name]:TabPane,
      [Form.name]:Form,[FormItem.name]:FormItem,
      [Modal.name]:Modal,
    },
      setup() {
        const userStore = useUserStore();
        const {
          createMessage,
        } = useMessage();
        const wxpay_key=ref(false)
        const wxpay_id=ref(0)
        const wxpayFome = reactive<WXpayItem>({
              appId: '',
              mchID: '',
              mchAPIv3Key: "",//商户APIv3密钥
              mchCertificateSerialNumber: "",//商户证书序列号
              privatekey:"",//商户私钥
          });
          //验证密码
        const submitPassword = reactive<submitPasswordItem>({
              show: false,
              loading: false,
              password: '',
              from:"",
              data:{},
          });
          //提交数据
          const onFinish = (values: any) => {
            console.log('Success:', values);
            submitPassword.show=true
            submitPassword.from="savedata"
            submitPassword.data=values
          };
          //保存数据
          async function savedata(){
            try {
                createMessage.loading({ content: '提交中...', key:"savePay",duration:0});
                if(unref(wxpay_id)>0){
                  submitPassword.data["id"]=unref(wxpay_id)
                }
                const resultdata = await savePay(submitPassword.data);
                if(resultdata){
                  createMessage.success({ content: '提交成功！', key:"savePay", duration: 2 });
                }
              } catch {
                createMessage.destroy();
              }
          }
        const onFinishFailed = (errorInfo: any) => {
          console.log('Failed:', errorInfo);
        };
      //初始化
      onMounted(async() => {
        const data = await getPayIinfo({});
        if(data){
          wxpay_key.value=true
          wxpay_id.value=data.id
          wxpayFome.appId=data.appId
          wxpayFome.mchID=data.mchID
          wxpayFome.mchAPIv3Key=data.mchAPIv3Key
          wxpayFome.mchCertificateSerialNumber=data.mchCertificateSerialNumber
          wxpayFome.privatekey=data.privatekey
        }
      });
        //打开查看秘钥
        function showKey(){
          submitPassword.show=true
          submitPassword.from="showkey"
        }
        //确认密码-返回
        function handleOkPassword(){
            const password = ref(userStore.getUserInfo?.password || '');
            const salt = ref(userStore.getUserInfo?.salt || '');
          submitPassword.loading=true
          if(!submitPassword.password){
            createMessage.error("请输入密码！")
            submitPassword.loading=false
          }else if(md5(md5(submitPassword.password)+unref(salt))!=unref(password)){
            createMessage.error("您输入的密码错误！")
            submitPassword.loading=false
          }else{//验证成功
            submitPassword.show=false
            submitPassword.loading=false
            if(submitPassword.from=="showkey"){
              wxpay_key.value=false
            }else if(submitPassword.from=="savedata"){
              savedata()
            }
          }
        }
        //上传私钥
        const upLoading=ref(false)
        async function beforeUpload(file){
          // 设置最大值，则判断
         var farr=file.name.split(".")
          if (farr[farr.length-1]!="pem") {
            createMessage.error(`请上传pem格式文件`);
            return false;
          }
          createMessage.loading({ content: '准备上传...', key:"uploadFile",duration:0});
          //开始手动上传
          const filename=file?.name||""
          upLoading.value=true
          const upres= await uploadFile({ name: 'file', file: file, filename,data:{}}, (progressEvent) => {
                // 原生获取上传进度的事件
                if (progressEvent.lengthComputable) {
                  createMessage.loading({ content: '开始上传...', key:"uploadFile",duration:0});
                }
            })
          if(upres.status==200&&upres.data){
            if(upres.data.code==0){
              wxpayFome.privatekey= upres.data.result.url
            }
            createMessage.success({ content: '上传成功！', key:"uploadFile", duration: 2 });
            upLoading.value=false
            //更新数据
          }else{
            createMessage.destroy("uploadFile");
          }
          return false;
        }
        return {
          activeKey: ref('wxpay'),beforeUpload,
          wxpayFome,wxpay_key,submitPassword,
          onFinish,showKey,handleOkPassword,
          onFinishFailed,
        };
      },
    });
  </script>
<style lang="less" scoped>
.p-2{
  width: 100%;
  height: 100%;
}
 .topcard{
     width: 100%;
     height: 100%;
    background-color: #fff;
    border-radius: 2px;
    padding: 10px;
    .formbox{
      width: 550px;
      .edit{
        height: 100%;
        width: 70px;
        display:inline-block;
        padding: 10px;
        text-align: center;
        user-select: none;
      }
    }
 }
 .ssPassword{
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  .label{
    padding-right: 3px;
  }
  .text{
    flex:1;
  }
 }
 //上传文件
 .upbox{
  margin-top: 2px;
  .pemfile{
    color: #0960bd;
    padding-bottom: 5px;
  }
 }
</style>
  