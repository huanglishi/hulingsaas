<template>
  <BasicModal
    @register="register"
    title="参数管理"
    :showOkBtn="false"
    :showCancelBtn="false"
    width="800px"
    :bodyStyle="{ background: '#ededed'}"
  >
    <prolist @upcateData="upcateData"></prolist>
  </BasicModal>
</template>
<script lang="ts">
  import prolist from '../productprop/index.vue';
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    components: { BasicModal,prolist },
    emits: ['upcateData'],
    setup(_, { emit }) {
      const [register, { closeModal, setModalProps }] = useModalInner();
      function upcateData(){
        emit('upcateData');
      }
      return {
        register,
        closeModal,
        setModalProps: () => {
          setModalProps({ title: 'Modal New Title' });
        },
        upcateData,
      };
    },
  });
</script>
