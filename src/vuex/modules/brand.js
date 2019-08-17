import axios from '@/axios'

// 定义数据
const state = {
  brand: {
    list: [],
    total: 0
  }
}

const getters = {
  brand: state => state.brand
}

// 请求数据
const actions = {
  BRAND_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/brand').then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('BRAND_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  BRAND_SYNC ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/import/brand').then((res) => {
        let json = res.data
        if (json.code === 200) {
          resolve(json)
        }
      })
    })
  }
}

// 更新数据
const mutations = {
  BRAND_LIST (state, paging) {
    state.brand.list = paging.data
    state.brand.total = paging.total
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
