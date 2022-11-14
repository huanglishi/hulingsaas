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
                      name="mch_id"
                      :rules="[{ required: true, message: '请填写微信支付商户平台的商户号' }]"
                    >
                      <a-input v-model:value="wxpayFome.mch_id" placeholder="写微信支付商户平台的商户号"/>
                    </a-form-item>

                    <a-form-item
                      label="微信支付商户密钥"
                      name="mch_key"
                      :rules="[{ required: true, message: '请填写微信支付商户平台的商户密钥' }]"
                    >
                      <a-input-password v-model:value="wxpayFome.mch_key" :disabled="wxpay_key" style="width: calc(100% - 70px);" placeholder="填写微信支付商户平台的商户密钥"/>
                      <a class="edit" @click="showKey">查看</a>
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
    import { Tabs,TabPane ,Form,FormItem,Modal} from 'ant-design-vue';
    import { WXpayItem,submitPasswordItem } from './data';
    import { useMessage } from '/@/hooks/web/useMessage';
    import { useUserStore } from '/@/store/modules/user';
    //API
    import { getPayIinfo,savePay } from '/@/api/system/payment';
    import md5 from 'md5'
    export default defineComponent({
      name: 'paymentConfig',
      components: { Icon,
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
              mch_id: '',
              mch_key: "",
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
          wxpayFome.mch_id=data.mch_id
          wxpayFome.mch_key=data.mch_key
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
        return {
          activeKey: ref('wxpay'),
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
      width: 500px;
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
</style>
  