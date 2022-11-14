<template>
   <div class="layout">
    <section class="subject">
      <!-- 侧边栏 -->
      <side-bar  @change="sidebarChange"/>
      <!--右边功能-->
      <div class="right-home">
           <!--顶部工具栏-->
          <HeaderBar ref="headerBarRef" :pageList="pageList" :activePageKey="activePageKey"
          @preview="handelPreview"  @resetPage="resetPage"  @save="saveJSON" @finish="finishJSON" @mvsave="mvsaveJSON" 
          @closeEditor="closeBack" @saveTpl="saveTpl" @editWebPage="editWebPage" @editPage="editPage"
          @changePage="changePage" @selectWebTpl="selectWebTpl"/>
          <!--编辑区-->
          <!-- 装修操作 -->
            <section class="operation">
              <!-- 组件 -->
              <sliderassembly ref="sliderassemblyRef" :pointer="pointer" :pageList="pageList" :activePageKey="activePageKey" @useTpl="useTpl" 
              @changePage="changePage" @editleftPage="editleftPage"/>

              <!-- 手机 -->
              <div class="phone" @mouseleave="onmousePhoneLeave" @mouseenter="mousePhoneEnter">
                <section class="phoneAll" ref="imageTofile" id="imageTofile">
                  <img src="../../../assets/webeditor/phoneTop.png" alt="" class="statusBar" />
                  <!-- 头部导航 -->
                  <headerTop v-if="pageSetup.isShow" :pageSetup="pageSetup" @click="headTop" />

                  <!-- 主体内容 -->
                  <section
                    class="phone-container"
                    :style="{
                      'background-color': pageSetup.bgColor,
                      backgroundImage: 'url(' + pageSetup.bgImg + ')',
                    }"
                    @drop="drop($event)"
                    @dragover="allowDrop($event)"
                    @dragleave="dragleaves($event)"
                  >
                    <!-- 动态组件 -->
                    <vuedraggable
                      :class="pointer.show ? 'pointer-events' : ''"
                      :list="pageComponents"
                      item-key="index"
                      :forceFallback="true"
                      :animation="200"
                    >
                      <template #item="{ element, index }">
                        <component
                          :is="element.component"
                          :datas="element.setStyle"
                          :style="{
                            border:
                              element.active && deleShow ? '2px solid #155bd4' : '',
                          }"
                          @click="activeComponent(element, index)"
                          class="componentsClass"
                          :class="{doEdit: element.active && deleShow }"
                          :data-type="element.type"
                          :id="`components${index}`"
                          @focus="()=>{deleShow=true}"
                        >
                          <template #deles>
                            <div
                              v-show=""
                              class="deles"
                            >
                              <span class="iconfont icon-sanjiaoxingzuo"></span>
                              {{ element.text }}
                            </div>
                            <!--编辑工具-->
                            <div class="hindebtn editorPane" >
                                <div class="btnitem" @click.stop="deleteObj(index)">
                                  <a-tooltip placement="left">
                                    <template #title>
                                      <span>删除</span>
                                    </template>
                                    <div class="iconbtn"><Icon icon="ep:delete" :size="20"></Icon></div>
                                  </a-tooltip>
                                </div>
                                <div class="btnitem" @click.stop="saveMaterial(index)">
                                  <a-tooltip placement="left">
                                    <template #title>
                                      <span>存为素材</span>
                                    </template>
                                    <div class="iconbtn"><Icon icon="fluent:save-28-filled" :size="20"></Icon></div>
                                  </a-tooltip>
                                </div>
                                <div class="btnitem" @click.stop="cloneMaterial(index)">
                                  <a-tooltip placement="left">
                                    <template #title>
                                      <span>克隆</span>
                                    </template>
                                    <div class="iconbtn"><Icon icon="clarity:clone-solid" :size="20"></Icon></div>
                                  </a-tooltip>
                                </div>
                                <div class="btnitem" @click.stop="copyMaterial(index)">
                                  <a-tooltip placement="left">
                                    <template #title>
                                      <span>复制</span>
                                    </template>
                                    <div class="iconbtn"><Icon icon="radix-icons:copy" :size="20"></Icon></div>
                                  </a-tooltip>
                                </div>
                                <div class="btnitem" @click.stop="pasteMaterial(index)">
                                  <a-tooltip placement="left">
                                    <template #title>
                                      <span>粘贴</span>
                                    </template>
                                    <div class="iconbtn"><Icon icon="ooui:paste-ltr" :size="20"></Icon></div>
                                  </a-tooltip>
                                </div>
                            </div>
                          </template>
                        </component>
                      </template>
                    </vuedraggable>
                  </section>


                  <!-- 手机高度 -->
                  <div class="phoneSize">iPhone 8手机高度</div>

                  <!-- 底部 -->
                  <phoneBottom />
                </section>
                <!-- 底部 -->
              </div>

              <!-- 页面设置tab -->
             <div class="decorateTab">
                <span
                  :class="rightcom === 'decorate' ? 'active' : ''"
                  @click="rightcom = 'decorate'"
                >
                  <i class="iconfont icon-wangye"  ></i>
                  页面设置
                </span>
                <span
                  :class="rightcom === 'componenmanagement' ? 'active' : ''"
                  @click="rightcom = 'componenmanagement'"
                >
                  <i class="iconfont icon-zujian" ></i>
                  页面内容
                </span>
                <span
                  class="active"
                  v-show="rightcom != 'componenmanagement' && rightcom != 'decorate'"
                >
                  <i class="iconfont icon-zujian"  ></i>
                  模块设置
                </span>
              </div> 

              <!-- 右侧工具栏 -->
              <div class="decorateAll">
                <!-- 页面设置 -->
                <transition name="decorateAnima">
                  <!-- 动态组件 -->
                  <component
                    :is="rightcom"
                    :datas="currentproperties"
                    :paglist="pageList"
                    @componenmanagement="componenmanagement"
                  />
                </transition>
              </div>
            </section>
      </div>
    </section>
    <!--预览-->
    <realTimeView
      :datas="realTimeView"
      :val="{
        id,
        name: pageSetup.name,
        templateJson: JSON.stringify(pageSetup),
        component: JSON.stringify(pageComponents),
      }"
    />
    <!--轻站编辑-->
    <webDrawer :datas="webPageData"  @register="registerDrawer" @success="handleWebsaveback" />
    <!--保存组件-->
    <saveComponent ref="saveComponentRef"></saveComponent>
    <!--保存素材-->
    <saveWbMaterial ref="saveWbMaterialRef"></saveWbMaterial>
    <!--选择模板-->
    <SelectTemplate @register="selectTemplateModal" @upWebTpl="upWebTpl"/>
  </div>
