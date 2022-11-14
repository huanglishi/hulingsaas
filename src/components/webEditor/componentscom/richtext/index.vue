<template>
  <div class="componentsbox" >
  <div class="richtext" :style="{ background: datas.backColor,
    borderRadius:datas.borderRadius+'px',border: datas.border+'px solid '+datas.borderColor,margin:datas.margin+'px',padding:datas.padding+'px'}">
    <img
      draggable="false"
      src="../../../../assets/webeditor/fwb.png"
      alt=""
      v-if="!datas.myValue.length"
    />
    <section v-else v-html="datas.myValue" />
    </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
export default {
  name: 'richtext',
  props: {
    datas: Object,
  },
}
</script>

<style scoped lang="less">
:deep(img) {
  max-width: 100% !important;
  display: block;
}
.richtext {
  :deep(pre) {
    white-space: break-spaces;
  }
  :deep(p) {
    word-break: break-all;
    margin: 0;
     padding: 0;
     border: 0;
     font: 14px/1.5 'Microsoft YaHei',arial,tahoma,\5b8b\4f53,sans-serif;
  }
}
</style>
