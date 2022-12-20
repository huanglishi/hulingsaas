<template>
  <div class="wrapper">
    <right-nav-header
      :navs="[
        {
          text: '在线表单',
          type: 'onlineForm',
        },
        {
          text: '编辑模块',
          type: 'edit',
        },
      ]"
      @change="({ type }) => (activeName = type)"
    />
    <div class="content">
      <div class="form-item">
        <div class="title">模块标题：</div>
        <div class="form-item-content">
          <input type="text" class="title-text" v-model="datas.containerConfig.title" />
          <div
            class="check-box"
            :class="{ active: !datas.containerConfig.showTitle }"
            @click="
              () => (datas.containerConfig.showTitle = !datas.containerConfig.showTitle)
            "
          >
            <span></span>
            隐藏
          </div>
        </div>
      </div>

      <div class="form-item">
        <div class="title">表单列表：</div>
        <div class="btns">
          <el-button>添加表单</el-button>
          <el-button>管理表单</el-button>
        </div>
      </div>

      <div class="table">
        <div class="form-header">表单名称</div>
        <div
          class="table-row"
          v-for="item in formList.value"
          :key="item.id"
          @click="selectFrom(item)"
        >
          <span
            :class="{
              active: datas.datas.formId == item.id,
            }"
          ></span>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import { ElButton } from "element-plus";
import publicComp from "../../publicComponents";
import { getFormList, getFormField } from "/@/api/microweb/webeditor";
export default {
  name: "onlineFormStyle",
  components: {
    ElButton,
    ...publicComp,
  },
  props: {
    datas: Object,
  },
  setup(props) {
    const formList = reactive({ value: [] });
    getFormList().then((res) => {
      formList.value = res.items;
    });

    const selectFrom = async ({ id, button_text, success_tig, name }) => {
      props.datas.datas.formId = id;
      props.datas.datas.button_text = button_text;
      props.datas.datas.success_tig = success_tig;
      props.datas.datas.formName = name;
      const res = await getFormField({ id });
      props.datas.datas.formData = res;
    };

    return {
      formList,
      selectFrom,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100%;
  background-color: #fff;
  .content {
    flex: 1;
    padding: 30px 20px 0;
  }
  .form-item-content {
    display: flex;
    align-items: center;
  }
  .table {
    width: 100%;
    border: 1px solid #e3e2e8;
    .form-header {
      line-height: 50px;
      padding-left: 50px;
      box-sizing: border-box;
      background-color: rgb(248, 249, 251);
      color: #333;
    }

    .table-row {
      display: flex;
      align-items: center;
      width: 100%;
      overflow: hidden;
      user-select: none;
      cursor: pointer;
      &:nth-of-type(Odd) {
        background-color: rgb(248, 249, 251);
      }
      &:nth-of-type(Even) {
        background-color: #fff;
      }

      > span {
        position: relative;
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid #d8d8d8;
        border-radius: 50%;
        margin: 17px;
        &.active::after {
          display: block;
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #828282;
        }
      }
      p {
        flex: ;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
