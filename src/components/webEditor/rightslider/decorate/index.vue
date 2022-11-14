<template>
  <div class="decorate">
    <!-- 标题 -->
    <h2>页面设置</h2>

    <!-- 表单 -->
    <a-form
      layout="vertical"
      ref="formRef"
      :model="datas"
      :rules="rules"
    >
        <a-form-item ref="name" label="页面名称" name="name">
          <a-input v-model:value="datas.name"  placeholder="页面标题"  maxlength="25"/>
        </a-form-item>
        <a-form-item label="页面描述" name="details">
          <a-textarea v-model:value="datas.details"  placeholder="用户通过微信分享给朋友时，会自动显示页面描述"/>
        </a-form-item>
        <a-form-item label="微站入口" class="lef" name="ishome">
          <div class="formflex">
            <div class="dotext">
              <Switch v-model:checked="datas.ishome" checked-children="是" @change="changeHome" un-checked-children="否" :checkedValue="true" :unCheckedValue="false"/>
            </div>
            <div class="tig">
              是微站入口，即网站首页(仅一个入口)
            </div>
          </div>
        </a-form-item>
        <div class="bor" style="margin-top:0px;"/>
         <!-- 显示头部 -->
         <a-form-item label="显示头部" class="lef" name="isShow">
          <Switch v-model:checked="datas.isShow" checked-children="显示" un-checked-children="隐藏" :checkedValue="true" :unCheckedValue="false"/>
        </a-form-item>
        <!-- 个人中心 -->
        <template v-if="datas.isShow">
        <!-- 高度 -->
        <a-form-item label="头部高度" class="lef-height" name="titleHeight">
          <el-slider
            v-model="datas.titleHeight"
            :max="100"
            :min="40"
            input-size="small"
            show-input
          >
          </el-slider>
        </a-form-item>
        <a-form-item label="右边按钮" class="lef" name="isRightBtn">
          <Switch v-model:checked="datas.isRightBtn" checked-children="显示" un-checked-children="隐藏" :checkedValue="true" :unCheckedValue="false"/>
        </a-form-item>
        <a-form-item label="按钮文字" name="rightText" class="lef" v-if="datas.isRightBtn">
          <a-input v-model:value="datas.rightText"  placeholder="填写按钮文字"  maxlength="10"/>
        </a-form-item>
        <a-form-item label="颜色大小" class="lef" name="isBack">
            <a-row>
              <a-col :span="6">
               <a-form-item>
                <el-color-picker
                  v-model="datas.textColor"
                  show-alpha
                  :predefine="predefineColors"
                >
                </el-color-picker>
               </a-form-item>
              </a-col>
              <a-col :span="16">
                <el-slider
                    v-model="datas.textSize"
                    :max="35"
                    :min="10"
                    :show-input="false"
                  >
                  </el-slider>
              </a-col>
            </a-row> 
        </a-form-item>
        <a-form-item label="右边按钮跳转连接（内部连接请先保存页面才能用）：" v-if="datas.isRightBtn">
          <div class="imgText">
            <el-select
              style="width: 150px"
              v-model="datas.linktype"
              placeholder="请选择跳转类型"
            >
              <el-option
                v-for="item in optionsType"
                :key="item.name"
                :label="item.name"
                :value="item.type"
              >
              </el-option>
            </el-select>

             <!-- 输入链接 -->
              <el-input
                v-if="datas.linktype=='out'"
                style="width: 100%"
                placeholder="请输入链接，输入前确保可以访问"
                v-model="datas.link"
              >
              </el-input>
              <!--选择内页-->
              <el-select
                  v-if="datas.linktype=='in'"
                  style="width: 100%"
                  v-model="datas.link"
                  placeholder="请选择页面"
                >
                <el-option
                  v-for="item in paglist"
                  :key="item.pageSetup.name"
                  :label="item.pageSetup.name"
                  :value="item.pageSetup.id"
                >
                </el-option>
              </el-select>
          </div>
        </a-form-item>
        <!-- 返回 -->
        <a-form-item label="返回按钮" class="lef" name="isBack">
          <Switch v-model:checked="datas.isBack" checked-children="显示" un-checked-children="隐藏" :checkedValue="true" :unCheckedValue="false"/>
        </a-form-item>
        <a-form-item label="按钮大小" class="lef-height" name="titleHeight" v-if="datas.isBack">
          <el-slider
            v-model="datas.backSize"
            :max="50"
            :min="12"
            input-size="small"
            show-input
          >
          </el-slider>
        </a-form-item>
      </template>
      <div class="bor" style="margin-top:0px;"/>
        <!-- 背景颜色 -->
        <a-form-item label="页面背景颜色" class="lef" name="bgColor">
         <!-- 颜色选择器 -->
         <el-config-provider :locale="locale">
          <el-color-picker
            v-model="datas.bgColor"
            show-alpha
            :predefine="predefineColors"
          >
          </el-color-picker>
          </el-config-provider>
        </a-form-item>
        <a-form-item label="页面背景图片" class="lef" name="bgColor">
            <div class="shop-head-pic" style="text-align: center">
              <img class="home-bg" :src="datas.bgImg" alt="" v-if="datas.bgImg" />
              <div class="shop-head-pic-btn" style="text-align: center">
                <a-button @click="showUpload('2')" ghost color="success" class="uploadImg"> 更换图片 </a-button>
                <a-button type="primary" @click="clear()" style=" margin-left: 12px;">清空图片</a-button>
              </div>
            </div>
        </a-form-item>
    </a-form>
   <!-- 上传图片 -->
   <uploadimg ref="upload" @uploadInformation="uploadInformation" />
  </div>
