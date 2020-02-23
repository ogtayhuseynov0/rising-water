<template>
  <q-layout view="hHh lpR lFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          Rising-Water
        </q-toolbar-title>
        <q-space/>

          <q-btn flat round icon="fast_rewind" @click="fast_rewind"/>
          <q-btn flat round :icon="icon" @click="start"/>
          <q-btn flat round icon="fast_forward" class='q-mr-sm'  @click="fast_forward"/>

        <div class="text-h6">
        T: 30 c
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <!-- <q-slider v-model="standard" :min="0" :max="50"  label label-always class="q-mt-lg"></q-slider> -->
      <q-list bordered padding class="rounded-borders text-primary">
      <q-item
        clickable
        v-ripple
        :active="link === 'v1'"
        @click="link = 'v1'"
        to="/v1"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="filter_1" color="red" />
        </q-item-section>

        <q-item-section>Danger Zones</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        :active="link === 'v2'"
        @click="link = 'v1'"
        to="/v2"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="filter_2" />
        </q-item-section>

        <q-item-section>Flood Simulation</q-item-section>
      </q-item>
    </q-list>
     <q-date
        v-model="date"
        minimal
        class='q-mt-sm'
      />
        <q-input filled v-model="maxlevel" label="Max Water Level" class="q-mt-sm"/>
        <q-input filled v-model="maxtemp" label="Max Temprature Level" class="q-mt-sm"/>
      <!-- <q-btn icon="warning" class="full-width q-ma-sm" color="red" label='Report' @click="report"></q-btn> -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      left: false,
      standard: 5,
      link: 'v1',
      date: Date(),
      maxlevel: 250,
      maxtemp: 25,
      toggled: false,
      icon: 'pause'
    }
  },
  methods: {
    report: function () {
      this.$root.$emit('reported', 'hell')
    },
    fast_forward: function () {
      this.$root.$emit('fast_forward', 'val')
    },
    fast_rewind: function () {
      this.$root.$emit('fast_rewind', 'val')
    },
    start: function () {
      if (!this.toggled) {
        this.$root.$emit('start', 'val')
        this.toggled = !this.toggled
        this.icon = 'play_arrow'
      } else {
        this.$root.$emit('stop', 'val')
        this.toggled = !this.toggled
        this.icon = 'pause'
      }
      console.log(this.toggled)
      console.log(this.icon)
    }
  },
  watch: {
    maxlevel: function (val) {
      this.$root.$emit('maxlevel', val)
    }
  }
}
</script>
<style>
  .my-menu-link{
    background-color: rgba(0, 0, 255, 0.2);
  }
</style>