</template>

<script >
  import utils from '/@/utils/webeditor/index' // 方法类
  import componentProperties from '/@/utils/webeditor/componentProperties' // 组件数据
  import { defineComponent, ref, unref,reactive,toRefs,watch,inject,onMounted,nextTick} from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  //APi
  import { getEditData,delPage,savePageData,saveAllPageData,addTpl,getTplData} from '/@/api/microweb/webmain';
  //返回
  import { useGo } from '/@/hooks/web/usePage';
  //操作标签
  import { useTabs } from '/@/hooks/web/useTabs';
  import { buildShortUUID } from '/@/utils/uuid';
  //组件
  import { useDrawer } from '/@/components/Drawer';
  import webDrawer from './modules/webDrawer.vue';
  import saveComponent from './modules/saveComponent.vue';
  import saveWbMaterial from './modules/saveWbMaterial.vue';
  import {HeaderBar,sliderassembly,sideBar,headerTop,phoneBottom,realTimeView} from './toolpage/index.js';
  import html2canvas from "html2canvas";
  import { useModal } from '/@/components/Modal';
  import SelectTemplate from './modules/SelectTemplate.vue';
  //引进组件
  import vuedraggable from 'vuedraggable' //拖拽组件
  import { Tooltip } from 'ant-design-vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  //某文件夹下所有vue组件的方法
  const utilFuns = {};
  const files = import.meta.globEager('../../../components/webEditor/**/*.vue');
  Object.keys(files).forEach((fileName) => {
    var name = fileName.replace(/\.\/|\/index.vue/g, '');
    if(name){
       const arrname=name.split("/")
       name=arrname[arrname.length-1]
    }
    utilFuns[name] = files[fileName].default;
  });
  export default defineComponent({
    name: 'webeditor',
    components: { PageWrapper,webDrawer,saveComponent,saveWbMaterial,
      Icon, 
      HeaderBar,sliderassembly,sideBar,headerTop,phoneBottom,realTimeView,
      vuedraggable,
      ...utilFuns,
      ATooltip:Tooltip,
      SelectTemplate,
    },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const route = useRoute();
      const go = useGo();
      const { clipboardRef, copiedRef } = useCopyToClipboard();
      // 此处得到ID
      const ID = ref(route.query?.id||0);
      const { closeCurrent,setTitle } = useTabs();
        //返回
        function goBack() {
          // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
          go('/microweb/webmain');
        }
        //关闭返回
        function closeBack() {
          if(!datas.webPageData.id||datas.webPageData.id==0){
            createConfirm({
                  iconType: "info",
                  title: '提示',
                  content: '您还没有保存数据再退出?',
                  okText:"保存",
                  onOk(){
                    doSaveAll("save")
                    nextTick(()=>{
                      closeCurrent()
                      goBack()
                    })
                  },
                  onCancel(){
                    closeCurrent()
                    goBack()
                  }
                });
            }else{
              closeCurrent()
              goBack()
            }
        }
        //获取时间戳
        function nowTimestamp(){
          let outcome = Math.round(new Date().getTime()/1000).toString();
          return outcome
        }
        //当前时间戳
        const saveTimestamp = ref(nowTimestamp());
        //选择分类
        const sliderassemblyRef = ref(null);
        function sidebarChange(activeKey) {
          sliderassemblyRef.value.selectCate(activeKey-1);
        }
        //提示
        const {
        createMessage,
        createConfirm,
        createSuccessModal,
        createInfoModal,
        createErrorModal,
        createWarningModal,
      } = useMessage();
      const { info, success, warning, error } = createMessage;
      /******************编辑器功能 *************************************************************/
       // 是否显示预览
      const realTimeView = reactive({ show: false })
      //页面数据
      const basePageData={
          id:0,//页面id
          uuid:buildShortUUID("p"),//初始uuid
          micweb_id:0,//属于的轻站数据id
          orderNum:1,//页面顺序
          // 页面设置属性
          name: '第1个页面', //页面名称
          details: '页面描述', //页面描述
          ishome: true, // 是否为首页-轻站入口
          isRightBtn: false, // 是否显示个人中心
          rightText:'个人中心',//右边按钮文字
          linktype:'10',//跳转连接类型'10'=内部链接
          link:"",//连接地址
          isBack: true, // 是否返回按钮
          backSize: 20, // 返回按钮大小
          isShow: true, // 是否显示头部
          titleHeight: 35, // 高度
          bgColor: 'rgba(249, 249, 249, 10)', //背景颜色
          bgImg: '', // 背景图片
        }
      // 页面数据
      const datas = reactive({
        pageSetup: basePageData,//编辑页面数据
        pageComponents: [], //页面组件
        pageList:[{
          pageSetup:basePageData,//页面数据
          pageComponents:[],//组件数据
        }],//页面列表
        activePageKey:basePageData.uuid,//选中页面
        webPageData:{//微信数据
          id: ID.value, //当前轻站id
          title: '轻站标题', //页面名称
          groupid: "", //轻站分组
          des: '轻站描述', //页面描述
        }
      })
       // 设置Tab的标题（不会影响页面标题）
     if(unref(ID)==0){
          setTitle('新建轻站');
          nextTick(()=>{
            editWebPage()
          })
      }else{
          setTitle('编辑轻站');
      }
      //页面切换
      function changePage(activeKey){
        datas.activePageKey=activeKey
        resetPageData(activeKey)
      }
      //编辑页面-一个页面
      function editleftPage(item){
        doEditPage(item["activeKey"], item["action"])
      }
      //编辑页面顶部操作
      function editPage({targetKey, action}){
         doEditPage(targetKey, action)
      }
     async function doEditPage(targetKey, action){
        if(action=="add"){//添加
          let num = datas.pageList[datas.pageList.length-1].pageSetup.name.replace(/[^\d]/g,' '); 
          if(!parseInt(num)>0){
            num=datas.pageList.length
          }
          datas.pageList.push({
                pageSetup:{
                id:0,//页面id
                uuid:buildShortUUID("p"),
                micweb_id:0,//属于的轻站数据id
                orderNum:parseInt(num)+1,//页面顺序
                // 页面设置属性
                name: `第${parseInt(num)+1}个页面`, //页面名称
                details: '页面描述', //页面描述
                ishome: false, // 是否为首页-轻站入口
                isRightBtn: false, // 是否显示个人中心
                rightText:'个人中心',//右边按钮文字
                linktype:'in',//跳转连接类型'in'=内部链接-out 外部
                link:"",//连接地址
                isBack: true, // 是否返回按钮
                backSize: 20, // 返回按钮大小
                isShow: true, // 是否显示头部
                titleHeight: 35, // 高度
                bgColor: 'rgba(249, 249, 249, 10)', //背景颜色
                bgImg: '', // 背景图片
              },//页面数据
              pageComponents:[],//组件数据
          })      
        }else if(action=="remove"){//删除
              let lastIndex = 0;
              let count=0
              let total_num=datas.pageList.length
              datas.pageList.forEach((pane, i) => {
                count++
                if (pane.pageSetup.uuid === targetKey) {
                  if(count==total_num){
                    lastIndex = i - 1;
                  }else{
                    lastIndex = i ;
                  }
                }
              });
              const dalData = datas.pageList.find(pane => pane.pageSetup.uuid == targetKey);
              if(dalData&&dalData.pageSetup&&dalData.pageSetup.id>0){//如果数据可有数据
                await delPage(dalData.pageSetup.id);
              }
              datas.pageList = datas.pageList.filter(pane => pane.pageSetup.uuid !== targetKey);
              //如果删除是选中项则更换默认选中项
              if (datas.pageList.length && datas.activePageKey === targetKey) {
                if (lastIndex >= 0) {
                  // console.log("删除是选中1", datas.pageList[lastIndex].pageSetup)
                  datas.activePageKey = datas.pageList[lastIndex].pageSetup.uuid;
                } else {
                  // console.log("删除是选中2", datas.pageList[0].pageSetup)
                  datas.activePageKey = datas.pageList[0].pageSetup.uuid;
                }
                resetPageData(datas.activePageKey)
              }
        }
      }
      //重置页面数据
      async function resetPageData(activeKey){
        // console.log("重置页面数据",activeKey)
        const n_page= await datas.pageList.find(pane => pane.pageSetup.uuid == activeKey)
        if(n_page){
             //切换数据
            datas.pageSetup= n_page.pageSetup;
            datas.pageComponents= n_page.pageComponents;
            choose.rightcom = 'decorate'//回到编辑页面
            //编辑组件
            datas.pageComponents.forEach((res) => {
              /* 修改选中 */
              if (res.active === true) res.active = false
            })
            choose.currentproperties = datas.pageSetup
        }
     
      }
      /***************************\\\\\\\\\\组件操作-开始\\\\\\\\\\\*********************************** */
      /**
       * 切换组件位置  用于组件管理中删除功能
       *
       * @param {Object} res 组件切换后返回的位置
       */
      const componenmanagement = (res) => {
        datas.pageComponents = res
      }

      // 选择组件数据
      const choose = reactive({
        deleShow: true, //删除标签显示
        index: '', //当前选中的index
        rightcom: 'decorate', //右侧组件切换
        currentproperties: {}, //当前属性
        offsetY: 0, //记录上一次距离父元素高度
        onlyOne: ['1-5', '1-14'], // 只能存在一个的组件(组件的type)
        pointer: { show: false }, //穿透
      })

      /**
       * 选择组件
       *
       * @param {Object} res 当前组件对象
       */
      const activeComponent = (res, index) => {
        choose.index = index
        /* 切换组件 */
        choose.rightcom = res.style
        /* 丢样式 */
        choose.currentproperties = res.setStyle

        /* 替换 */
        datas.pageComponents.forEach((res) => {
          /* 修改选中 */
          if (res.active === true) res.active = false
        })

        /* 选中样式 */
        res.active = true
      }

      // 切换标题
      const headTop = () => {
        choose.rightcom = 'decorate'
        /* 替换 */
        datas.pageComponents.forEach((res) => {
          /* 修改选中 */
          if (res.active === true) res.active = false
        })
      }

      // 删除组件
      const deleteObj = (index) => {
        datas.pageComponents.splice(index, 1)
        if (choose.index === index) choose.rightcom = 'decorate'
        if (index < choose.index) choose.index = choose.index - 1
      }
     //保存组件为素材
    const saveComponentRef=ref()
    function saveMaterial(index) {
      createMessage.loading({ content: '截取素材中...', key:"saveMaterial",duration:0});
       try {
          const htmlDom=document.querySelector(`#components${index}`)
          let parentSelector = htmlDom.querySelector(`div`); //step 2
          html2canvas(parentSelector, {
              x:0,
              y:0,
              scrollY: 0, 
              scale: 1,
            }).then((canvas) => {
              createMessage.destroy();
              let url = canvas.toDataURL("image/png"); // toDataURL: 图片格式转成 base64
              const nowComponents= datas.pageComponents[index]
              saveComponentRef.value.show(nowComponents,url)
            });
        } catch {
          createMessage.destroy();
        }
      }
     //克隆组件
     const cloneMaterial = (index) => {
        const data=  datas.pageComponents[index]
        innerComponents(index,JSON.stringify(data))
      }
     //复制组件
     const copyMaterial = (index) => {
       let  nowComponents=  datas.pageComponents[index]
       nowComponents=JSON.stringify(nowComponents);
        if (!nowComponents) {
          createMessage.warning('要拷贝的内容为空！');
          return;
        }
        clipboardRef.value =nowComponents
        if (unref(copiedRef)) {
          createMessage.success({ content: '复制成功！', key:"webcopyLink",duration:2});
        }
      }
     //粘贴组件
     const pasteMaterial = (index) => {
        addComponentsInbefore(index)
      }
      //在选中的组件后插入组件
      function addComponentsInbefore(index){
        const TEXT = navigator.clipboard.readText();
        TEXT.then(text => {
          if(text){
            innerComponents(index,text)
          }
          // 操作完之后，可以写空值到剪切板，防止下次还是相同数据
          // navigator.clipboard.writeText('');
        }).catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
      }
      //插入组件
      function innerComponents(index,text){
        try {
          if(!text){
              createMessage.warning('粘贴内容为空');
              return
            }
            const data=JSON.parse(text)
            datas.pageComponents.splice(index+1, 0, {
              component: 'placementarea',
              type: 0,
            })
            /* 替换 */
            datas.pageComponents.forEach((res, index) => {
              /* 修改选中 */
              if (res.active === true) res.active = false
              /* 替换提示 */
              choose.index = index
              if (res.component === 'placementarea')
                datas.pageComponents[index] = data
            })
            /* 切换组件 */
            choose.rightcom = data.style
            /* 丢样式 */
            choose.currentproperties = data.setStyle
            //更新页面组件数据
            upPageComponent(datas.pageComponents)
          
        } catch (e) {
            createMessage.warning('粘贴内容格式错误');
        }
        
      }
      /**
       * 1当将元素或文本选择拖动到有效放置目标（每几百毫秒）上时，会触发此事件
       *
       * @param {Object} event event对象
       */
      const allowDrop = (event) => {
        //阻止浏览器的默认事件
        event.preventDefault()
        /* 获取鼠标高度 */
        let eventoffset = event.offsetY
        /* 如果没有移动不触发事件减少损耗 */
        if (choose.offsetY === eventoffset) return
        else choose.offsetY = eventoffset
        /* 获取组件 */
        const childrenObject = event.target.children[0]
        // 一个以上的组件计算
        if (datas.pageComponents.length) {
          /* 如果只有一个组件并且第一个是提示组件直接返回 */
          if (
            datas.pageComponents.length === 1 &&
            datas.pageComponents[0].type === 0
          )
          return
          /* 如果鼠标的高度小于第一个的一半直接放到第一个 */
          if (eventoffset < childrenObject.children[0].clientHeight / 2) {
            /* 如果第一个是提示组件直接返回 */
            if (datas.pageComponents[0].type === 0) return
            /* 删除提示组件 */
            datas.pageComponents = datas.pageComponents.filter(
              (res) => res.component !== 'placementarea'
            )
            /* 最后面添加提示组件 */
            datas.pageComponents.unshift({
              component: 'placementarea',
              type: 0,
            })
            return
          }

          /* 记录距离父元素高度 */
          const childOff = childrenObject.offsetTop
          /* 鼠标在所有组件下面 */
          if (
            eventoffset > childrenObject.clientHeight ||
            childrenObject.lastChild.offsetTop -
              childOff +
              childrenObject.lastChild.clientHeight / 2 <
              eventoffset
          ) {
            /* 最后一个组件是提示组件返回 */
            if (datas.pageComponents[datas.pageComponents.length - 1].type === 0)
              return
            /* 清除提示组件 */
            datas.pageComponents = datas.pageComponents.filter(
              (res) => res.component !== 'placementarea'
            )
            /* 最后一个不是提示组件添加 */
            datas.pageComponents.push({
              component: 'placementarea',
              type: 0,
            })
            return
          }
          const childrens = childrenObject.children
          /* 在两个组件中间，插入 */
          for (let i = 0, l = childrens.length; i < l; i++) {
            const childoffset = childrens[i].offsetTop - childOff

            if (childoffset + childrens[i].clientHeight / 2 > event.offsetY) {
              /* 如果是提示组件直接返回 */
              if (datas.pageComponents[i].type === 0) break

              if (datas.pageComponents[i - 1].type === 0) break

              /* 清除提示组件 */
              datas.pageComponents = datas.pageComponents.filter(
                (res) => res.component !== 'placementarea'
              )

              datas.pageComponents.splice(i, 0, {
                component: 'placementarea',
                type: 0,
              })
              break
            } else if (childoffset + childrens[i].clientHeight > event.offsetY) {
              if (datas.pageComponents[i].type === 0) break

              if (
                !datas.pageComponents[i + 1] ||
                datas.pageComponents[i + 1].type === 0
              )
                break

              datas.pageComponents = datas.pageComponents.filter(
                (res) => res.component !== 'placementarea'
              )

              datas.pageComponents.splice(i, 0, {
                component: 'placementarea',
                type: 0,
              })

              break
            }
          }
        } else {
          /* 一个组件都没有直接push */
          datas.pageComponents.push({
            component: 'placementarea',
            type: 0,
          })
        }
      }

      /**
       * 2当在有效放置目标上放置元素或选择文本时触发此事件
       *
       * @param {Object} event event对象
       */
      const drop = (event) => {
        const types=event.dataTransfer.getData('componentType')
        let data 
        if(types==1){
          /* 获取数据 */
          data= utils.deepClone(
            componentProperties.get(event.dataTransfer.getData('componentName'))
          )

        }else if(types==2){
          data=JSON.parse(event.dataTransfer.getData('jsondata'))
        }
        /* 查询是否只能存在一个的组件且在第一个 */
        let someOne = datas.pageComponents.some((item, index) => {
          return (
            item.component === 'placementarea' &&
            index === 0 &&
            choose.onlyOne.includes(data.type)
          )
        })
        if (someOne) {
          info('固定位置的组件(如: 底部导航、悬浮)不能放在第一个!')
          /* 删除提示组件 */
          dragleaves()
          return
        }
        /* 查询是否只能存在一个的组件 */
        let someResult = datas.pageComponents.some((item) => {
          // console.log(item.component, '--------------item.component')
          return (
            choose.onlyOne.includes(item.type) &&
            item.component === event.dataTransfer.getData('componentName')
          )
        })
        if (someResult) {
          info('当前组件只能添加一个!')
          /* 删除提示组件 */
          dragleaves()
          return
        }
        /* 替换 */
        datas.pageComponents.forEach((res, index) => {
          /* 修改选中 */
          if (res.active === true) res.active = false
          /* 替换提示 */
          choose.index = index
          if (res.component === 'placementarea')
            datas.pageComponents[index] = data
        })
        /* 切换组件 */
        choose.rightcom = data.style
        /* 丢样式 */
        choose.currentproperties = data.setStyle
        //更新页面组件数据
        upPageComponent(datas.pageComponents)
      }
      
      /**
       * 3 当拖动的元素或文本选择离开有效的放置目标时，会触发此事件
       *
       * @param {Object} event event对象
       */
      const dragleaves = () => {
        // console.log("拖拽事件dragleaves：")
        /* 删除提示组件 */
        datas.pageComponents = datas.pageComponents.filter(
          (res) => res.component !== 'placementarea'
        )
      }
      //修改组件数据 data=组件数据
      function upPageComponent(data){
        datas.pageList.forEach((pane, i) => {
          if (pane.pageSetup.uuid ===  datas.activePageKey) {
            datas.pageList[i].pageComponents=data
           }
        });
      }
      // 重置
      // const reload = inject('reload')
      const resetPage = () => {
        createConfirm({
          iconType: "info",
          title: '提示',
          content: '重置后将您当前编辑的数据清空, 是否继续?',
          onOk(){
              //删除当前选中页面内容
              datas.pageList.forEach((pane, i) => {
                if (pane.pageSetup.uuid ===  datas.activePageKey) {
                  datas.pageList[i].pageComponents=[]
                  datas.pageComponents=[]
                  choose.rightcom = 'decorate'
                  /* 替换 */
                  datas.pageComponents.forEach((res) => {
                    /* 修改选中 */
                    if (res.active === true) res.active = false
                  })
                }
              });
          },
        });
      }

      // 监听右侧属性设置切换
      watch(
        () => choose.rightcom,
        (newval) => {
          if (newval === 'decorate') {
            datas.pageComponents.forEach((res) => {
              /* 修改选中 */
              if (res.active === true) res.active = false
            })
            choose.currentproperties = datas.pageSetup
            return
          }
          if (newval === 'componenmanagement') {
            /* 替换 */
            datas.pageComponents.forEach((res) => {
              /* 修改选中 */
              if (res.active === true) res.active = false
            })
            choose.currentproperties = datas.pageComponents
          }
        }
      )
      //监听站点标题
      watch(
        () => datas.webPageData,
        (now, old) => {
          setTitle(datas.webPageData.title)
        },
        { deep: true }
      )
       //时间监听自动保存-30秒保存一次
       watch(
        () => datas.pageComponents,
        (now, old) => {
            if(nowTimestamp()-saveTimestamp.value>30&&(datas.webPageData.id&&datas.webPageData.id>0)){
              console.log("时间监听自动保存")
              doSaveAll("save")
            }
        },
        { deep: true }
      )
      //初始化
      onMounted(() => {
         choose.currentproperties = datas.pageSetup
         //初始化如果是编辑则获取数据
        const pdataid= route.query?.id
        const paramsdata=route.params?.data
         if(parseInt(pdataid)>0){//编辑获取数据库数据
            getEditeData(pdataid)
         }else if(paramsdata){//带参数-选择模板
            const new_pagelist=JSON.parse(paramsdata)
            datas.pageList=new_pagelist
            datas.pageSetup= new_pagelist[0].pageSetup
            datas.pageComponents= new_pagelist[0].pageComponents
            datas.activePageKey= new_pagelist[0].pageSetup.uuid
            initpageset()//初始化页面
         }
      });
      //获取初始数据
      async function getEditeData(pdataid){
         const editdata = await getEditData({id:pdataid});
         //1.赋值轻站页面
         if(editdata&&editdata.webdata){
          datas.webPageData=editdata.webdata
         }
         //赋值页面
         if(editdata&&editdata.pagelist){
            let new_pagelist=[];
            editdata.pagelist.forEach((pane, i) => {
              let templatedata=JSON.parse(pane.templateJson)
              templatedata.micweb_id=pane.micweb_id
              templatedata.id=pane.id
              new_pagelist.push({
                pageSetup:templatedata,
                pageComponents:JSON.parse(pane.component),
              })
            });
            if(new_pagelist&&new_pagelist.length>0){
              datas.pageList=new_pagelist
              datas.pageSetup= new_pagelist[0].pageSetup
              datas.pageComponents= new_pagelist[0].pageComponents
              datas.activePageKey= editdata.pagelist[0].uuid
            }else{
              datas.pageSetup=basePageData
              datas.pageComponents=[]
              datas.activePageKey=basePageData.uui
              datas.pageList=[{
                  pageSetup:basePageData,//页面数据
                  pageComponents:[],//组件数据
                }]
            }
            initpageset()//初始化页面
         }
       }
       //初始化页面
       function initpageset(){
          const newval= choose.rightcom
            if (newval === 'decorate') {
              datas.pageComponents.forEach((res) => {
                /* 修改选中 */
                if (res.active === true) res.active = false
              })
              choose.currentproperties = datas.pageSetup
              return
            }
            if (newval === 'componenmanagement') {
              /* 替换 */
              datas.pageComponents.forEach((res) => {
                /* 修改选中 */
                if (res.active === true) res.active = false
              })
              choose.currentproperties = datas.pageComponents
            }
       }
       //顶部点击按钮
       //2预览
       function handelPreview(val){
          realTimeView.show=val
       }
       //3.保存-不关闭
       function saveJSON(){
        // beforeDoSave('save')//保存单个
        beforeDoSaveAll("save")
       }
       //4.发布-保存并关闭
      function finishJSON(){
        // doSave('finish')
        beforeDoSaveAll("publish")
       }
       //5.真机测试-先保存
       const headerBarRef = ref();
      function mvsaveJSON(){
        beforeDoSave('mvsave')
       }
       //1.1保存-单全部页面数据-轻站信息+全部页面-提示
        function beforeDoSaveAll(type){
         if((!datas.webPageData.id||datas.webPageData.id==0)&&datas.webPageData.title=='轻站标题'){
            createConfirm({
              iconType: "info",
              title: '轻站信息未填写',
              content: '您是否需要去编辑？',
              okText:"去编辑",
              cancelText:"直接保存",
              onOk(){
                openDrawer(true, {dosavepage:true ,type:"saveall"});
              },
              onCancel(){
                doSaveAll(type)
              }
            });
          }else{
            doSaveAll(type)
          }
       }
       //1.2保存-单全部页面数据-轻站信息+全部页面-提交
       async function doSaveAll(type){
        try {
            createMessage.loading({ content: '保存中，请稍等...', key:"postdaveall",duration:0});
            let pagelist=[];//页面数据列表
            let salldata;//页面数据
            datas.pageList.forEach((pane, i) => {
               salldata={id:parseInt(pane.pageSetup.id),uuid:pane.pageSetup.uuid,ishome:pane.pageSetup.ishome,name:pane.pageSetup.name,
               details:pane.pageSetup.details,micweb_id:datas.webPageData.id,
               templateJson:JSON.stringify(pane.pageSetup),component:JSON.stringify(pane.pageComponents)}
              pagelist.push(salldata)
            });
            const sdata={
              "webdata":{...datas.webPageData,status:type=="publish"?1:0},
              "pagelist":pagelist
            }
            const resultdata = await saveAllPageData(sdata);
            if(resultdata){
              ID.value=resultdata.webid//轻站id-url获取参数id
              datas.webPageData.id=resultdata.webid//轻站id
              upPageIdBysaveAll(resultdata.pageids)//更新单个页面id
              saveTimestamp.value=nowTimestamp()//更新自动保存时间
              createMessage.success({ content: type=="publish"?'已发布等待审核!':'数据已保存!', key:"postdaveall", duration: 2 });
              if(type=="publish"){
                setTimeout(() => {//保存成功并关闭页面
                  closeCurrent()
                  goBack()
                }, 500);
              }
            }
          } catch {
            createMessage.destroy();
          }
       }
       //2.1保存-单页面数据
       async function beforeDoSave(type){
        if((!datas.webPageData.id||datas.webPageData.id==0)&&datas.webPageData.title=='轻站标题'){
            createConfirm({
              iconType: "info",
              title: '轻站信息未填写',
              content: '您是否需要去编辑？',
              okText:"去编辑",
              cancelText:"直接保存",
              onOk(){
                openDrawer(true, {dosavepage:true ,type});
              },
              onCancel(){
                doSave(type)
              }
            });
          }else{
             doSave(type)
          }
       }
       //2.2保存-单页面数据
       async function doSave(type){
          try {
            createMessage.loading({ content: '保存中...', key:"savejson",duration:0});
            const sdata={
              "webdata":{...datas.webPageData,status:0},
              "pagedata":{id:parseInt(datas.pageSetup.id),uuid:datas.pageSetup.uuid,ishome:datas.pageSetup.ishome,name:datas.pageSetup.name,
              micweb_id:datas.webPageData.id,details:datas.pageSetup.details,
              templateJson:JSON.stringify(datas.pageSetup),component:JSON.stringify(datas.pageComponents)}
            }
            const resultdata = await savePageData(sdata);
            ID.value=resultdata.webid//轻站id-url获取参数id
            datas.webPageData.id=resultdata.webid//轻站id
            saveTimestamp.value=nowTimestamp()//更新自动保存时间
            if(resultdata){
              upPagepageSetupId(datas.pageSetup.uuid,resultdata.pageid)//更新当前页面id
              createMessage.success({ content: type=='save'?'页面保存成功！':'数据更新完成，可以真机测试了！', key:"savejson", duration: 2 });
              setTimeout(() => {
                  if(type=='mvsave'){//真机测试-先保存
                    let siteid=0;
                    datas.pageList.forEach((pane, i) => {
                      if (pane.pageSetup.ishome) {
                        siteid=pane.pageSetup.id
                      }
                    });
                    headerBarRef.value.showQrcode(siteid,resultdata.pageid);
                  }
              }, 500);
            }
          } catch {
            createMessage.destroy();
          }
       }
       //保存素材模板
       const saveWbMaterialRef=ref()
       function saveTpl(){
         saveWbMaterialRef.value.show(datas)
       }
       //1.单页面-保存后返回页面id 更新页面id
      function upPagepageSetupId(activePageKey,id){
        datas.pageList.forEach((pane, i) => {
          if (pane.pageSetup.uuid === activePageKey) {
             datas.pageList[i].pageSetup.id=id
           }
        });
      }
       //2.整个页面-保存后返回页面id 更新页面id
       function upPageIdBysaveAll(pageids){
        datas.pageList.forEach((pane, i) => {
          pageids.forEach((item, k) => {
           if (item.uuid === pane.pageSetup.uuid) {
              datas.pageList[i].pageSetup.id=item.id
            }
          });
        });
      }
       //使用模板
        function useTpl(id){
        createConfirm({
          iconType: "info",
          title: '是否使用该模板？',
          content: '使用该模板后将覆盖原来设计，请先保存当前设计，覆盖后可重置恢复！',
          onOk(){
            Tpldata(id)
          },
        });
      }
      async function Tpldata(id){
        const resultdata =await getTplData({id:id})
        datas.pageSetup=JSON.parse(resultdata.templateJson)
         datas.pageComponents=JSON.parse(resultdata.component)
         //赋值
         const newval= choose.rightcom
         if (newval === 'decorate') {
            datas.pageComponents.forEach((res) => {
              /* 修改选中 */
              if (res.active === true) res.active = false
            })
            choose.currentproperties = datas.pageSetup
            return
          }
          if (newval === 'componenmanagement') {
            /* 替换 */
            datas.pageComponents.forEach((res) => {
              /* 修改选中 */
              if (res.active === true) res.active = false
            })
            choose.currentproperties = datas.pageComponents
          }
      }
      //编辑轻站
      function editWebPage(){
         openDrawer(true, {dosavepage:false,type:"" });
      }
      //轻站保存数据成功返回
      function handleWebsaveback(params){
        if(params.dosavepage){
          if(params.type=="saveall"){
            doSaveAll()
          }else{
            doSave(params.type)
          }
        }
      }
      //是否监听鼠标事件
      let islisentMouse=false
      function onmousePhoneLeave(){
        islisentMouse=false
      }
      function mousePhoneEnter(){
        islisentMouse=true
      }
      //键盘事件监听
      function keyupLisenter() {
        document.onkeydown = (e) => {
              // console.log("键盘事件:", e)
              if(islisentMouse){//开启监听
                if ((e.ctrlKey || e.metaKey)) {
                  if(e.key === 's'){
                      //  执行save方法
                      doSave('save')
                    // 阻止默认事件
                    e.preventDefault()
                  }else if(e.key === 'c'){//复制
                    if(choose.deleShow){
                      const nowdata= choose.currentproperties
                      if(nowdata){
                        clipboardRef.value = JSON.stringify(nowdata);
                        if (unref(copiedRef)) {
                          createMessage.success({ content: '复制成功！', key:"webcopyLink",duration:2});
                        }
                      }
                    }
                  }else if(e.key === 'v'){//粘贴
                    if(choose.deleShow){
                      addComponentsInbefore(choose.index)
                    }
                  }
                }else if(e.key === 'Backspace'){//删除
                   deleteObj(choose.index)
                }
              }
          }
        }
        //开启监听
        keyupLisenter()
        //选择模板替换
        const [selectTemplateModal, { openModal: openSelectTemplate }] = useModal();//选择模板
        function selectWebTpl(){
          openSelectTemplate(true, {
              isUpdate: true,
          });
        }
        //选择模板返回
        function upWebTpl(jsondata){
           console.log("选择模板返回:",jsondata)
           createConfirm({
              iconType: "info",
              title: '您确定要替换吗？',
              content: '确定替换将整个页面数据全部覆盖',
              okText:"确定",
              onOk:(()=>{
                const new_pagelist=JSON.parse(jsondata)
                datas.pageList=new_pagelist
                datas.pageSetup= new_pagelist[0].pageSetup
                datas.pageComponents= new_pagelist[0].pageComponents
                datas.activePageKey= new_pagelist[0].pageSetup.uuid
                initpageset()//初始化页面
              }),
            });
        }
      //组件页面引用
      return {
        ID,saveComponentRef,saveWbMaterialRef,
        goBack,closeBack,
        closeCurrent,//关闭页面
        sidebarChange,
        sliderassemblyRef,
        //编辑器
        realTimeView,
        ...toRefs(datas),
        ...toRefs(choose),
        componenmanagement,
        activeComponent,
        headTop,
        deleteObj,saveMaterial,cloneMaterial,copyMaterial,pasteMaterial,
        allowDrop,
        drop,
        dragleaves,
        resetPage,
        //顶部按钮
        handelPreview,
        saveJSON,
        finishJSON,
        mvsaveJSON,
        headerBarRef,editleftPage,
        //存为模板
        saveTpl,useTpl,
        //页面
        editWebPage,registerDrawer,editPage,changePage,handleWebsaveback,
        onmousePhoneLeave,mousePhoneEnter,
        //使用模板
        selectTemplateModal,selectWebTpl,upWebTpl,
    };
    },
  });
