<template>
  <div class="wrapper">
    <div class="label">
      <p>{{ fields.name }}</p>
      <i v-if="!fields.required">*</i>
    </div>
    <div class="radio-list">
      <label class="m-radio-wrap" v-for="(item, index) in fields.options" :key="index" >
        <input type="checkbox" :value="item.value" v-model="fields.value" />
        <span>{{ item.label }}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "hCheckbox",
  props: {
    fields: {
      type: Object,
      default: () => ({}),
    },
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
  .radio-list {
    display: flex;
    flex-wrap: wrap;
    .m-radio-wrap {
      display: flex;
      align-items: center;
      line-height: 21px;
      margin-right: 15px;
      width: calc(100% / 4);
      margin-bottom: 5px;
      input{
        margin: 0 6px 0 0;
      }
    }
    .m-radio {
      display: inline-block;
      position: relative;
      width: 16px;
      height: 16px;
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
