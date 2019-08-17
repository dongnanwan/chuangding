import axios from '@/axios'
const state = {
  menu: {
    data: []
  }
}

const getters = {
  menu: state => state.menu
}

const actions = {
  MENU_ALL ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/permission').then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('MENU_ALL', json.data)
          resolve(json)
        }
      })
    })
  },
  MENU_DELETE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.delete('/api/permission/delete/' + id).then((res) => {
        let json = res.data
        if (json.code === 200) {
          resolve(json)
        }
      })
    })
  },
  MENU_INSERT ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.post('/api/permission/add', data).then((res) => {
        let json = res.data
        if (json.code === 200) {
          resolve(json)
        }
      })
    })
  }
}

const mutations = {
  MENU_ALL (state, data) {
    state.menu.data = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
