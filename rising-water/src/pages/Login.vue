<template>
  <q-page class="">
    <div class="row q-mt-md">
      <div class="col"></div>
      <div class="col">
         <q-card class="my-card" style="max-width:450px; min-width: 400px;">
       <q-card-section class="text-center text-weighted-medium text-h5">
         Login
       </q-card-section>
      <q-card-section>
        <q-input filled v-model="payload.name" label="Country Name" />
        <q-btn icon="arrow_right" label='Login' class="full-width q-mt-sm" color="primary" @click="loginm"></q-btn>
      </q-card-section>
    </q-card>
      </div>
      <div class="col"></div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  // name: 'PageName',
  data () {
    return {
      payload: {
        name: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    loginm: function () {
      this.login(this.payload).then(response => {
        console.log(response)
        LocalStorage.set('access_token', response.data.access_token)
        LocalStorage.set('user', response.data.user)
        this.$router.push('/dashboard/report')
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