</template>

<script >
import uploadimg from '../../uploadImg/index.vue' //图片上传
import { Form ,Checkbox,Row,Col,Slider,Select,Switch} from 'ant-design-vue';
// 局部引入
import { ElColorPicker,ElConfigProvider ,ElInput,ElSelect,ElOption,ElSlider } from 'element-plus'
import { changHomePage } from '/@/api/microweb/webmain';
export default {
  name: 'decorate',
  props: {
    datas: Object,
    paglist:Array,
  },
  components: {uploadimg,
    AForm: Form, AFormItem: Form.Item ,ACheckbox:Checkbox,ARow:Row,ACol:Col,ASlider:Slider,ASelect:Select,ASelectOption:Select.Option,
    ElColorPicker,ElConfigProvider ,Switch ,ElInput,ElSelect,ElOption,ElSlider},
  data() {
    return {
      rules: {
        //校验表单输入
        name: [
          //页面名称
          { required: true, message: '请输入页面名称', trigger: 'blur' },
        ],
        details: [
          //页面描述
          { required: true, message: '请输入页面描述', trigger: 'blur' },
        ],
        classification: [
          //分类
          { required: true, message: '请选择页面分类', trigger: 'blur' },
        ],
      },
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
      uploadImgDataType: null, // 获取到的图片地址属于哪一类别   0 修改底部logo   1 修改店铺图标 2 页面背景图
      grouplist:[],//分组数据
      optionsType: [
        {
          type: 'in',
          name: '内部链接',
        },
        {
          type: 'out',
          name: '外部链接',
        },
      ], // 选择跳转类型
    }
  },
  setup() {
    return {}
  },
  mounted() {
     //初始获取数据
    //  this.getGroupList()
  },
  methods: {
    // 显示上传图片组件   type :  2 页面背景图
    showUpload(type) {
      this.uploadImgDataType = type
      this.$refs.upload.showUpload()
    },

    // 上传图片
    uploadInformation(res) {
      if (this.uploadImgDataType === '2') {
        this.datas.bgImg = res
      }
    },
    // 清空背景图片
    clear() {
      this.datas.bgImg = ''
    },
    //切换首页设置
    changeHome(checked){
      changHomePage({ishome:checked?1:0,micweb_id:this.datas.micweb_id,id:this.datas.id});
    },
  },
}
</script>

<style scoped lang="less">
/* 页面设置 */
.decorate {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px;
  box-sizing: border-box;
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
  /* 选择器添加和刷新 */
  .ification {
    color: #155bd4;
    font-size: 14px;
    padding: 0 15px;
    cursor: pointer;
  }
  /* 颜色选择器 */
  .picke {
    margin-left: 15px;
    vertical-align: top;
  }
  .home-bg {
    width: 100px;
    height: 300px;
  }

  .lef {
    display: flex;
    flex-direction: unset;
    margin-bottom:0;
    :deep(.ant-form-item-label) {
      text-align: left;
      margin-right: 20px;
      line-height: 32px;
    }
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
     //背景图片
    .shop-head-pic {
      color: #ababab;
      display: flex;
      flex-direction: column;
      img {
        width: 70px;
        height: 70px;
        margin: 10px auto;
      }
      .shop-head-pic-btn {
        display: flex;
        flex-direction: row;
        .el-button {
          flex: 1;
        }
      }
    }

}
.imgText {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    .fir-sele.el-select {
      width: 40%;
    }
  }
  .formflex{
    display: flex;
    justify-content: center;
    align-items: center;
    .tig{
      flex:1;
      padding-left: 5px;
      font-size: 13px;
      color: red;
    }
  }
</style>
