<template>
  <q-page padding>
    <div class="row">
      <div class="col"></div>
      <div class="col-8">
        <div v-if="reports.length ===0" class="text-weigthed text-center text-h6">
          No report
        </div>
         <q-card v-for="(report, index) in reports" v-bind:key="index" class='q-mb-sm'>
        <ReportMap :level="report.rise_level"  :cord="[report.lng, report.lat]" :id='report.id'/>
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{report.user_name}}</div>
            <div class="col-auto text-weighted-medium q-pt-md text-h6">
              <q-icon name="unfold_more" /> Rise-level {{report.rise_level}} m
            </div>
          </div>

          <q-rating :value="report.hazard_level" :max="5" size="32px" icon="report" color="red" readonly/>
        </q-card-section>

        <q-card-section>
        <q-list bordered separator>
          <q-item class="text-center">
            <q-item-section class="text-h6">Posibilities</q-item-section>
          </q-item>
          <q-item >
            <q-item-section avatar>
              <q-icon color="primary" name="public" />
            </q-item-section>
            <q-item-section>Affected area: {{report.a_area}}kv</q-item-section>
          </q-item>
          <q-item >
            <q-item-section avatar>
              <q-icon color="primary" name="people" />
            </q-item-section>
            <q-item-section>Affected population: {{report.a_people}}</q-item-section>
          </q-item>
          <q-item >
            <q-item-section avatar>
              <q-icon color="primary" name="ac_unit" />
            </q-item-section>
            <q-item-section>Temprature-incease-rate: {{report.temp_rate}}</q-item-section>
          </q-item>
        </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat color="primary" v-close-popup icon="info" label="More Info"
           class="full-width"></q-btn>
        </q-card-actions>
      </q-card>
      </div>
      <div class="col"></div>
    </div>
  </q-page>
</template>

<script>
import ReportMap from '../components/ReportMap'
import { mapActions } from 'vuex'
export default {
  // name: 'PageName',
  components: { 'ReportMap': ReportMap },
  data () {
    return {
      rating: 3,
      cords: [-122.3267, 37.8377],
      reports: []
    }
  },
  methods: {
    ...mapActions('report', ['getReport']),
    updateReports () {
      this.getReport().then(response => {
        console.log(response)
        this.reports = response.data.reports
      }).catch(error => {
        console.log(error)
      })
    }
  },
  mounted () {
    this.updateReports()
    this.$root.$on('notify', (val) => {
      this.reports.push(val.report)
    })
  },
  destroyed () {
    this.$root.$off('notify', (val) => {
      this.reports.push(val.report)
    })
  }
}
</script>
