<template>
  <q-layout view="hHh lpR lFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          Rising-Water
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
       <q-list bordered padding class="rounded-borders text-primary">
      <q-item
        clickable
        v-ripple
        :active="link === 'report'"
        @click="link = 'report'"
        to="/dashboard/report"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="report" color="red" />
        </q-item-section>

        <q-item-section>Predicted Hazard Report</q-item-section>
      </q-item>
    </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'
import Echo from 'laravel-echo'

export default {
  data () {
    return {
      left: false,
      link: '/dashboard/report',
      user: null
    }
  },
  created () {
    window.Echo = new Echo({
      authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
      auth: {
        headers: {
          Authorization: 'Bearer ' + LocalStorage.getItem('access_token')
        }
      },
      broadcaster: 'pusher',
      key: '123123',
      wsHost: window.location.hostname,
      wsPort: 6001,
      disableStats: true
    })
  },
  mounted () {
    this.user = LocalStorage.getItem('user')
    console.log('link', 'App.User' + this.user.id)
    window.Echo.private('App.User.' + this.user.id)
      .notification((notification) => {
        console.log(notification.type)
        var dis = this.$q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'warning',
          message: 'You are in danger!',
          position: 'top-right',
          multiLine: true,
          actions: [
            { label: 'Reminder', color: 'green', handler: () => { /* console.log('wooow') */ } },
            { label: 'Dismiss', color: 'yellow', handler: () => { dis() } }
          ],
          timeout: 5000
        })
        this.$root.$emit('notify', notification)
      })
  },
  destroyed () {
    window.Echo.dissconnect()
  }
}
</script>
<style>
  .my-menu-link{
    background-color: rgba(0, 0, 255, 0.2);
  }
</style>
