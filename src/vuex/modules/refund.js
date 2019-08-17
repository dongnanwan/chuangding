import axios from '@/axios'

const state = {
  refund: {
    list: [],
    params: {
      status: '',
      page: 1,
      size: 10
    },
    total: 0,
    temp: {
    }
  }
}

const getters = {
  refund: state => state.refund
}

const actions = {
  Refund_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/refund', {params: state.refund.params}).then((res) => {
        if (res.code === 200) {

        }
        console.log(res)
        let json = res.data
        commit('Refund_LIST', json.data)
        resolve(res.data)
      })
    })
  },
  Refund_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('Refund_SET_SIZE', size)
    })
  },
  Refund_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('Refund_SET_PAGE', page)
    })
  },
  // Refund_GET ({commit, state}, id) {
  //   return new Promise((resolve) => {
  //     axios.get('/api/refund/' + id).then((res) => {
  //       let json = res.data
  //       resolve(json.data)
  //     })
  //   })
  // },
  Refund_deny ({commit, state}, params) {
    return new Promise((resolve) => {
      axios.post('/api/refund/' + params.id + '/deny?reason=' + params.reason).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  Refund_agreeRefund ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.post('/api/refund/' + id + '/goods/agree').then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  Refund_agree ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.post('/api/refund/' + id + '/money/agree').then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  }// ,
  // Refund_confirm ({commit, state}, id) {
  //   return new Promise((resolve) => {
  //     axios.post('/api/refund/confirm', qs.stringify({id: id})).then((res) => {
  //       let json = res.data
  //       resolve(json)
  //     })
  //   })
  // }
}

const mutations = {
  Refund_LIST (state, paging) {
    state.refund.list = paging.data
    state.refund.total = paging.total
  },
  Refund_SET_SIZE (state, size) {
    state.refund.params.size = size
  },
  Refund_SET_PAGE (state, page) {
    state.refund.params.page = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
