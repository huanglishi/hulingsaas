<template>
  <BasicTitle :helpMessage="helpMessage">
    {{ title }}<span class="title_des"  >{{des}}</span>
  </BasicTitle>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { BasicTitle } from '/@/components/Basic';

  export default defineComponent({
    name: 'BasicModalHeader',
    components: { BasicTitle },
    props: {
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>,
      },
      title: { type: String },
      des: { type: String },
    },
    emits: ['dblclick'],
  });
</script>
<style lang="less">
 .title_des{
    font-size: 12px;
    line-height: 1;
    color: #666;
    margin-left: 5px;
 }
</style>
