<template>
      <div class="p-2">
      <div class="topcard">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="base" tab="基本设置">
               <div class="formbox">
                  <a-row :gutter="24">
                    <a-col :span="14">
                      <BasicForm @register="registerBase" />
                      <div class="footerbtn"><a-button type="primary" @click="handleSubmit"> 更新基本信息 </a-button></div>
                    </a-col>
                    <a-col :span="10">
                      <div class="change-avatar">
                        <div class="mb-2">头像</div>
                        <CropperAvatar
                          :uploadApi="uploadApi"
                          :value="avatar"
                          btnText="更换头像"
                          :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
                          @change="updateAvatar"
                          width="150"
                        />
                      </div>
                    </a-col>
                  </a-row>
               </div>
            </a-tab-pane>
            <a-tab-pane key="security" tab="安全设置" >
              <div class="security">
                <div class="py-8 bg-white flex flex-col justify-center items-center">
                  <BasicForm @register="registerSecurity" />
                  <div class="flex justify-center">
                    <a-button @click="resetFields"> 重置 </a-button>
                    <a-button class="!ml-4" type="primary" @click="securitySubmit"> 确认 </a-button>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div> 
      </div>
  </template>
  <script lang="ts">
    import { defineComponent ,ref,onMounted,computed} from 'vue';
    import { Icon } from '/@/components/Icon';
    import { Tabs,TabPane,Row,Col} from 'ant-design-vue';
    import { baseSetschemas,formSecurity } from './data';
    import { useMessage } from '/@/hooks/web/useMessage';
    import { useUserStore } from '/@/store/modules/user';
    import { CropperAvatar } from '/@/components/Cropper';
    import { BasicForm, useForm } from '/@/components/Form/index';
    //API
    import { getUserInfo ,upUserInfo,upAvatar,changePwd} from '/@/api/system/account';
    //工具
    import { ReplaceUrl } from '/@/utils/imgurl';
    import md5 from 'md5'
    import { uploadApi } from '/@/api/common/upload';
    export default defineComponent({
      name: 'accountManage',
      components: { 
        Icon,
        ATabs:Tabs,
        ATabPane:TabPane,
        ARow: Row,
        ACol: Col,
        BasicForm,
        CropperAvatar,
    },
      setup() {
        const userStore = useUserStore();
        //基本信息表单
        const [registerBase, { setFieldsValue,validate }] = useForm({
          labelWidth: 120,
          schemas: baseSetschemas,
          showActionButtonGroup: false,
        });
        //安全配置
        const [registerSecurity, { validate:validateSecurity, resetFields }] = useForm({
          size: 'large',
          baseColProps: { span: 24 },
          labelWidth: 100,
          showActionButtonGroup: false,
          schemas: formSecurity,
        });
        onMounted(async () => {
          const data = await getUserInfo();
          setFieldsValue(data);
        });
        //头像初始化
        const avatar = computed(() => {
          console.log( userStore.getUserInfo)
          const { avatar } = userStore.getUserInfo;
          return avatar;
        });
          const {createMessage,} = useMessage();
          //保存数据
          async function handleSubmit(){
            try {
                createMessage.loading({ content: '提交中...', key:"upUserInfo",duration:0});
                const data = await validate();
                const resultdata = await upUserInfo(data);
                if(resultdata){
                  createMessage.success({ content: '提交成功！', key:"upUserInfo", duration: 2 });
                }else if(resultdata==0){
                  createMessage.success({ content: '已提交！', key:"upUserInfo", duration: 2 });
                }
              } catch {
                createMessage.destroy();
              }
          }
        //头像上返回
        async function updateAvatar({data}) {
          const res= await upAvatar(data.url);
          if(res){
            const userinfo = userStore.getUserInfo;
            userinfo.avatar = ReplaceUrl(data.url);
            userStore.setUserInfo(userinfo);
          }
        }
        //安全配置
        async function securitySubmit() {
          try {
            createMessage.loading({ content: '修改中...', key:"upUserInfo",duration:0});
            const values = await validateSecurity();
            const { passwordOld, passwordNew } = values;
            const resultdata =await changePwd({passwordOld:md5(passwordOld),passwordNew:md5(passwordNew)})
            if(resultdata){
                  createMessage.success({ content: '修改成功！', key:"upUserInfo", duration: 2 });
              }else if(resultdata==0){
                createMessage.success({ content: '已修改！', key:"upUserInfo", duration: 2 });
              }
          } catch (error) {
            createMessage.destroy("upUserInfo");
          }
        }
        return {
          activeKey: ref('base'),
          handleSubmit,uploadApi,avatar,updateAvatar,
          registerBase,
          registerSecurity,resetFields,securitySubmit,
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
      width: 100%;
      .footerbtn{
       text-align: center;
      }
    }
    .change-avatar {
        img {
          display: block;
          margin-bottom: 15px;
          border-radius: 50%;
        }
      }
    .security{
     width: 500px;
    }
 }
</style>
  