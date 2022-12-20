<template>
  <div class="wrapper">
    <div class="label">
      <p>{{ fields.name }}</p>
      <i v-if="!fields.required">*</i>
    </div>
    <textarea :placeholder="fields.placeholder" :v-model="fields.value" />
  </div>
</template>

<script>
export default {
  name: 'hTextarea',
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
  textarea {
    padding: 10px 15px;
    background-color: #f6f6f6;
    border: none;
    font-size: 14px;
    color: #000;
    height: 78px;
  }
}
</style>
