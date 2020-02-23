<!--suppress ALL -->
<template>
  <q-page class="">
    <!--<q-btn color="primary" label="Change Radius" @click="changeRadius"/>-->
    <div id="map" ref="mapo"  style=" height: 580px"></div>
     <q-dialog v-model="card">
      <q-card style="min-width: 550px">
      <ReportMap :level="-21"  :cord="[selected.lng, selected.lat]" :id='"cardop"' :from='true'/>
        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%);"
          />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{selected.rname}}</div>
            <div class="col-auto text-grey q-pt-md">
              <q-icon name="place" /> {{selected.lng}}, {{selected.lat}}
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1">{{selected.country}}, {{selected.continent}}</div>
          <div class="text-subtitle2 text-grey">
            <q-rating :value="selected.riskone > 0 ? 5 : (selected.risktwo > 0 ? 3 : 1)" :max="5" size="32px" icon="report" color="red" readonly/>
          </div>
        </q-card-section>
         <q-card-actions>
          <q-btn color="red" outline @click="senMReport" class="full-width" label="Send Report" icon="warning" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
// import mapboxgl from 'mapbox-gl'
import data from '../statics/data.json'
import { mapActions } from 'vuex'
import ReportMap from '../components/ReportMap'

var MarkerClusterer = require('node-js-marker-clusterer')
export default {
  name: 'PageIndex',
  components: { 'ReportMap': ReportMap },
  data () {
    return {
      map2: [],
      map: null,
      google: null,
      heatmapData: [],
      heatmap: null,
      jsonData: data,
      card: false,
      selected: [],
      payload2: {
        user_name: [],
        rise_level: [],
        a_area: [],
        hazard_level: [],
        a_people: [],
        temp_rate: [],
        lat: [],
        lng: []
      },
      default_rise_level: 5
    }
  },
  methods: {
    ...mapActions('report', ['postReport']),
    senMReport () {
      this.payload2.user_name = this.selected.rname
      this.payload2.rise_level = this.default_rise_level
      this.payload2.hazard_level = this.selected.riskone > 0 ? 5 : (this.selected.risktwo > 0 ? 3 : 1)
      this.payload2.a_area = parseInt(this.selected.oneaffected)
      this.payload2.a_people = parseInt(this.selected.oneaffected) * parseInt(this.selected.avgpd)
      this.payload2.temp_rate = 44
      this.payload2.lat = this.selected.lat
      this.payload2.lng = this.selected.lng

      this.postReport(this.payload2).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error.response)
      })
    },
    // TODO asdasd
    initMap () {
      this.$gmaps.load((google) => {
        this.google = google
        // console.log(this.jsonData[0])
        var md
        for (md in this.jsonData) {
          this.heatmapData.push(
            {
              location: new google.maps.LatLng(this.jsonData[md].lat, this.jsonData[md].lng),
              weight: 0.5,
              name: this.jsonData[md].rname,
              country: this.jsonData[md].country,
              continent: this.jsonData[md].continent,
              riskone: this.jsonData[md].riskone,
              risktwo: this.jsonData[md].risktwo,
              oneaffected: this.jsonData[md].oneaffectedkm,
              avgpd: this.jsonData[md].avgpd })
        }
        // var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523)
        this.map = new google.maps.Map(this.$refs['mapo'], {
          zoom: 2,
          center: new google.maps.LatLng(0, 0),
          disableDefaultUI: true,
          zoomControl: true
        })
        // this.loadMarkers(google)
        // this.heatmap = new google.maps.visualization.HeatmapLayer({
        //   data: this.heatmapData
        // })
        // this.heatmap.setMap(this.map)

        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var markers = this.jsonData.map((location, i) => {
          var mark = new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
          })
          mark.addListener('click', () => {
            this.card = true
            this.selected = location
          })
          return mark
        })

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(this.map, markers,
          { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' })

        console.log(markerCluster)
      })
    },
    changeRadius (val) {
      this.heatmap.set('radius', val)
    }
  },
  mounted () {
    this.initMap()

    this.$root.$on('maxlevel', (val) => {
      this.default_rise_level = val
    })
  },
  destroyed () {
    this.$root.$on('maxlevel', (val) => {
      // console.log(val)
      this.default_rise_level = val
    })
  }
}
</script>
