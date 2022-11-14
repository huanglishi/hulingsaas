<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <div class="full_btn">
    <div class="zTreeBackground">
        <ul id="treeDeptData" class="ztree">
        </ul>
     </div>
      <!--右键菜单-->
      <div id="DeptMenu" v-show="showRightNemu">
          <ul class="menubox">
              <li class="menuItem">
                <span @click="addGroup">
                  <Icon icon="ant-design:plus-outlined"></Icon>
                  <span class="text">增加</span>
                </span>
              </li>
              <li class="menuItem " @click="editGroup"  :class="{'displaybtn':(onrightData?.id||0)<=1}" >
                <span>
                  <Icon icon="material-symbols:edit-square-outline-rounded"></Icon>
                  <span class="text">编辑</span>
                </span>
              </li>
              <li class="menuItem " @click="delGroup" :class="{'displaybtn':(onrightData?.id||0)<=1}" >
                <span>
                  <Icon icon="ant-design:delete-twotone"></Icon>
                  <span class="text">删除</span>
                </span>
              </li>
          </ul>
      </div>
    </div>
    <!--分组-->
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted,ref,unref} from 'vue';
  import { upGrouppid ,delData} from '/@/api/sys/dept';
  import { getParentList } from '/@/api/sys/dept';
  import { Icon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  //组件
  // import GrouptModal from '/@/views/microweb/group/GrouptModal.vue';
  import DeptModal from '/@/views/sys/system/dept/DeptModal.vue';
  import { useModal } from '/@/components/Modal';
  //Ztree
  import  '@ztree/ztree_v3/js/jquery-1.4.4.min.js'
  import '@ztree/ztree_v3/js/jquery.ztree.core.min.js'
  import '@ztree/ztree_v3/js/jquery.ztree.excheck.min.js'
  import '@ztree/ztree_v3/js/jquery.ztree.exedit.min.js'
  import '@ztree/ztree_v3/css/zTreeStyle/zTreeStyle.css'
  
  export default defineComponent({
    name: 'DeptTree',
    components: {  Icon ,DeptModal},
    emits: ['select','openGroup'],
    setup(_, { emit }) {
      const [registerModal, { openModal }] = useModal();
      const showRightNemu=ref(false)
      //提示
      const {
        createMessage,
      } = useMessage();
      // const treeList = ref<TreeItem[]>([]);
      const setting = {
          data:{
              simpleData:{
                  enable: true,
                  idKey: "id",
                  pIdKey: "pid",
                  rootPId: 0
              }
          },
          callback:{
            onClick(event, treeId, treeNode){
             emit('select', treeNode.id);
            },
            onRightClick:zTreeOnRightClick,
            onDrop: zTreeOnDrop
          },
          edit: {
            enable: true,
            drag: {
              isCopy: false,
              isMove: true
            },
            showRemoveBtn: false,
            showRenameBtn: false
          },
          view: {
            fontCss: {color:"#000000",'font-weight':600,'font-size':15 }
          }
      }
      //获取数据
      async function fetch() {
       let zNodes=[
                {id:0, pid:0, name: "全部",open:true},
            ]
        const treeList= (await getParentList()) as unknown as TreeItem[];
        zNodes=zNodes.concat(treeList)
        $.fn.zTree.init($("#treeDeptData"), setting,  zNodes);
      }
      //点击之前菜单
      function handleSelect(keys) {
        emit('select', keys[0]);
      }
      function openGroup() {
         emit('openGroup');
      }
      //点击标题
      function handleTitleclick() {
          emit('select', 0);
      }
      //初始执行
      onMounted(() => {
        fetch();
      });
      //1.1右键
      interface RightData {
        id: number;
        name: string;
        pid: number;
        remark: string;
        status: number;
        weigh: number;
      }

      const onrightData=ref<RightData>();
      function zTreeOnRightClick(event, treeId, treeNode) {
          if(treeNode){
            onrightData.value={id:treeNode.id,name:treeNode.name,pid:treeNode.pid,remark:treeNode.remark,status:treeNode.status,weigh:treeNode.weigh}
            if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                showDeptMenu( event.layerX, event.layerY);
            } else if (treeNode && !treeNode.noR) {
                showDeptMenu( event.layerX, event.layerY);
            }
          }
      }
      //1.2显示右键菜单
      function showDeptMenu( x, y) {
          $("#DeptMenu").css({"top": (y) + "px", "left": (x+30) + "px", "visibility": "visible"}); //设置右键菜单的位置、可见
          showRightNemu.value=true
          $("body").bind("mousedown", onBodyMouseDown);
      }
      //鼠标按下事件
      function onBodyMouseDown(event) {
          if (!(event.target.id == "DeptMenu" || $(event.target).parents("#DeptMenu").length > 0)) {
            showRightNemu.value=false
          }
      }
      //2拖拽分组
     async function zTreeOnDrop(event, treeId, treeNodes, targetNode){
        createMessage.loading({ content: '更新中...', key:"saveMaterial",duration:0});
        let ids=[];
        for(let index in treeNodes){
          ids.push(treeNodes[index].id)
        }
        const resultdata=await upGrouppid({ids:ids,pid:targetNode.id})
        if(resultdata){
          createMessage.success({ content: '更新成功！', key:"saveMaterial", duration: 2 });
        }
      }
      /**菜单操作 */
      //1添加
      function addGroup(){
          showRightNemu.value=false
          const gdata= unref(onrightData)
          openModal(true, {
              pid:gdata.id,
              onrightData,
              isUpdate: false,
          })
      }
      //2编辑
      function editGroup(){
          showRightNemu.value=false
           const gdata= unref(onrightData)
           openModal(true, {
               record:gdata,
              isUpdate: true,
            })
      }
      //3删除
      async function delGroup(){
        showRightNemu.value=false
        const gdata= unref(onrightData)
        const resultdata= await delData([gdata.id]);
        if(resultdata){
          fetch();
        }
      }
      //分组执行成功回调
      function handleSuccess() {
        fetch();
      }
      return { 
        handleSuccess, 
        handleSelect,
        handleTitleclick,
        openGroup,
        fetch,
        //Ztree
        showRightNemu,
        zTreeOnRightClick,
        //菜单
        addGroup,editGroup,delGroup,onrightData,
        registerModal,
      };
    },
  });
