import axios from '@/axios'

const state = {
  sizes: {
    list: [],
    total: 0
  }
}

const getters = {
  sizes: state => state.sizes
}

const actions = {
  SIZE_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/size').then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('SIZE_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  SIZE_SYNC ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/import/size').then((res) => {
        let json = res.data
        if (json.code === 200) {
          resolve(json)
        }
      })
    })
  }
}

const mutations = {
  SIZE_LIST (state, paging) {
    state.sizes.list = paging.data
    state.sizes.total = paging.total
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
