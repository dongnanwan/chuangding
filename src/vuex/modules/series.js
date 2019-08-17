import axios from '@/axios'
const state = {
  series: {
    all: [],
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
      name: ''
    }
  }
}

const getters = {
  series: state => state.series
}

const actions = {
  SERIES_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/series', {params: state.series.params}).then((res) => {
        console.log(res)
        let json = res.data
        if (json.code === 200) {
          commit('SERIES_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  SERIES_ALL ({commit, state}, page) {
    return new Promise((resolve) => {
      axios.get('/api/series/all').then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('SERIES_ALL', json.data)
          resolve()
        }
      })
    })
  },
  SERIES_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('SERIES_SET_SIZE', size)
    })
  },
  SERIES_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('SERIES_SET_PAGE', page)
    })
  },
  SERIES_POST ({commit, state}) {
    return new Promise((resolve) => {
      axios.post('/api/series', state.series.temp).then((res) => {
        let json = res.data
        if (json.code === 200) {
          if (state.series.temp.id > 0) {
            commit('SEREIS_CHG', state.series.temp)
          }
          state.series.temp = {
            id: 0,
            pid: 0,
            name: ''
          }
        }
        resolve(json)
      })
    })
  },
  SERIES_TEMP_CLEAR ({commit, state}) {
    return new Promise((resolve) => {
      state.series.temp = {
        id: 0,
        pid: 0,
        name: ''
      }
    })
  },
  SERIES_EDIT ({commit, state}, series) {
    return new Promise((resolve) => {
      if (series.id !== state.series.temp.id) {
        axios.get('/api/series/' + series.id).then((res) => {
          let json = res.data
          if (json.data) {
            commit('SERIES_EDIT', json.data)
          }
          resolve(json)
        })
      } else {
        resolve()
      }
    })
  },
  SERIES_GET ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.get('/api/series/' + id).then((res) => {
        let json = res.data
        resolve(json.data)
      })
    })
  },
  SERIES_DELETE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.delete('/api/series/' + id).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SERIES_SYNC ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/import/series').then((res) => {
        let json = res.data
        if (json.code === 200) {
          resolve(json)
        }
      })
    })
  }
}

const mutations = {
  SERIES_LIST (state, paging) {
    state.series.list = paging.data
    state.series.total = paging.total
  },
  SERIES_ALL (state, list) {
    state.series.all = list
  },
  SERIES_SET_SIZE (state, size) {
    state.series.params.size = size
  },
  SERIES_SET_PAGE (state, page) {
    state.series.params.page = page
  },
  SERIES_EDIT (state, series) {
    state.series.temp = series
  },
  SEREIS_CHG (state, series) {
    state.series.list.map((v) => {
      if (v.id === series.id) {
        v.name = series.name
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
