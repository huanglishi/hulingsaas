<template>
  <div class="rcard">
    <div class="title_split">功能、教程</div>
    <div class="arcle__list">
      <div class="arcle_ul">
        <div class="arcle_li" v-for="list in datalist" :key="list.id">
          <div class="text" @click="addCustomtpl(list.id)">{{list.title}}</div>
          <div class="icons"><Icon icon="line-md:thumbs-up"></Icon></div>
        </div>
      </div>
      <div class="split_notext"></div>
    </div>
    <!--展示文章详情-->
    <ViewArticleModal @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { ArticleItem } from './data';
  //api
  import { getArticleList } from '/@/api/home/base';
  //组件
  import {ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import ViewArticleModal  from '/@/views/home/ViewArticleModal.vue';
  import { useModal } from '/@/components/Modal';
  const datalist = ref<ArticleItem[]>([]);
  const gatlist  =async ()=>{
    datalist.value=await getArticleList({}) 
  }
  gatlist()
  //提交模板需求
  const [registerModal, { openModal }] = useModal();
  function addCustomtpl(id){
    openModal(true, {
      id:id,
      isUpdate: false,
    });
  }
  defineProps({
    loading: {
      type: Boolean,
    },
  });
</script>
<style lang="less" scoped>
  .rcard{
    width: 100%;
    min-height: 356px;
    background-color: #fff;
    border-radius: 4px;
    .title_split{
      padding-top: 18px;
      padding-left: 30px;
      padding-bottom: 13px;
      font-size: 14px;
      color: #999;
      z-index: 1000;
      background: #fff;
      border-radius: 6px;
      position: relative;
      &:after {
          height: 1px;
          background-color: #f0f0f0;
          border-radius: 8px;
          content: "";
          position: absolute;
          top: 50%;
          right: 13px;
          width: calc(100% - 120px);
      }
    }
    .arcle__list{
      padding-left: 20px;
      padding-right: 20px;
      .arcle_ul{
        .arcle_li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          .text{
            font-size: 14px;
            color: #333;
            cursor: pointer;
          }
          .icons{
            cursor: pointer;
            user-select: none;
          }
        }
      }
      .split_notext{
        height: 1px;
        background-color: #f0f0f0;
        border-radius: 8px;
        margin-bottom: 12px;
      }
    }
  }
</style>
