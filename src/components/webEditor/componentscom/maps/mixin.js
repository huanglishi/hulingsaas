import Map from './Map'

function getPosition ({ lat, lng }) {
  return new window.qq.maps.LatLng(lat, lng) // 地图的中心地理坐标
}

export default {
  methods: {
    loadMap (key) {
      return Map.load(key)
    },
    setMarker (latLng) {
      const map = this.map
      if(!latLng)return
      const center = getPosition(latLng) // 地图的中心地理坐标
      if (this.marker) {
        this.marker.setMap(null)
        this.marker = new window.qq.maps.Marker({ map, position: center })
        map.panTo(center)
      } else {
        this.marker = new window.qq.maps.Marker({ map, position: center })
      }
    }
  }
}
