<template>
  <div class="suspensionstyle">
    <!-- 标题 -->
    <h2>{{ datas.text }}</h2>

    <el-form
      :model="datas"
    >
      <el-form-item class="lef" label="跳转页面">
        <el-select
            v-model="datas.type"
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
      </el-form-item>
      <el-form-item class="lef" label="链接地址">
         <el-input
             v-if="datas.type=='out'"
            placeholder="请输入链接(网址)，输入前确保可以访问"
            v-model="datas.http.externalLink"
          ></el-input>
          <!--选择内页-->
          <el-select
            v-else
            style="width: 100%"
            v-model="datas.http.externalLink"
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
    </el-form>

  </div>
</template>

<script>
import { ElForm,ElFormItem,ElInput,ElSelect,ElOption} from 'element-plus'
export default {
  name: 'suspensionstyle',
  props: {
    datas: Object,
    paglist: Array,
  },
    components: { 
    ElForm,ElFormItem,ElInput,ElSelect,ElOption
  },
  data() {
    return {
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
      options: [], //后端返回的列表提供下拉选择
      emptyText: '',
    }
  },
  created() {
  },

  mounted() {},

  methods: {
    // 提交
    uploadInformation(res) {
      this.datas.heade = res
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="less" scoped>
.suspensionstyle {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 10px 20px;
  box-sizing: border-box;
}

/* 标题 */
h2 {
  padding: 24px 16px 24px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #f2f4f6;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}
</style>
