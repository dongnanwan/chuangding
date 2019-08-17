import axios from '@/axios'
import qs from 'qs'
const state = {
}

const getters = {
}

const actions = {
  getSetting ({commit, state}, name) {
    return new Promise(resolve => {
      axios.get('/api/setting/' + name).then(res => {
        resolve(res.data)
      })
    })
  },
  setSetting ({commit, state}, params) {
    return new Promise(resolve => {
      axios.post('/api/setting/' + params.name, qs.stringify({value: params.value})).then(res => {
        resolve(res.data)
      })
    })
  },
  HELLO ({commit, state}, params) {
    return new Promise(resolve => {
      axios.get('/api/banner?page=1&size=10').then(res => {
        resolve(res.data)
      })
    })
  }
}

const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
