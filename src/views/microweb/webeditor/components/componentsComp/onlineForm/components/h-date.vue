<template>
  <div class="wrapper">
    <div class="label">
      <p>{{ fields.name }}</p>
      <i v-if="!fields.required">*</i>
    </div>
    <div class="address" @click.stop="open">
      <input disabled :placeholder="fields.placeholder" v-model="fields.value" />
    </div>
  </div>
  <van-action-sheet v-model:show="show">
    <van-datetime-picker
      type="date"
      :value="value"
      @cancel="close"
      @confirm="confirm"
      :formatter="formatter"
    />
  </van-action-sheet>
</template>

<script>
import { ref } from "vue";
import day from "dayjs";
import { areaList } from "@vant/area-data";

export default {
  name: "hDate",
  props: {
    fields: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const show = ref(false);
    const open = () => {
      show.value = true;
    };
    const close = () => {
      show.value = false;
    };
    const confirm = (area) => {
      props.fields.value = day(area).format("YYYY-MM-DD");
      show.value = false;
    };
    const formatter = (type, val) => {
      if (type === "year") {
        return `${val}年`;
      }
      if (type === "month") {
        return `${val}月`;
      }
      if (type === "day") {
        return `${val}日`;
      }
      return val;
    };
    return {
      areaList,
      show,
      open,
      close,
      confirm,
      formatter,
    };
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  .label {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    p {
      font-size: 14px;
    }
    i {
      color: red;
      font-size: 18px;
      margin-left: 5px;
    }
  }
  .address {
    padding: 10px 15px;
    font-size: #000;
    font-size: 13px;
    background-color: #f6f6f6;
    input {
      border: none;
    }
  }
}
</style>