</script>
<style lang="less" scoped>
  .full_btn{
    height: 100%;
    // position: relative;
    /**右键菜单 */
    #DeptMenu {
        position:absolute; 
        visibility:hidden; 
        top:0; 
        margin: 0;
        z-index: 999999;
        text-align: left;
        background-color: #fff;
        background-clip: padding-box;
        border-radius: 2px;
        outline: none;
        box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
        .menubox{
          list-style-type: none;
          margin: 0px;
          padding: 5px 0px;
          .menuItem{
            clear: both;
            margin: 0;
            padding: 5px 20px 5px 10px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: normal;
            font-size: 14px;
            line-height: 22px;
            cursor: pointer;
            transition: all 0.3s;
            &:hover {
              background-color: rgba(0, 0, 0, 0.116);
            }
            .text{
              padding-left: 5px;
            }
          }
          .displaybtn{
            background: rgba(212, 211, 211, 0.7) !important;
            color: gray;
            opacity: 0.5;
            pointer-events: none;
            .text {
              cursor:not-allowed;
            }
          }
        }
    }
  }
  /*树形图间距*/
:deep(.ztree li span){
    font-size: 14px;
}
:deep(.ztree li a.curSelectedNode){
  height: 19px;
}
:deep(.ztree li a) {
    vertical-align: sub;
}
:deep(.ztree li span.button.center_docu) {
    background-position: -56px -10px;
    height: 30px;
}
:deep(.ztree li span.button.bottom_docu ){
    background-position: -56px -30px;
    height: 30px;
}

</style>
