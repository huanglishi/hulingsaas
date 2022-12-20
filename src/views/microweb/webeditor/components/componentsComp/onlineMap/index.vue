<template>
  <div class="wrapepr" ref="wrapeprDom"></div>
</template>

<script>
import _ from "lodash-es";
import { ref, onMounted, nextTick, watch } from "vue";
export default {
  name: "onlineMap",
  props: {
    datas: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const mapref = ref("");
    const showMap = ref(false);
    const wrapeprDom = ref("");
    const mapClass = ref("");

    // 渲染地图
    const rednerMap = () => {
      showMap.value = true;
      const {
        lat,
        lng,
        addressName,
        address,
        addressDetail,
        phone,
        otherInfo,
      } = props.datas;
      const markeModal = `<div class="map-msg">
          ${addressDetail ? `<div class="address">地址：${addressDetail}</div>` : ""}
          ${phone ? `<div class="tel">电话：${phone}</div>` : ""}
          ${otherInfo ? `<div class="other">${otherInfo}</div>` : ""}
      </div>`;

      var map = new BMapGL.Map(mapClass.value);
      var point = new BMapGL.Point(Number(lng), Number(lat));
      map.centerAndZoom(point, 15);

      // 标注点
      var marker = new BMapGL.Marker(point);
      map.addOverlay(marker);

      // 创建信息窗口对象
      var infoWindow = new BMapGL.InfoWindow(markeModal, {
        width: 220,
        title: addressName,
      });
      map.openInfoWindow(infoWindow, point);
      marker.addEventListener("click", function (e) {
        map.openInfoWindow(infoWindow, point); //开启信息窗口
      });
    };

    const initDom = () => {
      const newDom = document.createElement("div");
      mapClass.value = `online-map-${_.now()}`;
      newDom.id = mapClass.value;
      newDom.style.height = "280px";
      wrapeprDom.value.appendChild(newDom);
      rednerMap();
    };

    nextTick(() => {
      initDom();
    });

    watch(
      () => props.datas,
      (val) => {
        showMap.value = false;
        rednerMap();
      },
      {
        deep: true,
      }
    );

    const start = (e) => {
      e.preventDefault();
    };

    return {
      start,
      rednerMap,
      showMap,
      wrapeprDom,
    };
  },
};
</script>

<style lang="less">
.map-msg {
  min-height: 100%;
  .address,
  .tel,
  .other {
    color: #666;
    font-size: 12px;
    line-height: 18px;
  }
  .other {
    margin-top: 5px;
    margin-bottom: 10px;
  }
}
</style>

<style lang="less" scoped>
.wrapepr {
  ::v-deep .shadow {
    display: none;
  }
}
</style>
