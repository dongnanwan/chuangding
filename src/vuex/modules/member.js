import axios from '@/axios'

const state = {
  member: {
    list: [],
    total: 0,
    params: {
      page: 1,
      size: 10
    }
  }
}

const getters = {
  member: state => state.member
}

const actions = {
  MEMBER_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/member/findMembers', {params: state.member.params}).then((res) => {
        let json = res.data
        console.log(json)
        commit('MEMBER_LIST', json.data)
        resolve(json)
      })
    })
  },
  MEMBER_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('MEMBER_SET_SIZE', size)
      resolve()
    })
  },
  MEMBER_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('MEMBER_SET_PAGE', page)
      resolve()
    })
  }
}

const mutations = {
  MEMBER_LIST (state, data) {
    state.member.list = data.data
    state.member.total = data.total
  },
  MEMBER_SET_SIZE (state, size) {
    state.member.params.size = size
  },
  MEMBER_SET_PAGE (state, page) {
    state.member.params.page = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
