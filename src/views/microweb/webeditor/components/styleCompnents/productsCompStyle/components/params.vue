<template>
  <div class="form-item">
    <div class="title">参数名称：</div>
    <div class="form-item-content">
      <div class="radio-group">
        <div
          class="radio"
          :class="{
            active: datas.datas.paramsName,
          }"
          @click="() => (datas.datas.paramsName = true)"
        >
          <span class="radio-item"></span>
          显示
        </div>
        <div
          class="radio"
          :class="{
            active: !datas.datas.paramsName,
          }"
          @click="() => (datas.datas.paramsName = false)"
        >
          <span class="radio-item"></span>
          隐藏
        </div>
      </div>
    </div>
  </div>
  <el-table :data="datas.datas.paramsPane" border>
    <el-table-column prop="name" label="参数名称" />
    <el-table-column prop="show" label="显示" align="center">
      <template #default="scope">
        <i
          class="change-icon"
          :style="{
            'background-position': `${scope.row.show ? -1855 : -1886}px -47px`,
          }"
          @click="changeParamsShow(scope.row.keyname, scope.row.show)"
        ></i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { watch } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
export default {
  name: "params",
  components: {
    ElTable,
    ElTableColumn,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    // 切换参数显示隐藏
    const changeParamsShow = (key, isShow) => {
      const data = props.datas.datas.paramsPane;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.keyname === key) {
          item.show = !item.show;
        }
      }
    };

    return {
      changeParamsShow,
    };
  },
};
</script>

<style lang="less" scoped>
.form-item {
  display: flex;
  margin-bottom: 15px;
  .title {
    width: 70px;
    text-align: right;
    margin-right: 10px;
    line-height: 30px;
  }
  .form-item-content {
    display: flex;
    .radio-group {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
}
.change-icon {
  display: inline-block;
  width: 11px;
  height: 10px;
  background-image: url("../../../../assets/images/mbg01.png");
  cursor: pointer;
}
</style>
