import Echo from 'laravel-echo'

export default ({ app, router, Vue }) => {
  window.Pusher = require('pusher-js')

  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '123123',
    wsHost: window.location.hostname,
    wsPort: 6001,
    disableStats: true
  })
}
