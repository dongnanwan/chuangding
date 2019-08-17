import axios from '@/axios'

const state = {
  role: {
    list: [],
    perm_list: [],
    total: 0,
    temp: {}
  }
}

const getters = {
  role: state => state.role
}

const actions = {
  ROLE_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/role').then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('ROLE_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  ROLE_ADD ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.post('/api/role/add?name=' + data.name).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  ROLE_PERMISSION_LIST ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.get('/api/role/get/role-permission/' + data.id).then((res) => {
        console.log(res)
        let json = res.data
        if (json.data) {
          commit('ROLE_PERMISSION_LIST', json.data)
        }
        resolve(json)
      })
    })
  },
  ROLE_PERMISSION_UPDATE ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/role/update/role-permission', data).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  }

}

const mutations = {
  ROLE_LIST (state, data) {
    state.role.list = data
    state.role.perm_list = []
  },
  ROLE_PERMISSION_LIST  (state, json) {
    state.role.perm_list = json
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
