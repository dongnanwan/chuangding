import axios from '@/axios'

const state = {
  region: {
    list: []
  },
  province: {
    list: []
  },
  city: {
    list: []
  },
  area: {
    list: []
  }
}

const getters = {
  region: state => state.region,
  province: state => state.province,
  city: state => state.city,
  area: state => state.area
}

const actions = {
  REGION_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/address/region').then((res) => {
        let json = res.data
        commit('REGION_LIST', json.data)
        resolve(json)
      })
    })
  },
  PROVINCE_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/address/province', {params: {page: 1, size: 100}}).then((res) => {
        let json = res.data
        commit('PROVINCE_LIST', json.data)
        resolve(json)
      })
    })
  },
  CITY_LIST ({commit, state}, provinceId) {
    return new Promise((resolve) => {
      axios.get('/api/address/city', {params: {provinceId: provinceId, page: 1, size: 100}}).then((res) => {
        let json = res.data
        commit('CITY_LIST', json.data)
        resolve(json)
      })
    })
  },
  AREA_LIST ({commit, state}, cityId) {
    return new Promise((resolve) => {
      axios.get('/api/address/area', {params: {cityId: cityId, page: 1, size: 200, name: ''}}).then((res) => {
        let json = res.data
        commit('AREA_LIST', json.data)
        resolve(json)
      })
    })
  }
}

const mutations = {
  REGION_LIST (state, json) {
    state.region.list = json.data
  },
  PROVINCE_LIST (state, json) {
    state.province.list = json.data
  },
  CITY_LIST (state, json) {
    state.city.list = json.data
  },
  AREA_LIST (state, json) {
    state.area.list = json.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
