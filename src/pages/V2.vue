<template>
  <q-page padding>
    <q-slider v-model="standard" :min="-0.01" :max="250"
  label label-always class="q-mt-sm"></q-slider>
    <div class="w">
    <div id="map2" ref="mapo2"  style="height: 520px; width: 100%;"></div>
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
// import gdata from '../statics/globaldata.json'

export default {
  // name: 'PageName',
  data () {
    return {
      mapboxgl: mapboxgl,
      map: null,
      standard: -0.01,
      elevation: null,
      raster: null,
      maxlevel: 1,
      i: []
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
      target: 'map2',
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
        center: fromLonLat([-122.3267, 37.8377]),
        zoom: 11
      })
    })
    this.map = map

    this.raster.on('beforeoperations', (event) => {
      event.data.level = this.standard
    })

    this.$root.$on('maxlevel', (val) => {
      console.log(val)
      this.maxlevel = parseInt(val)
    })

    this.$root.$on('start', (val) => {
      console.log(val)
      this.i = setInterval(() => {
        // do your thing
        this.standard += 1
        console.log(this.standard)
      }, 200)
    })
    this.$root.$on('stop', (val) => {
      console.log(val)
      clearInterval(this.i)
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
  watch: {
    standard: function (val) {
      this.raster.changed()
    }
  },
  destroyed () {
    this.$root.$off('maxlevel', (val) => {
      console.log(val)
      this.maxlevel = parseInt(val)
    })
    this.$root.$off('start', (val) => {
      console.log(val)
      this.i = setInterval(() => {
        // do your thing
        this.standard += 0.1
        console.log(this.standard)
      }, 200)
    })
    this.$root.$off('stop', (val) => {
      console.log(val)
      clearInterval(this.i)
    })
  }
}
</script>
