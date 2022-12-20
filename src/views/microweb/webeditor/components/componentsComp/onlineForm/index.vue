<template>
  <div class="empty" v-if="formData.value.length === 0">请从右侧面板选择表单~</div>
  <div class="form-wrap" v-else>
    <p class="title" v-if="datas.formName">{{ datas.formName }}</p>
    <div class="content">
      <el-form ref="form">
        <component
          v-for="item in formData.value"
          :key="item.id"
          :is="`h-${item.type}`"
          :fields="item"
        />
      </el-form>
    </div>
    <div class="submit-btn">{{ datas.button_text }}</div>
  </div>
</template>

<script>
import _ from "lodash";
import { Notify } from "vant";
import { ref, reactive, watch } from "vue";
const files = import.meta.globEager("./components/*.vue");
const utilFuns = {};
Object.keys(files).forEach((key) => {
  const splitIndex = key.indexOf(".", 2);
  const name = key.substring(13, splitIndex);
  utilFuns[name] = files[key].default;
});
import { ElForm } from "element-plus";
export default {
  name: "onlineForm",
  components: {
    ElForm,
    ...utilFuns,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const form = ref();
    const formData = reactive({
      value: [],
    });

    // 处理单选、多选的选项
    const disposeFormData = (value) => {
      value.forEach((item) => {
        const cloneItem = _.cloneDeep(item);
        switch (cloneItem.type) {
          case "radio":
          case "select":
          case "checkbox":
            const options = [];
            cloneItem.option.split("\n").forEach((ite) => {
              options.push({
                label: ite,
                value: ite,
              });
            });
            cloneItem["options"] = options;
            cloneItem.value = [];
            break;
          case "image":
            cloneItem.value = [];
            break;
        }
        formData.value.push(cloneItem);
      });
    };

    watch(
      () => props.datas,
      (val) => {
        formData.value = [];
        disposeFormData(val.formData);
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return {
      form,
      formData,
    };
  },
};
</script>

<style lang="less" scoped>
.form-wrap {
  padding: 20px 15px;
  .title {
    width: 100%;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
  }
  .submit-btn {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 15px;
    color: #fff;
    border-radius: 4px;
    margin: 20px auto 10px;
    background-color: #ff7214;
  }
}

.empty {
  color: #666;
  line-height: 130px;
  text-align: center;
}
</style>
