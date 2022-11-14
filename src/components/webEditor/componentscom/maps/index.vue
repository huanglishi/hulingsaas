<template>
  <div class="componentsbox">
  <div class="maps">
    <!-- 地图 -->
    <section class="default" >
      <div id="qq-map-container" ref="mapElement" style="height: 100%;width: 100%"></div>
    </section>
  </div>
    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script>
import Map from './Map'
import MapMixin from './mixin'
export default {
  name: 'maps',
  mixins: [MapMixin], // loadMap、setMarker
  props: {
    datas: Object,
  },
  mounted () {
    this.init()
  },
  watch: {
    datas: {
      handler (val) {
        if (!this.checkMapAvailable()){
          return
        }else if(val.lat&&val.lng){
          this.initMap()
          this.setLabel()
         this.setMarker({lat:this.datas.lat,lng:this.datas.lng})
        }
      },
      deep: true
    },
  },
  methods: {
    checkMapAvailable () {
      return window.qq && window.qq.maps
    },
    init () {
      const qqMapKey =  'GENBZ-G5S3J-7OLFW-FLBX4-WVEMK-SOBL4'
      this.loadMap(qqMapKey).then(qq => {
         if(this.datas.lat&&this.datas.lng){
           this.initMap()
          this.setLabel()
          this.setMarker({lat:this.datas.lat,lng:this.datas.lng})
         }
      })
    },
    initMap () {
      const el = this.$refs.mapElement
      const center = Map.getPosition({lat:this.datas.lat,lng:this.datas.lng}) // 地图的中心地理坐标
      this.map = new window.qq.maps.Map(el, {
        center,
        zoom: this.datas.zoom, // 设置地图的缩放级别
        disableDefaultUI: true, // 禁止所有控件
        draggable: this.datas.draggable, // 设置是否可以拖拽
        scrollwheel: false, // 设置是否可以滚动
        disableDoubleClickZoom: true // 设置是否可以双击放大
      })
    },
   setLabel () {
       const plname=this.datas.name;
      const center = Map.getPosition({lat:this.datas.lat,lng:this.datas.lng}) // 地图的中心地理坐标
      this.label =  new window.qq.maps.Label({
        position: center,
        map: this.map,
        content: plname||''
      })
      if (plname!="") {
        this.label.setContent(plname)
        this.label.setPosition(center)
         this.label.setVisible(true)
      } else {
         console.log("plnamedd22 :",plname)
        this.label.setVisible(false)
      }
    },
  },
}
</script>

<style scoped lang="less">
.maps {
  /* 默认地图 */
  .default {
    width: 100%;
    height: 210px;
    background: #979797;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  
}
</style>
