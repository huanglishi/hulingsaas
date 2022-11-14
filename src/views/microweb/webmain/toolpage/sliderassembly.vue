<template>
  <div>
  <div class="sliderassembly" v-if="datalist&&datalist.type=='base'">
      <div class="title">{{datalist.title}}</div>
      <div class="content">
          <div
          class="componList"
          draggable="true"
          @dragstart="drag($event)"
          @dragend="dragends($event)"
          :data-name="item.name"
          :data-type="1"
          v-for="(item, ind) in datalist.comList"
          :key="ind"
        >
          <i class="iconfont" :class="item.icon" v-if="item.icon" ></i>
            <Icon class="iconfont " v-else-if="item.anticon" color="#b0a8a8" :icon="item.anticon" :size="32" style="display:block"/>
            <van-icon  :name="item.vanIcon" v-else />
          <p>{{ item.text }}</p>
        </div>
        <a-empty v-if="!datalist.comList||datalist.comList.length==0" :image="simpleImage" />
      </div>
  </div>
  <!--素材组件-->
  <div class="sliderassembly" v-if="datalist&&datalist.type=='components'">
     <div class="searchbox" >
        <InputSearch
          placeholder="请输入素材名称"
          allowClear
          v-model:value="searchValue"
          @search="onSearch"
        />
      </div>
      <div class="liestbox">
        <a-tabs v-model:activeKey="tabactiveKey" :tabBarStyle="{paddingLeft:'10px'}">
          <a-tab-pane v-for="(item,i) in datalist.comList" :key="i" :tab="item.title">
            <div class="tplItem" >
                  <div class="tplList">
                      <div class="listWrap" v-for="(list,k) in item.list" :key="k" 
                        draggable="true"
                        @dragstart="drag($event)"
                        @dragend="dragends($event)"
                        :data-jsondata="list.jsondata"
                        :data-type="2"
                        >
                        <div class="modulek">
                          <div class="imgbox">
                            <Image v-if="list.image" :src="list.image" />
                            <Icon class="iconimgbox" v-else  icon="flat-color-icons:template" :size="68" style="display:block"/>
                          </div>
                          <div class="tpltitle">
                            {{list.title}}
                          </div>
                        </div>
                      </div>
                  </div>
                  <div class="empty" v-if="!item||item.list.length==0">
                    <a-empty :image="simpleImage" description="暂时无可用素材"/> 
                  </div>
                </div>
          </a-tab-pane>
        </a-tabs>
      </div>
  </div>
  <!--模板-->
  <div class="sliderassembly" v-if="datalist&&datalist.type=='tpl'">
     <div class="searchbox" >
        <InputSearch
          placeholder="请输入模板名称"
          allowClear
          v-model:value="searchValue"
          @search="onSearch"
        />
      </div>
      <div class="liestbox">
        <a-tabs v-model:activeKey="tabactiveKey" :tabBarStyle="{paddingLeft:'10px'}">
          <a-tab-pane v-for="(item,i) in datalist.comList" :key="i" :tab="item.title">
            <div class="tplItem" >
                  <div class="tplList">
                      <div class="listWrap" v-for="(list,k) in item.list" :key="k" :draggable="false">
                        <div class="modulek">
                          <div class="imgbox">
                            <Image v-if="list.image" :src="list.image" :preview="false"/>
                            <Icon class="iconimgbox" v-else  icon="flat-color-icons:template" :size="68" style="display:block"/>
                          </div>
                          <div class="tpltitle">
                            {{list.title}}
                          </div>
                          <span class="usebtn" @click="useTpl(list.id)">使用</span>
                        </div>
                      </div>
                  </div>
                  <div class="empty" v-if="!item||item.list.length==0">
                    <a-empty :image="simpleImage" description="暂时无可用模板"/> 
                  </div>
                </div>
          </a-tab-pane>
        </a-tabs>
      </div>
  </div>
  <!--页面-->
  <div class="sliderassembly" v-if="datalist&&datalist.type=='page'">
     <div class="searchbox" >
        <InputSearch
          placeholder="请输入页面名称"
          allowClear
          v-model:value="searchPage"
          @search="onSearch"
        />
      </div>
     <div class="pagebox" >
        <div class="pagelist " v-for="(item,i) in pageList" :key="i" >
           <div class="text">{{item.pageSetup.name}}</div>
           <div class="btns">
             <a @click="changePageList(item.pageSetup.uuid)" :class="{activity:item.pageSetup.uuid==activePageKey}">
              <Icon icon="material-symbols:edit-square-outline-rounded"></Icon>
            </a>
             <!-- <a><Icon icon="ant-design:share-alt-outlined"></Icon></a> -->
             <a v-if="pageList.length>1" @click="changeEdit(item.pageSetup.uuid,'remove')" ><Icon icon="mi:delete"></Icon></a>
           </div>
        </div>
        <div class="addbtn">
          <div class="btn" @click="changeEdit('','add')"><Icon icon="ant-design:plus-outlined"></Icon><span>添加页面</span></div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import { reactive ,ref} from 'vue'
