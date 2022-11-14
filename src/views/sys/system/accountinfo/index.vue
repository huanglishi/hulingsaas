<template>
  <PageWrapper title="修改当前用户信息"  >
    <template #headerContent>
      <div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="个人信息">
              <div class="fieldbox">
                <div class="left">
                  <BasicForm @register="registerInfo" />
                  <div class="flex justify-center">
                      <a-button @click="resetFields"> 重置 </a-button>
                      <a-button class="!ml-4" type="primary" @click="handleSubmit"> 更新 </a-button>
                    </div>
                </div>
                <div class="right">
                    <CropperAvatar :uploadApi="uploadApi" @change="onUpAvatar" :value="avatar" :width="140" btnText="更新头像"/>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="修改密码" force-render>
                <div class="py-8 bg-white flex flex-col justify-center items-center">
                   <BasicForm
                    :labelWidth="100"
                    size="large"
                    :schemas="pwdform"
                    :baseColProps="{ span: 24 }"
                    :actionColOptions="{ span: 12 }"
                    :submitButtonOptions="{text: '修改密码'}"
                    @submit="handleChangPwd"
                  />
                </div>
            </a-tab-pane>
          </a-tabs>
      </div> 
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent,ref,nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';

  import { pwdform } from './pwd.data';
  import { infoschemas } from './info.data';
  //UI
  import { Tabs ,TabPane} from 'ant-design-vue';
  import {  upAvatar,getAccount,saveData,changePwd } from '/@/api/sys/account';
  import {  uploadApi } from '/@/api/common/upload';
  //头像
   import {  CropperAvatar } from '/@/components/Cropper';
  import { useUserStore } from '/@/store/modules/user';
  //工具
  import { ReplaceUrl } from '/@/utils/imgurl';
  import { useMessage } from '/@/hooks/web/useMessage';
  import md5 from 'md5'
  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper,ATabs:Tabs, ATabPane:TabPane,
      CropperAvatar,},
    setup() {
      const keyword = ref<string>('');
      const userStore = useUserStore();
      const avatar = ref(userStore.getUserInfo?.avatar || '');
      const {
              createMessage,
              createSuccessModal,
            } = useMessage();
       const [registerInfo, { setFieldsValue, validate, resetFields }] = useForm({
        size: 'large',
        baseColProps: { span: 24 },
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: infoschemas,
      });
      nextTick(() => {
        getAccount().then((recod)=>{
              if(recod){
                setFieldsValue({
                  name:recod["name"],
                  nickname:recod["nickname"],
                  username:recod["username"],
                  telephone:recod["telephone"],
                  email:recod["email"],
                  remark:recod["remark"],
                });
          }
        })
        
      });
      //修改资料
      async function handleSubmit() {
        try {
          const values = await validate();
          values["id"]=userStore.getUserInfo.userId
          await saveData(values);
          // const { router } = useRouter();
          // router.push(pageEnum.BASE_LOGIN);
        } catch (error) {}
      }
       
  //修改密码
  async function handleChangPwd(values: any)  {
    const hide = createMessage.loading('修改中...', 0);
     try {
      const res =await changePwd({passwordOld:md5(values["passwordOld"]),passwordNew:md5(values["passwordNew"])}).finally(()=>{
          setTimeout(hide, 200);
      });
      
      if(res==1){
        createSuccessModal({ title: '提示', content: '密码已修改，请重新登录', 
        onOk() {
            userStore.logout(true)
            }
        });
      }
     } catch (error) {
       setTimeout(hide, 500);
     }
  }
  //更新头像
  async function onUpAvatar({data})  {
     const res= await upAvatar(data.url);
      if(res){
        res["avatar"]=ReplaceUrl(res["avatar"])
        userStore.setUserInfo(res)
      }
  }
  //头像
      return { 
        pwdform,
        registerInfo, 
        resetFields, 
        handleSubmit ,
        activeKey: ref('1'),
        handleReset: () => {
            keyword.value = '';
          },
        handleChangPwd,
        //头像
        avatar,
        uploadApi: uploadApi as any,
        onUpAvatar,
      };
    },
  });
</script>
<style lang="less">
.fieldbox{
  display: flex;
  .left{
   flex:1;
  }
  .right{
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;

  }
}
</style>