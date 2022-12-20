<template>
  <div class="wrapper">
    <div class="label">
      <p>{{ fields.name }}</p>
      <i v-if="!fields.required">*</i>
    </div>
    <div class="image-list">
      <div class="select-img">
        <i class="iconfont icon-upload"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
export default {
  name: "hImage",
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
  .select-img {
    justify-self: flex-start;
    position: relative;
    width: 70px;
    height: 70px;
    border: 1px dashed #666;
    text-align: center;
    margin: 5px;

    input {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: inline-block;
      opacity: 0;
    }
    .iconfont {
      line-height: 70px;
      font-size: 70px;
      color: #666;
    }
  }
  .image-list {
    display: flex;
    flex-wrap: wrap;
    .img-item {
      position: relative;
      width: 70px;
      height: 70px;
      border: 1px solid #666;
      margin: 5px 6px;
      .delete {
        position: absolute;
        display: inline-block;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        width: 15px;
        height: 15px;
        border: 1px solid rgb(174, 174, 174);
        font-size: 10px;
        line-height: 15px;
        text-align: center;
        background-color: #fff;
        color: rgb(174, 174, 174);
        border-radius: 50%;
      }
    }
  }
}
</style>
