<template>
  <q-page padding>
    <div class="w">
    <div :id="id" :ref="id" style="height: 550px; width: 100%;" v-if="from!==false"></div>
    <div :id="id" :ref="id" style="height: 250px; width: 100%;" v-else></div>
    </div>
  </q-page>
</template>

<script>
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
import 'ol/ol.css'
import { Map, View } from 'ol'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer.js'
import { fromLonLat } from 'ol/proj.js'
import RasterSource from 'ol/source/Raster.js'
import XYZ from 'ol/source/XYZ.js'
export default {
  name: 'ReportMap',
  props: ['level', 'cord', 'id', 'from'],
  data () {
    return {
      mapboxgl: mapboxgl,
      map: null,
      elevation: null,
      raster: null
    }
  },
  mounted () {
    this.mapboxgl.accessToken = 'pk.eyJ1IjoidGhhdGZ1dHVyZXBsYXllciIsImEiOiJjazF3ZmZhd2owMTRwM2RwbXR1d3lhemZhIn0.kSZt0dwPBGuL5h34uJqDwQ'
    // var map = new this.mapboxgl.Map({
    //   container: 'map2',
    //   style: 'mapbox://styles/mapbox/streets-v11'
    // })
    // this.map = map
    var key = 'pk.eyJ1IjoidGhhdGZ1dHVyZXBsYXllciIsImEiOiJjazF3ZmZhd2owMTRwM2RwbXR1d3lhemZhIn0.kSZt0dwPBGuL5h34uJqDwQ'
    var elevation = new XYZ({
      url: 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=' + key,
      crossOrigin: 'anonymous',
      transition: 0
    })

    var raster = new RasterSource({
      sources: [elevation],
      operation: function (pixels, data) {
        var pixel = pixels[0]
        if (pixel[3]) {
          var height = -10000 + ((pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]) * 0.1)
          if (height <= data.level && (height + data.level) > 0) {
            pixel[0] = 0
            pixel[1] = 71
            pixel[2] = 114
            pixel[3] = 255
          } else {
            pixel[3] = 0
          }
        }
        return pixel
      }
    })
    this.raster = raster
    var map = new Map({
      target: this.$refs[this.id],
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://api.mapbox.com/styles/v1/thatfutureplayer/ck1x5rs171n2n1cpgc0s1qgot/tiles/256/{z}/{x}/{y}?access_token=' + key
          })
        }),
        new ImageLayer({
          opacity: 0.6,
          source: raster
        })
      ],
      view: new View({
        center: fromLonLat([this.cord[0], this.cord[1]]),
        zoom: 11,
        maxZoom: 11,
        minZoom: 11
      })
    })
    this.map = map

    this.raster.on('beforeoperations', (event) => {
      event.data.level = this.level
    })

    this.$root.$on('reported', (val) => {

    })
    // var counter = 0
    // var i = setInterval(() => {
    // // do your thing
    //   this.standard += 1
    //   console.log(this.standard)
    //   counter++
    //   if (counter === 100) {
    //     clearInterval(i)
    //   }
    // }, 200)
  },
  destroyed () {

  }
}
</script>
