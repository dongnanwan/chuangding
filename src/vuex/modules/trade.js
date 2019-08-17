import axios from '@/axios'

const state = {
  trade: {
    list: [],
    send_list: [],
    params: {
      page: 1,
      size: 10
    },
    send_prams: {
      page: 1,
      size: 20
    },
    total: 0,
    send_total: 0
  }
}

const getters = {
  trade: state => state.trade
}

const actions = {
  Trade_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/trade', {params: state.trade.params}).then((res) => {
        console.log(res.data.data.data)
        let json = res.data
        commit('Trade_LIST', json.data)
        resolve(json)
      })
    })
  },
  Trade_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('Trade_SET_SIZE', size)
    })
  },
  Trade_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('Trade_SET_PAGE', page)
    })
  },
  SEND_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/trade/all/packet', {send_prams: state.trade.send_prams}).then((res) => {
        console.log(state.trade.send_prams)
        let json = res.data
        commit('SEND_LIST', json.data)
        resolve(json)
      })
    })
  },
  SEND_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('SEND_SET_SIZE', size)
    })
  },
  SEND_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('SEND_SET_PAGE', page)
    })
  }
}

const mutations = {
  Trade_LIST (state, paging) {
    state.trade.list = paging.data
    state.trade.total = paging.total
  },
  Trade_SET_SIZE (state, size) {
    state.trade.params.size = size
  },
  Trade_SET_PAGE (state, page) {
    state.trade.params.page = page
  },
  SEND_LIST (state, paging) {
    state.trade.send_list = paging.data
    state.trade.send_total = paging.total
    console.log(paging)
  },
  SEND_SET_SIZE (state, size) {
    state.trade.send_prams.size = size
  },
  SEND_SET_PAGE (state, page) {
    state.trade.send_prams.page = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
