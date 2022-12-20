<template>
  <div class="wrapper">
    <div class="label">
      <p>{{ fields.name }}</p>
      <i v-if="!fields.required">*</i>
    </div>
    <input type="text" :placeholder="fields.placeholder" v-model="fields.value" />
  </div>
</template>

<script>
export default {
  name: "hEmail",
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
  input {
    padding: 10px 15px;
    background-color: #f6f6f6;
    border: none;
    font-size: 13px;
    color: #000;
  }
}
</style>
