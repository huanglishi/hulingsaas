<template>
    <a-modal
        ref="modalRef"
        v-model:visible="saveComponentShow"
        :wrap-style="{ overflow: 'hidden' }"
        okText="保存模板"
        @ok="svaeData"
        :mask="false"
        :maskClosable="false"
        >
        <template #title>
            <div ref="modalTitleRef" style="width: 100%; cursor: move">保存为模板库</div>
        </template>
        <template #modalRender="{ originVNode }">
            <div :style="transformStyle">
                <component :is="originVNode" />
            </div>
        </template>
        <div class="formbox" >
            <div class="field">
                <div class="label">模板名称：</div>
                <div class="text">
                    <a-input v-model:value="saveCdata.title"  placeholder="填写模板名称"  />
                </div>
            </div>
            <div class="field">
                <div class="label">模板描述：</div>
                <div class="text">
                    <a-textarea v-model:value="saveCdata.details"  placeholder="说明模板功能，方便使用选择模板"/>
                </div>
            </div>
            <div class="field">
                <div class="label"><span style="color: red;">*</span>所属行业：</div>
                <div class="text">
                    <a-select
                        show-search
                        :filter-option="filterOption"
                        v-model:value="saveCdata.cid"
                        style="width: 100%"
                        placeholder="请选择模板适用于那个行业"
                        :options="cateList"
                        allowClear
                        ref="selectCateRef"
                        :fieldNames="{
                            label:  'name', value: 'id', options: 'children'
                        }"
                    />
                </div>
            </div>
            <div class="field">
                <div class="label">是否公开：</div>
                <div class="text"> <a-switch v-model:checked="saveCdata.type" checked-children="公开" un-checked-children="私有" :checkedValue="1" :unCheckedValue="0"/></div>
            </div>
            <div class="field">
                <div class="label">保存模板：</div>
                <div class="text">
                    <a-radio-group v-model:value="saveCdata.savetype" @change="changeType">
                        <a-radio value="onepage">仅保存单个页面(当前选择)</a-radio>
                        <a-radio value="allpage">保存整个轻站</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="field">
                <div class="label">素材封面：</div>
                <div class="text"> 
                    <div class="backgroundImg" >
                        <!-- <i class="el-icon-plus" v-if="!saveCdata.image" size="30">+</i> -->
                        <Icon v-if="!saveCdata.image" @click="UpImg" size="45" icon="line-md:image-twotone"></Icon>
                        <div v-else class="imgbox" @click="() => setVisible(true)">
                            <img draggable="false" :src="saveCdata.image"  />
                            <div class="preview">
                                <div>预览</div>
                            </div>
                        </div>
                        <div class="imhbtn" @click="UpImg">{{saveCdata.image?"更换封面":"上传封面"}}</div>
                    </div>
                    <!--图片预览-->
                    <a-image
                        :width="200"
                        :style="{ display: 'none' }"
                        :preview="{
                            visible,
                            onVisibleChange: setVisible,
                        }"
                        :src="saveCdata.image"
                    />
                    
                </div>
            </div>
        </div>
        <!-- 上传图片 -->
       <uploadimg ref="uploadRef" @uploadInformation="uploadInformation" /> 
    </a-modal>
