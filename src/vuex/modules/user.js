import axios from '@/axios'
import qs from 'qs'
const state = {
  user: {
    list: [],
    total: 0,
    params: {
      page: 1,
      size: 10
    },
    temp: {},
    userRole: ''
  }
}

const getters = {
  user: state => state.user
}

const actions = {
  /*
   * params: {name: '', password: ''}
   */
  login ({commit, state}, params) {
    return new Promise(resolve => {
      axios.post('/api/auth', qs.stringify(params)).then(res => {
        resolve(res.data)
      })
    })
  },
  /*
   * params: {password: '', newPassword: ''}
   */
  logout ({commit, state}) {
    return new Promise(resolve => {
      axios.post('/api/logout').then(() => {
        resolve()
      })
    })
  },
  chgPass ({commit, state}, params) {
    return new Promise(resolve => {
      axios.post('/api/chgPass', params).then(res => {
        resolve(res.data)
      })
    })
  },
  USER_LIST ({commit, state}) {
    return new Promise(resolve => {
      axios.get('/api/user', {params: state.user.params}).then(res => {
        let json = res.data
        if (json.code === 200) {
          commit('USER_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  USER_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('USER_SET_SIZE', size)
      resolve()
    })
  },
  USER_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('USER_SET_PAGE', page)
      resolve()
    })
  },
  USER_ROLE ({commit, state}, name) {
    return new Promise((resolve) => {
      axios.get('/api/user/get/user-role', {params: {name: name}}).then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('USER_ROLE', json.data)
        }
        resolve(json)
      })
    })
  },
  USER_ROLE_UPDATE ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/user/update/user-role', data).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  USER_ADD ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.post('/api/user/add', data).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  }
}

const mutations = {
  USER_LIST (state, data) {
    state.user.list = data.data
    state.user.total = data.total
  },
  USER_SET_SIZE (state, size) {
    state.user.params.size = size
  },
  USER_SET_PAGE (state, page) {
    state.user.params.page = page
  },
  USER_ROLE (state, json) {
    state.user.userRole = json
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