</script>

<style lang="less" scoped>
.pointer-events {
  pointer-events: none;
}
 
.layout {
  width: 100%;
  // height: 100%;
  height: 100vh;
  /* 主体 */
  .subject {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    
    .right-home {
      width: calc(100% - 75px);
      height: 100%;
      
      /* 删除组件 */
      .hindebtn{
        display: none;
      }
      .doEdit{
        // margin-bottom: 10px;
        .editorPane{
          display: block;
          position: absolute;
          left: -70px;
          top: -30px;
          width: 60px;
          z-index: 2;
          text-align: center;
          background: #fff;
          border-radius: 5px;
          overflow: hidden;
          .btnitem{
            cursor: pointer;
            .iconbtn{
              width: 100%;
              height: 100%;
              padding: 10px;
            }
            &:hover {
              background: rgba(37, 165, 137, 0.09);
              color: #55D187;
              &.i {
                font-weight: bold;
                font-size: 26px;
              }
            }
          }

        }
      }
      .deles {
        position: absolute;
        min-width: 80px;
        text-align: center;
        line-height: 25px;
        background: #fff;
        height: 25px;
        font-size: 12px;
        left: 103%;
        top: 50%;
        transform: translateY(-50%);
        .icon-sanjiaoxingzuo {
          position: absolute;
          left: -11px;
          color: #fff;
          font-size: 12px;
          top: 50%;
          transform: translateY(-50%);
        }

      }


      /* 操作主体 */
      .operation {
        width: 100%;
        height: calc(100% - 46px);
        // height:93%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background: #f7f8fa;
      }

      /* 手机 */
      .phone {
        width: calc(100% - 651px);
        height: 100%;
        overflow-y: scroll;
        display: flex;
        justify-content: center;
        background: #f7f8fa;
        p {
            margin: 0;
            padding: 0;
        }
        &::-webkit-scrollbar {
          width: 1px;
        }
        // &::-webkit-scrollbar-thumb {
        //   background-color: #155bd4;
        // }

        /* 手机样式 */
        .phoneAll {
          width: 375px;
          min-height: 760px;
          box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
          margin: 10px 0;
          position: relative;

          /* 手机高度 */
          .phoneSize {
            position: absolute;
            left: -137px;
            top: 640px;
            font-size: 12px;
            color: #a2a2a2;
            border-bottom: 1px solid #dedede;
            width: 130px;
            height: 21px;
            line-height: 21px;
          }

          /* 状态栏 */
          .statusBar {
            width: 100%;
            display: block;
          }

          /* 主体内容 */
          .phone-container {
            min-height: 603px;
            box-sizing: border-box;
            cursor: pointer;
            width: 100%;
            position: relative;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            .componentsClass {
              border: 1px solid #fff;
              &:hover {
                border: 1px dashed #155bd4;
              }
            }
          }
        }
      }

      /* 右侧工具栏 */
      .decorateAll {
        width: 376px;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        position: relative;
        padding: 0 12px;
        background: #fff;
        &::-webkit-scrollbar {
          width: 1px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #155bd4;
        }
      }

      /* 页面设置tab */
      .decorateTab {
        position: absolute;
        right: 375px;
        top: 70px;
        display: flex;
        flex-direction: column;
        span {
          background-color: #fff;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          width: 94px;
          height: 32px;
          display: inline-block;
          text-align: center;
          line-height: 32px;
          margin-bottom: 12px;
          transition: all 0.8s;
          cursor: pointer;
          &.active {
            background-color: #155bd4;
            color: #fff;
          }
          /* 图标 */
          i {
            font-size: 12px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
//左边tab

:deep(.ant-tabs-left > .ant-tabs-nav .ant-tabs-tab) {
  padding: 8px 0px;
  width: 74px;
  display: flex;
  flex-direction: column;
}
:deep(.ant-tabs-left > .ant-tabs-content-holder){
   border-left: 0px solid #f0f0f0;
}
/* 动画 */
.decorateAnima-enter-active {
  transition: all 1.5s ease;
}
.decorateAnima-leave-active {
  transition: all 1.5s ease;
}
.decorateAnima-enter {
  transform: translate(8px, 8px);
  opacity: 0;
}
.decorateAnima-leave-to {
  transform: translate(8px, 8px);
  opacity: 0;
}

/* // 页面切换动画 */
.layoutFade-enter-active {
  transition: all 1.5s ease;
}
.layoutFade-leave-active {
  transition: all 1.5s ease;
}
.layoutFade-enter {
  transform: translateY(5px);
  opacity: 0;
}
.layoutFade-leave-to {
  transform: translateY(5px);
  opacity: 0;
}

</style>
