
export function login ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    this._vm.$axios.post('http://localhost:8000/api/login', {
      name: payload
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