</template>
<script lang="ts">
import { defineComponent,ref,reactive,computed, CSSProperties, watch, watchEffect } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { addTpl,addWebTpl,getSelectTplGroup } from '/@/api/microweb/webmain';
import { Modal,Button ,Switch,Image,RadioGroup,Radio,Select} from 'ant-design-vue';
import { useDraggable } from '@vueuse/core';
import uploadimg from '/@/components/webEditor/uploadImg/index.vue' //图片上传
import { Icon } from '/@/components/Icon';
export default defineComponent({
    components: {uploadimg,[Modal.name]:Modal,[Button.name]:Button,[Switch.name]:Switch,[Image.name]:Image,
    [RadioGroup.name]:RadioGroup,[Radio.name]:Radio,[Select.name]:Select,Icon},
    emits: ['ok'],
    setup(_, { emit }) {
        const uploadRef=ref()
     //提示
    const {
       createErrorModal,
       createMessage,
    } = useMessage();
    //显示
    const saveComponentShow=ref(false)
    const cateList=ref([])//行业分类数据
    const postdatas=ref()//传过来的数据
    const saveCdata = reactive({
        cid:null,
        image:"",
        title:"",
        details:"",
        type:0,
        savetype:'allpage',
    })
    //显示弹框
   async function show(data){
        saveComponentShow.value=true
        postdatas.value=data
        saveCdata.title =data.webPageData.title
        saveCdata.details =data.webPageData.des
        saveCdata.image =""
        //获取分类数据
        cateList.value= await getSelectTplGroup()
    }
    //保存类型改变
    function changeType(e:Event){
        if(e.target.value=="allpage"){
            saveCdata.title =postdatas.value.webPageData.title
            saveCdata.details =postdatas.value.webPageData.des
        }else{
            saveCdata.title =postdatas.value.pageSetup.name
            saveCdata.details =postdatas.value.pageSetup.details
        }
    }
    //显示图片选择器
    function UpImg() {
        uploadRef.value.showUpload()
    }
    //选择图片返回
    function uploadInformation(res:any) {
        if(res){
          saveCdata.image=res
        }
    }
    //提交保存
    const selectCateRef=ref()
    async function svaeData(){
        if(!saveCdata.cid||saveCdata.cid==0){
            createMessage.error("请选择模板所属行业（分类）")
            selectCateRef.value.focus()
            return
        }
        if(!saveCdata.image){
            createMessage.error("请上传封面）")
            return
        }
        let datas=postdatas.value
        if(saveCdata.savetype=="onepage"){//保存单个页面
            createMessage.loading({ content: '模板保存中...', key:"saveTpl",duration:0});
            const sdata={
                pageid:parseInt(datas.pageSetup.id),
                image:saveCdata.image,
                cid:saveCdata.cid,
                title:saveCdata.title,
                type:saveCdata.type,
                details:saveCdata.details,
                webid:datas.webPageData.id, 
                templateJson:JSON.stringify(datas.pageSetup),
                component:JSON.stringify(datas.pageComponents)}
            const resultdata = await addTpl(sdata);
            if(resultdata){
                saveComponentShow.value=false
                createMessage.success({ content: '模板保存成功！', key:"saveTpl", duration: 2 });
            }
        }else{//保存整站
            createMessage.loading({ content: '模板保存中...', key:"saveTpl",duration:0});
            let webHome_id=0;
            let countnum=0;
            datas.pageList.forEach((pane) => {
                if (pane.pageSetup.ishome) {
                    countnum++
                    if(webHome_id==0){
                        webHome_id=pane.pageSetup.id
                    }
                }
            });
            if(countnum>1){
                createErrorModal({ title: '多个入口', content: `您的页面中有${countnum}个入口，您先把多余的入口关闭只能留一个` });
                return
            }
            const sdata={
                image:saveCdata.image,
                cid:saveCdata.cid,
                home_id:webHome_id,
                title:saveCdata.title,
                type:saveCdata.type,
                details:saveCdata.details,
                webid:datas.webPageData.id, 
                pagelist:datas.pageList,
                jsondata:JSON.stringify(datas.pageList)}
            const resultdata = await addWebTpl(sdata);
            if(resultdata){
                saveComponentShow.value=false
                createMessage.success({ content: '模板保存成功！', key:"saveTpl", duration: 2 });
            }
        }
        createMessage.destroy();
        emit('ok');
    }
    const visible = ref(false);
    const setVisible = (value) => {
      visible.value = value;
    };
    //model
    const modalTitleRef = ref<HTMLElement>(null);
    const { x, y, isDragging } = useDraggable(modalTitleRef);
    const startX = ref<number>(0);
    const startY = ref<number>(0);
    const startedDrag = ref(false);
    const transformX = ref(0);
    const transformY = ref(0);
    const preTransformX = ref(0);
    const preTransformY = ref(0);
    const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
    watch([x, y], () => {
      if (!startedDrag.value) {
        startX.value = x.value;
        startY.value = y.value;
        const bodyRect = document.body.getBoundingClientRect();
        const titleRect = modalTitleRef.value.getBoundingClientRect();
        dragRect.value.right = bodyRect.width - titleRect.width;
        dragRect.value.bottom = bodyRect.height - titleRect.height;
        preTransformX.value = transformX.value;
        preTransformY.value = transformY.value;
      }
      startedDrag.value = true;
    });
    watch(isDragging, () => {
      if (!isDragging) {
        startedDrag.value = false;
      }
    });
    watchEffect(() => {
      if (startedDrag.value) {
        transformX.value =
          preTransformX.value +
          Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
          startX.value;
        transformY.value =
          preTransformY.value +
          Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
          startY.value;
      }
    });
    const transformStyle = computed<CSSProperties>(() => {
      return {
        transform: `translate(${transformX.value}px, ${transformY.value}px)`,
      };
    });
    //筛选
    const filterOption = (input: string, option: any) => {
      return option.name.indexOf(input) >= 0;
    };
    return {
        saveCdata,uploadRef,UpImg,
        show,saveComponentShow,
        postdatas,changeType,
        svaeData,
        visible,
        setVisible,
        uploadInformation,
        //model
        modalTitleRef,
       transformStyle,
       cateList,filterOption,selectCateRef,
    };
    },
});
</script>
<style lang="less" scoped>
    .formbox{
        position: relative;
        padding: 10px 15px;
        .field{
            display: flex;
            margin-bottom: 10px;
            .label{
                width: auto;
            }
            .text{
                flex:1;
            }
        }
        //图片
        .backgroundImg {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: 100px;
            height: 110px;
            overflow: hidden;
            position: relative;
            background: #f2f4f6;
            img {
                width: 100%;
                height: auto;
            }
            .imgbox{
                position: relative;
                .preview{
                    position: absolute;
                    top:0px;
                    left: 0px;
                    bottom: 0px;
                    right: 0px;
                    text-align: center;
                    color: #fff;
                    background: rgba(0,0,0,.5);
                    cursor: pointer;
                    opacity: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                &:hover{
                    .preview{
                        opacity: 1;
                    }
                }
            }
            .imhbtn {
                width: 100%;
                height: 20px;
                font-size: 12px;
                color: #fff;
                background: rgba(0, 0, 0, 0.336);
                text-align: center;
                line-height: 20px;
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
    }
    .footerbtn{
        text-align: center;
        width: 100%;
        position: absolute;
    }
</style>
  