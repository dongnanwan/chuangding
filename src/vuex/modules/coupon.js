import axios from '@/axios'
// import qs from 'qs'
const state = {
  coupon: {
    list: [],
    params: {
      type: '',
      page: 1,
      size: 10
    },
    total: 0,
    temp: {
      id: 0,
      amount: 0,
      startTime: '',
      endTime: '',
      conditions: 0,
      type: '',
      planNum: 0
    }
  }
}

const getters = {
  coupon: state => state.coupon
}

const actions = {
  Coupon_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/coupon', {params: state.coupon.params}).then((res) => {
        let json = res.data
        commit('Coupon_LIST', json.data)
        resolve(json)
      })
    })
  },
  Coupon_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('Coupon_SET_SIZE', size)
    })
  },
  Coupon_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('Coupon_SET_PAGE', page)
    })
  },
  Coupon_POST ({commit, state}) {
    return new Promise((resolve) => {
      axios.post('/api/coupon', state.coupon.temp).then((res) => {
        let json = res.data
        if (json.code === 200) {
          state.coupon.temp = {
            id: 0,
            amount: 0,
            startTime: '',
            endTime: '',
            conditions: 0,
            type: '',
            planNum: 0
          }
        }
        resolve(json)
      })
    })
  },
  Coupon_DELETE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.delete('/api/coupon/' + id).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  }
}

const mutations = {
  Coupon_LIST (state, paging) {
    state.coupon.list = paging.data
    state.coupon.total = paging.total
  },
  Coupon_SET_SIZE (state, size) {
    state.coupon.params.size = size
  },
  Coupon_SET_PAGE (state, page) {
    state.coupon.params.page = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
