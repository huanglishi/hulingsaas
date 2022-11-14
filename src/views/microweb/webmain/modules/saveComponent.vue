<template>
        <a-modal
            ref="modalRef"
            v-model:visible="saveComponentShow"
            :wrap-style="{ overflow: 'hidden' }"
            okText="保存素材"
            @ok="svaeData"
            :mask="false"
            :maskClosable="false"
            >
            <template #title>
                <div ref="modalTitleRef" style="width: 100%; cursor: move">保存组件</div>
            </template>
            <template #modalRender="{ originVNode }">
                <div :style="transformStyle">
                   <component :is="originVNode" />
                </div>
            </template>
        <div class="formbox" >
            <div class="field">
                <div class="label">素材名称：</div>
                <div class="text">
                    <a-input v-model:value="saveCdata.title"  placeholder="填写素材名称"  />
                </div>
            </div>
            <div class="field">
                <div class="label">模板描述：</div>
                <div class="text">
                    <a-textarea v-model:value="saveCdata.details"  placeholder="说明素材功能，方便使用选择素材"/>
                </div>
            </div>
            <div class="field">
                <div class="label">是否公开：</div>
                <div class="text"> <a-switch v-model:checked="saveCdata.type" checked-children="公开" un-checked-children="私有" :checkedValue="1" :unCheckedValue="0"/></div>
            </div>
            <div class="field">
                <div class="label">素材封面：</div>
                <div class="text"> 
                    <div class="backgroundImg" >
                        <i class="el-icon-plus" v-if="!saveCdata.image" size="30" @click="UpImg">+</i>
                        <div v-else class="imgbox" @click="() => setVisible(true)">
                            <img draggable="false" :src="saveCdata.image"  />
                            <div class="preview">
                                <div>预览</div>
                            </div>
                        </div>
                        <div class="imhbtn" @click="UpImg">{{saveCdata.image?"更换封面":"上传封面"}}</div>
                    </div>
                    <a-image
                        :width="200"
                        :style="{ display: 'none' }"
                        :preview="{
                            visible,
                            onVisibleChange: setVisible,
                        }"
                        :src="saveCdata.image"
                    />
                    <div style="font-size: 12px;">提示：系统截图效果不佳，请您手动截图、ps修剪一下再手动上传封面图。</div>
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
import { addMaterial } from '/@/api/microweb/webmain';
import { Modal,Button ,Switch,Image} from 'ant-design-vue';
import { useDraggable } from '@vueuse/core';
import uploadimg from '/@/components/webEditor/uploadImg/index.vue' //图片上传
export default defineComponent({
    components: {uploadimg,[Modal.name]:Modal,[Button.name]:Button,[Switch.name]:Switch,[Image.name]:Image},
    emits: ['ok'],
    setup(_, { emit }) {
        const uploadRef=ref()
     //提示
    const {
       createMessage,
    } = useMessage();
    //显示
    const saveComponentShow=ref(false)
    const nowComponents=ref()
    const saveCdata = reactive({
        image:"",
        title:"",
        details:"",
        type:0,
    })
    //显示弹框
    function show(data,img){
        saveComponentShow.value=true
        nowComponents.value=data
        saveCdata.image=img
        saveCdata.title =data.text
        saveCdata.details =""
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
    async function svaeData(){
        createMessage.loading({ content: '素材保存中...', key:"saveMaterial",duration:0});
        const resultdata=await addMaterial({...saveCdata,jsondata:JSON.stringify(nowComponents.value)})
        if(resultdata){
          saveComponentShow.value=false
          createMessage.success({ content: '素材成功！', key:"saveMaterial", duration: 2 });
        }
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
    return {
        saveCdata,uploadRef,UpImg,
        show,saveComponentShow,
        nowComponents,
        svaeData,
        visible,
        setVisible,
        uploadInformation,
        //model
        modalTitleRef,
       transformStyle,
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
            height: 90px;
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
  