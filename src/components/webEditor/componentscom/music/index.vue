<template>
  <div class="componentsbox">
  <div class="music">
    <!-- 音频 -->
    <section class="default" >
        <div class="mainPage" :style="{borderRadius:datas.borderRadius+'px',border: datas.border+'px solid '+datas.borderColor,
        background: datas.backgroundColor,margin:datas.margin+'px'
      }" ref="playerRef"></div>
    </section>
  </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script setup>
  import APlayer from 'APlayer';
  import 'APlayer/dist/APlayer.min.css';
  import {reactive,nextTick, onBeforeUnmount,getCurrentInstance, onMounted, ref,watch} from 'vue'
  const playerRef = ref()
  const { proxy } = getCurrentInstance()
  const state = reactive({
    instance:null
  })
  // APlayer歌曲信息
  class Audio {
    constructor(artist, name, url, cover, lrc) {
      this.artist = artist;// 音频艺术家
      this.name = name;// 音频名称
      this.url = url; // 音频链接
      this.cover = cover;// 音频封面
      this.lrc = lrc;// 音频封面
    }
  }
 
  const props = defineProps({
    //全部数据
    datas: Object,
    // 开启吸底模式
    fixed: {
      type: Boolean,
      default: false
    },
    // 开启迷你模式
    mini: {
      type: Boolean,
      default: false
    },
    // 音频自动播放
    autoplay: {
      type: Boolean,
      default: false
    },
    // 主题色
    theme: {
      type: String,
      default: 'rgba(255,255,255,0.2)'
    },
    // 音频循环播放
    loop: {
      type: String,
      default: 'all' //'all' | 'one' | 'none'
    },
    // 音频循环顺序
    order: {
      type: String,
      default: 'random' //'list' | 'random'
    },
    // 预加载
    preload: {
      type: String,
      default: 'auto' //'auto' | 'metadata' | 'none'
    },
    // 默认音量
    volume: {
      type: Number,
      default: 0.7,
      validator: (value) => {
        return value >= 0 && value <= 1;
      }
    },
    // 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
    mutex: {
      type: Boolean,
      default: true
    },
    // 传递歌词方式
    lrcType: {
      type: Number,
      default: 3
    },
    // 列表是否默认折叠
    listFolded: {
      type: Boolean,
      default: true
    },
    // 列表最大高度
    listMaxHeight: {
      type: String,
      default: '100px'
    },
    // 存储播放器设置的 localStorage key
    storageName: {
      type: String,
      default: 'aplayer-setting'
    },
  })
  onMounted(() => {
    createMusic()
    // 销毁
    onBeforeUnmount(() => {
      state.instance.destroy()
    })
  })
  watch(
        ()=>props.datas,
        (val,preVal)=>{
            //val为修改后的值,preVal为修改前的值
            nextTick(()=>{
              createMusic()
            })
        },
        {
            //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
            //那么首次执行，val为默认值,preVal为undefined
            immediate:true,
            //这个参数代表监听对象时，可以监听深度嵌套的对象属性
            //比如message是一个对象的话，可以监听到message.a.b.c，也就是message下的所有属性
            deep:true,
        }
    )
  function createMusic(){
    let audioList = new Audio(props.datas.author, props.datas.title, props.datas.src, props.datas.coverUrl, props.datas.lrc);
    state.instance = new APlayer({
        container: playerRef.value,
        fixed: props.fixed,
        mini: props.mini,
        autoplay: props.datas.autoplay,
        theme: props.theme,
        loop: props.datas.loop,
        order: props.order,
        preload: props.preload,
        volume: props.datas.volume,
        mutex: props.mutex,
        lrcType: props.datas.lrcType,
        listFolded: props.listFolded,
        listMaxHeight: props.listMaxHeight,
        storageName: props.storageName,
        audio: audioList
      })
  }
</script>

<style scoped lang="less">
.music {
  /* 默认音频 */
  .default {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .mainPage{
      width: 100%;
      background: #FCFCFC;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      margin: 0px;
    }
  }

}

</style>
