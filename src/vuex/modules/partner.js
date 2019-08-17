import axios from '@/axios'
const state = {
  partner: {
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
  partner: state => state.partner
}

const actions = {
  PARTNER_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/partner', {params: state.partner.params}).then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('PARTNER_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  PARTNER_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('PARTNER_SET_SIZE', size)
      resolve()
    })
  },
  PARTNER_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('PARTNER_SET_PAGE', page)
      resolve()
    })
  },
  PARTNER_POST ({commit, state}) {
    return new Promise((resolve) => {
      axios.post('/api/partner/add', state.partner.temp).then((res) => {
        let json = res.data
        if (json.code === 200) {

        }
        resolve(json)
      })
    })
  },
  PARTNER_EDIT ({commit, state}, data) {
    return new Promise((resolve) => {
      if (data.id !== state.partner.temp.id) {
        axios.get('/api/partner/' + data.id).then((res) => {
          let json = res.data
          if (json.data) {
            commit('PARTNER_EDIT', json.data)
          }
          resolve(json)
        })
      } else {
        resolve()
      }
    })
  },
  PARTNER_PUT ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/partner/modify/' + data.id, state.partner.temp).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  PARTNER_BIND ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.post('/api/partner/bind/' + data.id + '?memberCode=' + data.memberCode).then((res) => {
        console.log(res)
        let json = res.data
        resolve(json)
      })
    })
  }
}

const mutations = {
  PARTNER_LIST (state, paging) {
    state.partner.list = paging.data
    state.partner.total = paging.total
    state.partner.temp = {
      name: '',
      telephone: ''
    }
  },
  PARTNER_EDIT (state, json) {
    state.partner.temp = json
  },
  PARTNER_SET_SIZE (state, size) {
    state.partner.params.size = size
  },
  PARTNER_SET_PAGE (state, page) {
    state.partner.params.page = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
