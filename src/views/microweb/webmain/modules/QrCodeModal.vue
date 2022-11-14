<template>
  <BasicModal
    @register="register"
    title="二维码编辑"
    :showOkBtn="false"
    :showCancelBtn="false"
    width="780px"
    :bodyStyle="{ background: '#ededed'}"
  >
    <div class="editeQrcode">
        <div class="editebtn">
          <a-form
            layout="horizontal"
            ref="formRef"
          >
          <Tabs v-model:activeKey="activeKey" @change="changeTabs">
            <TabPane key="1" tab="基本设置" >
                  <div style="display:flex ;">
                  <div style="flex:1;">
                    <a-form-item label="二维码颜色" class="lef" name="color">
                        <!-- 颜色选择器 hsl / hsv / hex / rgb-->
                        <el-config-provider :locale="locale">
                            <el-color-picker
                              v-model="qrSeteData.color"
                              show-alpha
                              color-format="hex"
                              :predefine="predefineColors"
                              @change="reproduct"
                            >
                            </el-color-picker>
                          </el-config-provider>
                      </a-form-item>
                    </div>
                    <div style="flex:1;">
                      <a-form-item label="背景色" class="lef" name="bgcolor">
                        <el-config-provider :locale="locale">
                            <el-color-picker
                              v-model="qrSeteData.bgcolor"
                              show-alpha
                              color-format="hex"
                              :predefine="predefineColors"
                              @change="reproduct"
                            >
                            </el-color-picker>
                          </el-config-provider>
                      </a-form-item>
                    </div>
              </div>
                <a-form-item label="二维码大小" class="lef-height" name="width" >
                  <el-slider
                    v-model="qrSeteData.width"
                    :min="100"
                    :max="500"
                    :show-input="false"
                  >
                  </el-slider>
                </a-form-item>
                <a-form-item label="布画边距" class="lef-height" name="margin" >
                  <el-slider
                    v-model="qrSeteData.margin"
                    :min="0"
                    :max="15"
                    :show-input="false"
                    @change="reproduct"
                  >
                  </el-slider>
                </a-form-item>
                <a-form-item ref="name" label="标题" name="name" class="marbtom" help="标题会影响二维码显示，建议最后编写。">
                  <div style="display:flex ;">
                  <div style="flex:1;"> 
                      <a-input v-model:value="qrSeteData.name"  placeholder="二维码底部标题" maxlength="25" />
                  </div>
                  <div style="width: 50px;"> 
                    <el-config-provider :locale="locale">
                        <el-color-picker
                          v-model="qrSeteData.fontcolor"
                          show-alpha
                          color-format="hex"
                          :predefine="predefineColors"
                          @change="reproduct"
                        >
                        </el-color-picker>
                    </el-config-provider>
                  </div>
                  </div>
                </a-form-item>
              </TabPane>
            <TabPane key="2" tab="编辑logo" >
                <a-form-item label="logo文件" class="lef" name="src">
                  <div style="display:flex ;">
                    <div style="flex:1;"> 
                    <Avatar shape="square" @click="selectLogo" :src="logodata.src" :size="54">选择logo</Avatar>
                    </div>
                    <div  >
                      <a-button  @click="()=>{logodata.src='';logodata.bgColor='#FFFFFF00'}"><LinkOutlined />清除logo</a-button>
                    </div>
                  </div>
                </a-form-item>
                <a-form-item label="logo大小" class="lef" name="logoSize">
                  <el-slider
                    v-model="logodata.logoSize"
                    :min="0"
                    :step="0.1"
                    :max="1"
                    :show-input="false"
                    @change="reproduct"
                  >
                  </el-slider>
                </a-form-item>
                <a-form-item label="logo圆角" class="lef" name="borderRadius">
                  <el-slider
                    v-model="logodata.borderRadius"
                    :min="0"
                    :step="1"
                    :max="50"
                    :show-input="false"
                    @change="reproduct"
                  >
                  </el-slider>
                </a-form-item>
                <a-form-item label="边框大小" class="lef" name="borderRadius">
                  <el-slider
                    v-model="logodata.borderSize"
                    :min="0"
                    :step="0.01"
                    :max="1"
                    :show-input="false"
                    @change="reproduct"
                  >
                  </el-slider>
                </a-form-item>
                <a-form-item label="背景颜色" class="lef" name="bgColor">
                   <el-config-provider :locale="locale">
                    <el-color-picker
                      v-model="logodata.bgColor"
                      show-alpha
                      color-format="hex"
                      :predefine="predefineColors"
                      @change="reproduct"
                    >
                    </el-color-picker>
                </el-config-provider>
              </a-form-item>
            </TabPane>
            <TabPane key="3" tab="我的样式" >
              <div class="qrtpllist"> 
                 <div class="qrtplitem" v-for="item in qrTpllist" :key="item['id']">
                     <img :src="item['image']" :alt="item['title']"/>
                     <div class="dobtn">
                       <div class="usebtn  " @click="useTpl(item['jsondata'])">使用</div>
                       <div class="delbtn  " @click="delTpl(item['id'])">删除</div>
                     </div>
                 </div>
              </div>
              <div  class="qrfooterpage">
                <a-pagination v-model:current="qrTplpage" :total="pageTotal" show-less-items @change="changePage"/>
              </div>
            </TabPane>
          </Tabs>
          </a-form>
          <div class="footerbtn">
              <a-button type="primary" @click="reproduct" style="margin-left: 3px;" v-if="activeKey=='1'||activeKey=='2'">重新生成</a-button>
              <a-button @click="saveQrTpl" style="margin-left: 3px;" v-if="activeKey=='1'||activeKey=='2'">存为模板</a-button>
          </div>
        </div>
        <div class="Qrcodebox">
          <div class="mobileview" >
            <div v-if="showQrcode">
              <QrCode
                  :value="qrSeteData.url"
                  v-if="logodata.src"
                  ref="qrRef"
                  class="enter-x flex justify-center xl:justify-start"
                  :options="{
                    width:qrSeteData.width,
                    color: { 
                      dark: qrSeteData.color,
                      light: qrSeteData.bgcolor 
                    },
                    margin: qrSeteData.margin
                  }"
                  :logo="logodata"
                  @done="onQrcodeDone"
              />
              <QrCode
                  :value="qrSeteData.url"
                  v-else
                  ref="qrRef"
                  class="enter-x flex justify-center xl:justify-start"
                  :options="{
                    width:qrSeteData.width,
                    color: { 
                      dark: qrSeteData.color,
                      light: qrSeteData.bgcolor 
                    },
                    margin: qrSeteData.margin
                  }"
                  @done="onQrcodeDone"
              />
            </div>
          </div> 
          <div class="footerbtn">
              <a-button  @click="copyLink(qrURl)"><LinkOutlined />复制链接</a-button>
              <a-button type="primary" :loading="loading" @click="download" style="margin-left: 3px;">下载二维码</a-button>
          </div>
        </div>
      <!-- 上传图片 -->
      <uploadimg ref="uploadRef" @uploadInformation="uploadInformation" /> 
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import uploadimg from '/@/components/webEditor/uploadImg/index.vue' //图片上传
  import { defineComponent ,ref,unref,reactive,toRefs,nextTick} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { GetWebLink } from '/@/utils/imgurl';
  //复制
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  //提示
  import { useMessage } from '/@/hooks/web/useMessage';
  import { QrCode,QrCodeActionType} from '/@/components/Qrcode/index';
  //UI
  import { Form,Tabs,TabPane,Avatar,Pagination} from 'ant-design-vue';
  import { ElColorPicker,ElConfigProvider ,ElInput,ElSelect,ElOption,ElSlider } from 'element-plus'
  //APi
  import { addQrTpl,getQrTpl,delQrTpl } from '/@/api/microweb/webmain';
  export default defineComponent({
    name:"QrCodeModal",
    components: { BasicModal,QrCode,uploadimg,
    AForm:Form, AFormItem: Form.Item,Tabs,TabPane,Avatar,APagination:Pagination,
    ElColorPicker,ElConfigProvider ,ElInput,ElSelect,ElOption,ElSlider },
    emits: ['upcateData'],
    setup(_, { emit }) {
      const datas = reactive({
          qrSeteData:{
            url:"",
            showlogo:false,
            name:"",
            color:"#000000ff",
            bgcolor:"#ffffffff",
            fontcolor:"#000000FF",
            width:200,
            margin:5,
        },
        logodata:{
            src: '',
            logoSize: 0.2,
            borderSize: 0.05,
            borderRadius: 5,
            bgColor: '',
          }
      });
      const showQrcode = ref(true);
      const qrcodetitle = ref("");
      const qrURl = ref("");
      const { clipboardRef, copiedRef } = useCopyToClipboard(); //复制
      const { createMessage } = useMessage();//提示
      const [register, { closeModal, setModalProps }] = useModalInner((data) => {
        data && onDataReceive(data);
      });
      function upcateData(){
        emit('upcateData');
      }
      //处理打开
      function onDataReceive(data) {
        //初始化数据
        qrcodetitle.value=data.title
         datas.qrSeteData.name=data.title
         setModalProps({ title: `二维码编辑：${data.title}` });
          qrURl.value = GetWebLink(data.homeid)
          datas.qrSeteData.url = GetWebLink(data.homeid)
        //  console.log('处理打开', qrURl.value);
      }
  
      //监听开关
      function handleVisibleChange(v) {
        console.log('监听开关', v);
        // console.log('数据', props.qrcodeData);
        // v && props.qrcodeData && nextTick(() => onDataReceive(props.qrcodeData));
      }
       //下载
        const loading=ref(false);
        const qrRef = ref<Nullable<QrCodeActionType>>(null);
        function download() {
          loading.value=true
          const qrEl = unref(qrRef);
          if (!qrEl){
            createMessage.warning('下载失败');
            loading.value=false
          }else{
            qrEl.download(qrcodetitle.value);//文件名
            loading.value=false
          }
          nextTick(() =>{
            reproduct()
          });
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
        }
      }
      //自定义的绘制
      // const Qrcodectx=ref()
      function onQrcodeDone({ ctx }: any) {
        if (ctx instanceof CanvasRenderingContext2D) {
            ctx.fillStyle = datas.qrSeteData.fontcolor;
            ctx.font = '14px "微软雅黑"';
            ctx.textBaseline = 'bottom';
            ctx.textAlign = 'center';
            ctx.fillText(datas.qrSeteData.name, 100, 195, 200);
        }
      }
      //重新生产二维码
      function reproduct(){
        showQrcode.value=false
        nextTick(() =>{
          showQrcode.value=true
        });
      }
      // 选择Logo
      const uploadRef=ref()
      function selectLogo() {
        uploadRef.value.showUpload()
      }
      //选择图片返回
      function uploadInformation(res) {
          datas.logodata.src=res
          nextTick(() =>{
            reproduct()
          });
      }
      //保存样式
      async function saveQrTpl() {
        try {
            createMessage.loading({ content: '模板保存中...', key:"saveTpl",duration:0});
            const qrEl = unref(qrRef);
              if (!qrEl){
                createMessage.warning('二维码无法生产图片，无法保存！');
              }else{
                const sdata={title: datas.qrSeteData.name,image:qrEl.getbase64(),jsondata:JSON.stringify(datas)}
                const resultdata = await addQrTpl(sdata);
                if(resultdata){
                  createMessage.success({ content: '模板成功！', key:"saveTpl", duration: 2 });
                }
              }
          } catch {
            createMessage.destroy();
          }
      }
    //获取模板信息
    const qrTpllist=ref([])
    const qrTplpage=ref(1)
    const pageTotal=ref(0)
    async function getQrTplData(){
      const QrTpldata=await getQrTpl({page:qrTplpage.value})
      qrTpllist.value= QrTpldata.list
      pageTotal.value= QrTpldata.total
    }
    //页面切换
    function changePage(page){
      qrTplpage.value=page
      getQrTplData()
    }
    //切换tab
    function changeTabs(activeKey){
       reproduct()
        if(activeKey=='3'){
            getQrTplData()
        }
    }
    //使用模板样式
    function useTpl(jsondata){
      const jsondata_arr=JSON.parse(jsondata)
      const qrname=datas.qrSeteData.name
      datas.qrSeteData=jsondata_arr.qrSeteData
      datas.qrSeteData.url=qrURl.value
      if(datas.qrSeteData.name){
        datas.qrSeteData.name=qrname||qrcodetitle.value
      }
      datas.logodata=jsondata_arr.logodata
      nextTick(() =>{
        reproduct()
      });
    }
    //删除模板样式
    async function delTpl(id){
      try {
            createMessage.loading({ content: '模板删除中...', key:"delTpl",duration:0});
            const resultdata = await delQrTpl({id:id});
            if(resultdata){
              getQrTplData()
              createMessage.success({ content: '删除成功！', key:"delTpl", duration: 2 });
            }
          } catch {
            createMessage.destroy();
          }
    }
      return {
        activeKey: ref('1'),
        ...toRefs(datas),
        register,
        closeModal,
        upcateData,
        handleVisibleChange,copyLink,qrURl,uploadInformation,selectLogo,uploadRef,
        loading,download,qrRef,onQrcodeDone,reproduct,showQrcode,
        saveQrTpl,getQrTplData,qrTpllist,changeTabs,useTpl,delTpl,qrTplpage,pageTotal,changePage,
        locale:{
            name: 'zh-cn',
            el: {
              colorpicker: {
                confirm: '确定',
                clear: '清空',
              },
            }
          },
          predefineColors: [
            // 颜色选择器预设
            '#ff4500',
            '#ff8c00',
            '#ffd700',
            '#90ee90',
            '#00ced1',
            '#1e90ff',
            '#c71585',
            '#409EFF',
            '#909399',
            '#C0C4CC',
            'rgba(255, 69, 0, 0.68)',
            'rgb(255, 120, 0)',
            'hsv(51, 100, 98)',
            'hsva(120, 40, 94, 0.5)',
            'hsl(181, 100%, 37%)',
            'hsla(209, 100%, 56%, 0.73)',
            '#c7158577',
            'rgba(255, 255, 255, 0)',
            '#ffffff',
            '#000000',
          ],
      };
    },
  });
