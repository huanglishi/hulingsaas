<template>
     <div class="lg:flex">
      <div class="lg:w-8/10 w-full  enter-y">
        <div class="p-4">
          <TopCard :loading="loading" class="enter-y" />
          <TplCard :loading="loading" class="enter-y" />
           <!-- <SiteAnalysis class="!my-4 enter-y" :loading="loading" /> -->
        </div>
      </div>
      <div class="lg:w-2/10  w-full enter-y"  >
        <div class="p-4" style="padding-left: 0px;">
          <FunArcle :loading="loading" class="enter-y" />
        </div>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
    import { ref } from 'vue';
    import TopCard from './components/TopCard.vue';
    import TplCard from './components/TplCard.vue';
    import FunArcle from './components/FunArcle.vue';
    // import SiteAnalysis from './components/SiteAnalysis.vue';
  
    const loading = ref(true);
  
    setTimeout(() => {
      loading.value = false;
    }, 1500);
  </script>
  