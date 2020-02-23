import { LocalStorage } from 'quasar'
export function postReport ({ commit }, payload) {
  console.log('payload', payload)
  return new Promise((resolve, reject) => {
    this._vm.$axios.post('http://localhost:8000/api/reports', {
      user_name: payload.user_name,
      rise_level: payload.rise_level,
      a_area: payload.a_area,
      hazard_level: payload.hazard_level,
      a_people: payload.a_people,
      temp_rate: payload.temp_rate,
      lat: payload.lat,
      lng: payload.lng
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getReport ({ commit }, payload) {
  console.log('payload', payload)
  return new Promise((resolve, reject) => {
    this._vm.$axios.get('http://localhost:8000/api/reports', { headers: {
      Authorization: 'Bearer ' + LocalStorage.getItem('access_token')
    }
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
