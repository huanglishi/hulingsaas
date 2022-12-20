<template>
  <div class="wrapper">
    <div class="label">
      <p>{{ fields.name }}</p>
      <i v-if="!fields.required">*</i>
    </div>
    <select v-model="fields.value">
      <option v-for="(item, index) in fields.options" :key="index" :value="item.value">
        {{ item.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "hSelect",
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
  select {
    padding: 10px 15px;
    background-color: #f6f6f6;
    border: none;
    font-size: 13px;
    color: #000;
    &:focus {
      border: none;
      outline: none;
    }
  }
}
</style>
