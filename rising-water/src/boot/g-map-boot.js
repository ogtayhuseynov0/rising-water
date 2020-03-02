import GoogleMapsLoader from 'google-maps'

export default ({ app, router, Vue }) => {
  Vue.prototype.$gmaps = GoogleMapsLoader
  Vue.prototype.$gmaps.KEY = ''
  Vue.prototype.$gmaps.LIBRARIES = ['places', 'visualization']
  GoogleMapsLoader.VERSION = '3.38'
}
