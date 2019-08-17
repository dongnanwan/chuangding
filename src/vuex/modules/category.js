import axios from '@/axios'

const state = {
  category: {
    firstCategories: [],
    list: [],
    params: {
      pid: 0,
      name: '',
      page: 1,
      size: 10
    },
    total: 0,
    temp: {
      id: 0,
      pid: 0,
      name: '',
      icoUrl: ''
    }
  }
}

const getters = {
  category: state => state.category
}

const actions = {
  CATEGORY_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/category', {params: state.category.params}).then((res) => {
        console.log(res)
        let json = res.data
        if (json.code === 200) {
          commit('CATEGORY_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  CATEGORY_FIRST_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/category/all').then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('CATEGORY_FIRST_LIST', json.data)
          resolve()
        }
      })
    })
  },
  CATEGORY_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('CATEGORY_SET_SIZE', size)
    })
  },
  CATEGORY_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('CATEGORY_SET_PAGE', page)
    })
  },
  CATEGORY_POST ({commit, state}) {
    return new Promise((resolve) => {
      axios.post('/api/category', state.category.temp).then((res) => {
        let json = res.data
        if (json.code === 200) {
          state.category.temp = {
            id: 0,
            pid: 0,
            name: '',
            icoUrl: ''
          }
        }
        resolve(json)
      })
    })
  },
  CATEGORY_TEMP_CLEAR ({commit, state}) {
    return new Promise((resolve) => {
      state.category.temp = {
        id: 0,
        pid: 0,
        name: '',
        icoUrl: ''
      }
    })
  },
  CATEGORY_EDIT ({commit, state}, category) {
    return new Promise((resolve) => {
      if (category.id !== state.category.temp.id) {
        axios.get('/api/category/' + category.id).then((res) => {
          let json = res.data
          if (json.data) {
            commit('CATEGORY_EDIT', json.data)
          }
          resolve(json)
        })
      } else {
        resolve()
      }
    })
  },
  CATEGORY_GET ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.get('/api/category/' + id).then((res) => {
        
        let json = res.data
        resolve(json.data)
      })
    })
  },
  CATEGORY_DELETE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.delete('/api/category/' + id).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  CATEGORY_SYNC ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/import/category').then((res) => {
        let json = res.data
        if (json.code === 200) {
          resolve(json)
        }
      })
    })
  }
}

const mutations = {
  CATEGORY_LIST (state, paging) {
    state.category.list = paging.data
    state.category.total = paging.total
  },
  CATEGORY_FIRST_LIST (state, list) {
    state.category.firstCategories = list
  },
  CATEGORY_SET_SIZE (state, size) {
    state.category.params.size = size
  },
  CATEGORY_SET_PAGE (state, page) {
    state.category.params.page = page
  },
  CATEGORY_EDIT (state, category) {
    state.category.temp = category
    if (!state.category.temp.icoUrl) {
      state.category.temp.icoUrl = ''
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
