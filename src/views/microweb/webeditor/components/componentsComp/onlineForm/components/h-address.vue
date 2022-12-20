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
    <van-area :value="value" :area-list="areaList" @cancel="close" @confirm="confirm" />
  </van-action-sheet>
</template>

<script>
import { ref } from "vue";
import { areaList } from "@vant/area-data";
export default {
  name: "hAdress",
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
      let address = ``;
      area.forEach((item) => {
        address += item.name;
      });
      props.fields.value = address;
      show.value = false;
    };
    return {
      areaList,
      show,
      open,
      close,
      confirm,
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
    input{
        border: none;
    }
  }
}
</style>
