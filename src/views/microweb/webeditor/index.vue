<template>
    <div class="webeditor">
        <div class="toolTopBar"></div>
        <div class="ditorcontent">
            <div class="ditor_panel">
                
            </div>
            <div class="ditorbox">

            </div>
            <div class="componentset">

            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import {  Avatar} from 'ant-design-vue';
    export default defineComponent({
      components: {
        [Avatar.name]: Avatar,
      },
      setup() {
        const datas=ref()
        watch(
          () => datas,
          (v) => {
            console.log(v)  
          },
        );

        //返回数据
        return { 
            datas
        };
      },
    });
  </script>
  <style lang="less" scoped>
  .webeditor{
    background: #e6e6e6;
    height: 100%;
    position: relative;
    .toolTopBar{
        background: #fff;
        border-bottom: 1px solid #eff1f2;
        box-shadow: 0 3px 5px 1px rgb(0 0 0 / 10%);
        box-sizing: border-box;
        font-size: 0;
        position: relative;
        top: 0;
        transition: height .5s,line-height .5s;
        width: 100%;
        z-index: 9031;
        height: 60px;
        line-height: 60px;  
        background: #fff;
        position: fixed;
    }
    .ditorcontent{
        height: calc(100% - 60px);
        position: relative;
        top: 60px;
    }
  }
  </style>
  