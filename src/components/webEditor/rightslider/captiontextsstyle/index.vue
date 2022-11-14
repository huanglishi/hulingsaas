<template>
  <section class="captiontextsstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <!-- 表单 -->
    <el-form label-width="80px" :model="datas" :rules="rules">
      <!-- 标题内容 -->
      <el-form-item label="标题内容">
        <el-input
          v-model="datas.name"
          placeholder="请输入标题"
          show-word-limit
        />
      </el-form-item>


      <!-- 描述内容 -->
      <el-form-item label="描述内容">
        <el-input
          type="textarea"
          v-model="datas.description"
          placeholder="请输入要说明的文字，最多 100 字"
          maxlength="100"
        />
      </el-form-item>


      <!-- 显示位置 -->
      <el-form-item label="显示位置">
        <div class="weiz">
          <i
            :class="datas.positions === 'left' ? 'active' : ''"
            class="iconfont icon-horizontal-left"
            @click="datas.positions = 'left'"
          />
          <i
            :class="datas.positions === 'center' ? 'active' : ''"
            class="iconfont icon-juzhong"
            @click="datas.positions = 'center'"
          />
          <!-- <i
          :class="datas.positions === 'right' ? 'active': ''"
          class="iconfont icon-juyou"
          @click="datas.positions = 'right'"
          /> -->
        </div>
      </el-form-item>


      <!-- 标题大小 -->
      <el-form-item
        label="标题大小"
        prop="wordSize"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.wordSize"
          placeholder="请输入标题文字大小"
          :maxlength="2"
        />
      </el-form-item>


      <!-- 描述大小 -->
      <el-form-item
        label="描述大小"
        prop="descriptionSize"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.descriptionSize"
          placeholder="请输入描述文字大小"
        />
      </el-form-item>


      <!-- 标题粗细 -->
      <el-form-item
        label="标题粗细"
        prop="wordWeight"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.wordWeight"
          placeholder="请输入标题粗细"
        />
      </el-form-item>


      <!--描述粗细 -->
      <el-form-item
        label="描述粗细"
        prop="descriptionWeight"
        :hide-required-asterisk="true"
      >
        <el-input
          type="number"
          v-model.number="datas.descriptionWeight"
          placeholder="请输入描述粗细"
        />
      </el-form-item>


      <!-- 框体高度 -->
      <el-form-item class="lef" label="框体高度">
        <el-slider
          v-model="datas.wordHeight"
          :max="100"
          :min="20"
          input-size="small"
          show-input
        >
        </el-slider>
      </el-form-item>


      <!-- 标题颜色 -->
      <el-form-item label="标题颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.wordColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>


      <!-- 描述颜色 -->
      <el-form-item label="描述颜色">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="datas.descriptionColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>


      <!-- 背景颜色 -->
      <el-form-item label="背景颜色">
        <!-- 背景颜色 -->
        <el-color-picker
          v-model="datas.backColor"
          show-alpha
          class="picke"
          :predefine="predefineColors"
        >
        </el-color-picker>
      </el-form-item>


      <!--查看更多 -->
      <el-form-item label="底部分割线" class="wid">
         <span style="padding-right:10px;">{{ datas.borderBott ? '显示' : '隐藏' }}</span>
        <el-checkbox v-model="datas.borderBott" />
      </el-form-item>


      <!--查看更多 -->
      <el-form-item label="查看更多" class="wid">
         <span style="padding-right:10px;">{{ datas.more.show ? '显示' : '隐藏' }}</span>
        <el-checkbox v-model="datas.more.show" />
      </el-form-item>


      <!-- 更多样式选择 -->
      <div v-show="datas.more.show ? true : false">
        <el-radio-group v-model="datas.more.type">
          <el-radio :label="0">样式一</el-radio>
          <el-radio :label="1">样式二</el-radio>
          <el-radio :label="2">样式三</el-radio>
        </el-radio-group>

        <!-- 更多文字 -->
        <!-- 跳转链接 -->
        <el-form-item label="右边文字"  v-show="datas.more.type === 2 ? false : true">
          <el-input
            type="text"
            v-model="datas.more.text"
            size="small"
          />
        </el-form-item>


        <!-- 跳转链接 -->
        <el-form-item label="跳转链接">
          <el-radio-group v-model="datas.more.httpType" style="margin-left: 18px">
            <el-radio label="in">内部链接</el-radio>
            <el-radio label="out">外部链接</el-radio>
          </el-radio-group>

          <!-- 输入http -->
          <el-input
          v-if="datas.more.httpType=='out'"
            v-model="datas.more.http"
            placeholder="请输入跳转链接"
            show-word-limit
            style="margin-top: 10px"
          />
          <!--选择内页-->
          <el-select
              v-else
              size="small"
              style="width: 100%"
              v-model="datas.more.http"
              placeholder="请选择页面"
            >
            <el-option
              v-for="item in paglist"
              :key="item.pageSetup.name"
              :label="item.pageSetup.name"
              :value="item.pageSetup.id"
              :disabled="!item.pageSetup.id||item.pageSetup.id==0||item.pageSetup.id=='0'"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </section>
</template>

<script>
import { ElColorPicker,ElConfigProvider,ElForm,ElFormItem,ElSlider,ElCheckbox,ElButton,ElTooltip,ElInput,ElRadioGroup,ElRadio,ElSelect,ElOption} from 'element-plus'
export default {
  name: 'captiontextsstyle',
  props: {
    datas: Object,
    paglist: Array,
  },
  components: { ElColorPicker,ElConfigProvider,ElForm,ElFormItem,ElSlider,ElCheckbox,ElButton,ElTooltip,ElInput,ElRadioGroup,ElRadio,ElSelect,ElOption},
  data() {
    let checkAge = (rule, value, callback) => {
      if (value.length === 0) callback(new Error('请输入有效数字'))
      if (value > 99) callback(new Error('数字最大为99'))
    }
    let kon = (rule, value, callback) => {
      if (value.length === 0) callback(new Error('请输入有效数字'))
    }
    return {
      options: [],
      rules: {
        wordSize: [{ required: true, validator: checkAge, trigger: 'blur' }],
        descriptionSize: [
          { required: true, validator: checkAge, trigger: 'blur' },
        ],
        wordWeight: [{ required: true, validator: kon, trigger: 'blur' }],
        descriptionWeight: [
          { required: true, validator: kon, trigger: 'blur' },
        ],
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
      ],
    }
  },
  methods: {},
}
</script>

<style scoped lang="less">
.captiontextsstyle {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px 20px;
  box-sizing: border-box;

  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  /* 颜色选择器 */
  .picke {
    float: right;
  }

  /* 位置 */
  .weiz {
    text-align: right;
    width: 100%;
    i {
      padding: 5px 14px;
      margin-left: 10px;
      border-radius: 0;
      border: 1px solid #ebedf0;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;

      &:last-child {
        font-size: 22px;
      }

      &.active {
        color: #155bd4;
        border: 1px solid #155bd4;
        background: #e0edff;
      }
    }
  }

  :deep(.wid) .el-form-item__label {
    width: 94px !important;
  }
  :deep(.wid) .el-form-item__content {
    float: right;
  }
}
</style>
