import axios from '@/axios'
const state = {
  shopkeeper: {
    list: [],
    total: 0,
    params: {
      page: 1,
      size: 10
    },
    temp: {
      name: '',
      creditCode: '',
      telephone: ''
    }
  }
}

const getters = {
  shopkeeper: state => state.shopkeeper
}

const actions = {
  SHOPKEEPER_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/shopkeeper', {params: state.shopkeeper.params}).then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('SHOPKEEPER_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  SHOPKEEPER_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('SHOPKEEPER_SET_SIZE', size)
      resolve()
    })
  },
  SHOPKEEPER_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('SHOPKEEPER_SET_PAGE', page)
      resolve()
    })
  },
  SHOPKEEPER_POST ({commit, state}) {
    return new Promise((resolve) => {
      axios.post('/api/shopkeeper', state.shopkeeper.temp).then((res) => {
        let json = res.data
        if (json.code === 200) {
          state.shopkeeper.temp = {
            name: '',
            telephone: ''
          }
        }
        resolve(json)
      })
    })
  },
  SHOPKEEPER_EDIT ({commit, state}, data) {
    return new Promise((resolve) => {
      if (data.id !== state.shopkeeper.temp.id) {
        axios.get('/api/shopkeeper/' + data.id).then((res) => {
          let json = res.data
          if (json.data) {
            commit('SHOPKEEPER_EDIT', json.data)
          }
          resolve(json)
        })
      } else {
        resolve()
      }
    })
  },
  SHOPKEEPER_PUT ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shopkeeper/update/' + data.id, state.shopkeeper.temp).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SHOPKEEPER_BIND ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.post('/api/shopkeeper/bind/' + data.id + '?memberCode=' + data.memberCode).then((res) => {
        console.log(res)
        let json = res.data
        resolve(json)
      })
    })
  }
}

const mutations = {
  SHOPKEEPER_LIST (state, paging) {
    state.shopkeeper.list = paging.data
    state.shopkeeper.total = paging.total
  },
  SHOPKEEPER_EDIT (state, json) {
    state.shopkeeper.temp = json
  },
  SHOPKEEPER_SET_SIZE (state, size) {
    state.shopkeeper.params.size = size
  },
  SHOPKEEPER_SET_PAGE (state, page) {
    state.shopkeeper.params.page = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
