<template>
  <BasicModal
    @register="register"
    title="分组管理"
    :showOkBtn="false"
    :showCancelBtn="false"
    width="780px"
    :bodyStyle="{ background: '#ededed'}"
  >
    <grouplist @upcateData="upcateData"></grouplist>
  </BasicModal>
</template>
<script lang="ts">
  import grouplist from '../../group/index.vue';
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    components: { BasicModal,grouplist },
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