import { Empty,InputSearch,Image ,Tabs,TabPane} from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
//APi
import { getTpl,getMaterial } from '/@/api/microweb/webmain';
export default {
  name: 'sliderassembly',
  props: {
    pointer: Object,
    pageList:Array,
    activePageKey:String
  },
  emits: ["useTpl","changePage","editleftPage"],
  components: {AEmpty:Empty,Icon ,InputSearch,Image,[Tabs.name]:Tabs,[TabPane.name]:TabPane},
  setup(props, { emit }) {
    // 侧边栏组件显示
    const searchValue = ref('');
    const searchPage = ref('');//页面查找
    const datalist =ref()
    // 组件信息配置
    const datas = reactive([
      {
        title: '基础组件',
        type:"base",
        comList: [
          {
            text: '商品搜索',
            type: '1-1',
            icon: 'icon-shangpinsousuo',
            name: 'commoditysearch',
          },
          {
            text: '标题文本',
            type: '1-3',
            icon: 'icon-Component-biaotiwenzi',
            name: 'captiontext',
          },

          {
            text: '图片广告',
            type: '1-3',
            icon: 'icon-tupianguanggao',
            name: 'pictureads',
          },
          {
            text: '图文导航',
            type: '1-4',
            icon: 'icon-icon_tupiandaohang',
            name: 'graphicnavigation',
          },
          {
            text: '底部导航',
            type: '1-5',
            icon: 'icon-daohang',
            name: 'tabBar',
          },
          {
            text: '图片魔方',
            type: '1-6',
            icon: 'icon-mofang',
            name: 'magiccube',
          },
          {
            text: '公告',
            type: '1-7',
            icon: 'icon-gonggao',
            name: 'notice',
          },
          {
            text: '富文本',
            type: '1-8',
            icon: 'icon-fuwenben',
            name: 'richtext',
          },
          {
            text: '辅助分割',
            type: '1-9',
            icon: 'icon-Component-fuzhufenge',
            name: 'auxiliarysegmentation',
          },

          {
            text: '店铺信息',
            type: '1-10',
            icon: 'icon-dianpuxinxi',
            name: 'storeinformation',
          },
          {
            text: '单元格',
            type: '1-11',
            icon: 'icon-jinrudianpu',
            name: 'entertheshop',
          },
          {
            text: '社群涨粉',
            type: '1-12',
            icon: 'icon-kuaisuzhangfen',
            name: 'communitypowder',
          },
          {
            text: '关注公众号',
            type: '1-13',
            icon: 'icon-gongzhonghao',
            name: 'follow',
          },
          {
            text: '悬浮',
            type: '1-14',
            icon: 'icon-wangye',
            name: 'suspension',
          },
          {
            text: '自定义模块',
            type: 'demo',
            icon: 'icon-zidingyimokuai',
            name: 'custommodule',
          },
        ],
      },
      {
        title: '媒体组件',
        type:"base",
        comList: [
          {
            text: '视频',
            type: '2-1',
            icon: 'icon-shipin',
            name: 'videoss',
          },
          {
            text: '音乐',
            type: '2-2',
            anticon: 'mdi:music',
            name: 'music',
          },
          {
            text: '地图',
            type: '2-3',
            anticon: 'fa6-solid:map-location-dot',
            name: 'maps',
          },
        ],
      },
      {
        title: '业务组件',
        type:"base",
        comList: [
          {
            text: '商品',
            type: '3-1',
            icon: 'icon-goods',
            name: 'listswitching',
          },
          {
            text: '文章模块',
            type: '3-2',
            icon: 'icon-dianpubijikapian',
            name: 'storenotecard',
          },
          {
            text: '表单模块',
            type: '3-3',
            vanIcon: 'orders-o',
            name: 'investigate',
          },
        ],
      },
        {
        title: '素材内容',
        type:"components",
        comList:[{title:"我的素材",list:[]},{title:"平台素材",list:[]}],
      },
      {
        title: '模板',
        type:"tpl",
        comList:[{title:"我的模板",list:[]},{title:"平台模板",list:[]}],
      },
      {
        title: '页面',
        type:"page",
        comList:[
          
        ],
      },
    ])

    /**
     * 当用户开始拖动元素或选择文本时触发此事件
     *
     * @param {Object} event event对象
     */
    const drag = (event) => {
      /* 开启穿透 */
      props.pointer.show = true
      /* 传递参数 */
      if(event.target.dataset.name)
      event.dataTransfer.setData('componentName', event.target.dataset.name)
      if(event.target.dataset.type)
      event.dataTransfer.setData('componentType', event.target.dataset.type)
      if(event.target.dataset.jsondata)
      event.dataTransfer.setData('jsondata', event.target.dataset.jsondata)
    }

    /**
     * 当拖动操作结束时（释放鼠标按钮或按下退出键），会触发此事件
     *
     * @param {Object} event event对象
     */
    const dragends = () => {
      /* 关闭穿透 */
      props.pointer.show = false
    }
     //选择模块组件
     datalist.value=datas[0]
    const tabactiveKey= ref(0)
    function selectCate(index){
      tabactiveKey.value=0
      const data=datas[index]
      if(data){
         if(index==3){//素材
          getComponentData(data)
         } if(index==4){//模板
          getTplData(data)
         }else{
           datalist.value=  data
         }
      }else{
        datalist.value=null
      }
    }
    //1获取素材数据
    async function getComponentData(data){
     const list= await getMaterial()
      if(list){
         data.comList[0].list=[]
         data.comList[1].list=[]
         for(let index in list){
          let item=list[index]
           if(item.type==1){//公共
            data.comList[1].list.push(item)
           }else{//私有
            data.comList[0].list.push(item)
           }
         }
      }
      datalist.value= data
    }
    //2获取模板数据
    async function getTplData(data){
     const list= await getTpl()
      if(list){
         data.comList[0].list=[]
         data.comList[1].list=[]
         for(let index in list){
          let item=list[index]
           if(item.type==1){//公共
            data.comList[1].list.push(item)
           }else{//私有
            data.comList[0].list.push(item)
           }
         }
      }
      datalist.value= data
    }
    //搜索模板
    function onSearch(searchValue){
      console.log('use value', searchValue);
    }
    //选择模板
    function useTpl(id){
      emit('useTpl', id);
    }
    //选择编辑页面
    function changePageList(activeKey) {
      emit('changePage', activeKey);
    }
    //选择编辑页面
    function changeEdit(activeKey,action) {
      emit('editleftPage', {activeKey,action});
    }
    return {
      datalist,
      searchValue,
      useTpl,
      datas,
      drag,
      dragends,
      selectCate,
      onSearch,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      searchPage,changePageList,changeEdit,
      tabactiveKey,
    }
  },
}
</script>