</script>
<style lang="less" scoped>
  .editeQrcode{
     display: flex;
     .editebtn{
      width: 380px;
      background: #ffffff;
      border-radius: 3px;
      padding: 15px;
      padding-top: 0px;
     }
     .Qrcodebox{
      flex:1;
      .mobileview{
        display: flex;
        justify-content: center;
        align-items: center;
      }
     }
  }
  .footerbtn{
      padding-top: 10px;
      text-align: center;
    }
  .lef {
    display: flex;
    flex-direction: unset;
    margin-bottom:5px;
    :deep(.ant-form-item-label) {
      text-align: left;
      margin-right: 20px;
      line-height: 32px;
    }
  }
  .marbtom{
    margin-bottom: 10px;
  }
  .lef-height {
    display: flex;
    flex-direction: unset;
    margin-bottom:0;
    :deep(.ant-form-item-label) {
      text-align: left;
      width: 80px;
      float: left;
    }
    :deep(.el-form-item__content ){
      margin-left: 80px;
    }
  } 
  .qrtpllist{
    display: flex;
    .qrtplitem{
       width: 80px;
       height: 80px;
       position: relative;
       border: 1px solid #ffffff;
       border-radius: 3px;
       overflow: hidden;
       &:hover {
        border: 1px solid #155bd4;
        border-radius: 3px;
        .dobtn{
          display:inline-block
        }
      }
       img{
        width: 100%;
        height: 100%;
       }
       .dobtn{
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          .usebtn{
            background: #2f54eb;
            width: 50px;
            text-align: center;
            padding: 2px 0px;
            font-size: 12px;
            color: #fff;
            cursor: pointer;
            border-radius: 10px;
          }
          .delbtn{
            background: #ff4d4f;
            color: #ffffff;
            width: 50px;
            text-align: center;
            padding: 2px 0px;
            font-size: 12px;
            color: #fff;
            cursor: pointer;
            border-radius: 10px;
            margin-top: 5px;
          }
       }
    }
  }
  .qrfooterpage{
     margin-top: 10px;
     text-align: right;
  }
</style>