<style scoped lang="less">
/* 组件 */
.sliderassembly {
  width: 275px;
  height: 100%;
  overflow-y: scroll;
  border-right: 1px solid #ebedf0;
  box-sizing: border-box;
  padding: 0;
  background: #fff;
  /* 滚动条 */
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #155bd4;
  }
  .searchbox{
    padding: 12px;
    border-bottom: 1px solid #EDEDED;
  }
  .title{
    padding: 8px 8px 8px 0px;
    border-bottom: #d9d9d9 solid 0.01rem;
  }
  .content{
    padding: 12px;
  }
  /* 组件列表 */
  .componList {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    width: 80px;
    height: 88px;
    margin-bottom: 8px;
    align-items: center;
    cursor: all-scroll;
    transition: all 0.3s;
    &:hover {
      background: #155bd4;
      border-radius: 3px;
      font-weight: 700;
      i,
      p,
      span {
        color: #fff;
      }
    }
    /* 图标 */
    .iconfont,i{
      font-size: 32px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      color: #b0a8a8;
      margin-top: 4px;
    }
    /* 标题 */
    p {
      font-size: 12px;
      color: #323233;
      margin-top: 4px;
    }
    /* 数量 */
    span {
      color: #7d7e80;
      margin-top: 4px;
      font-size: 10px;
    }
  }
  /**页面 */
  .pagebox{
    width: 100%;
    margin-top: 10px;
    padding: 12px;
    .pagelist{
      display: flex;
      border-bottom: 1px solid #EDEDED;
      margin-bottom: 10px;
      padding-bottom: 10px;
      overflow: hidden;
      .text{
        flex:1;
      }
      .btns{
        a{
          margin-left: 5px;
          display: inline-block;
          width: 25px;
          height: 25px;
          line-height: 25px;
          background-color: #F5F5F5;
          border-radius: 100%;
          color: #555;
          text-align: center;
          &:hover{
               background: rgba(37, 165, 137, 0.09);
              color: #55D187;
          }
          &.activity{
            background: rgba(37, 165, 137, 0.09);
            color: #55D187;
          }
        }
      }
    }
  }
}
/**模板样式 */
.tplList{
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  .listWrap{
    width: 50%;
    .modulek{
      position: relative;
      margin-bottom: 10px;
      width: 100%;
      overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border: 2px solid hsla(0,0%,62%,.1);
      transition: border .3s;
      opacity: 1;
      height: 120px;
      &:hover {
        border: 2px solid #155bd4;
        border-radius: 2px;
        .usebtn{
          display:inline-block
        }
      }
      .imgbox{
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        overflow: hidden;
      }
      .usebtn{
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          padding: 2px 10px;
          background: #2f54eb;
          font-size: 12px;
          color: #fff;
          border-radius: 20px;
          cursor: pointer;
      }
      .tpltitle{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 20px;
        font-size: 12px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 20px;
      }
    }
  }
  .listWrap:nth-child(2n) {
      padding-left: 8px;
  }
}
.addbtn{
  width: 100%;
  .btn{
    padding: 5px 20px;
    text-align: center;
    border: 1px solid #EDEDED;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    &:hover{
          background: rgba(37, 165, 137, 0.09);
        color: #55D187;
    }
    span{
      padding-left: 5px;
    }
  }
}
</style>
