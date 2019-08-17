import axios from '@/axios'

const state = {
  shop: {
    list: [],
    total: 0,
    params: {
      page: 1,
      size: 10
    },
    temp: {
      name: '',
      address: '',
      regionId: '',
      provinceId: '',
      cityId: '',
      areaId: '',
      partnerId: '',
      latitude: 0,
      longitude: 0
    }
  }
}

const getters = {
  shop: state => state.shop
}

const actions = {
  SHOP_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/shop', {params: state.shop.params}).then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('SHOP_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  SHOP_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('SHOP_SET_SIZE', size)
      resolve()
    })
  },
  SHOP_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('SHOP_SET_PAGE', page)
      resolve()
    })
  },
  SHOP_ADD ({commit, state}) {
    console.log(state.shop.temp)
    return new Promise((resolve) => {
      axios.post('/api/shop',state.shop.temp).then(res => {
        console.log(res)
        this.$router.push('shop_list')
        // var latitude = 0
        // var longitude = 0
        // if (res.data.geocodes.length > 0) {
        //   var location = res.data.geocodes[0].location
        //   latitude = parseFloat(location.split(',')[0])
        //   longitude = parseFloat(location.split(',')[1])
        // }
        // state.shop.temp.latitude = latitude
        // state.shop.temp.longitude = longitude
        // axios.post('/api/shop', state.shop.temp).then((res) => {
        //   let json = res.data
        //   if (json.code === 200) {
        //     state.shop.temp = {
        //       name: '',
        //       address: '',
        //       regionId: '',
        //       provinceId: '',
        //       cityId: '',
        //       areaId: '',
        //       partnerId: '',
        //       latitude: 0,
        //       longitude: 0
        //     }
        //   }
        //   resolve(json)
        // })
      })
    })
  },
  SHOP_EDIT ({commit, state}, shop) {
    return new Promise((resolve) => {
      if (shop.id !== state.shop.temp.id) {
        axios.get('/api/shop/' + shop.id, state.shop.temp).then((res) => {
          let json = res.data
          if (json.data) {
            commit('SHOP_EDIT', json.data)
          }
          resolve(json)
        })
      } else {
        resolve()
      }
    })
  },
  SHOP_PUT ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shop/' + data.id, state.shop.temp).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SHOP_START_VERIFY ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shop/verify/' + data.id + '/start').then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SHOP_VERIFY_SUCCESS ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shop/verify/' + data.id + '/success').then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SHOP_VERIFY_FAILURE ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shop/verify/' + data.id + '/failure?reason=' + data.reason).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SHOP_ENABLE ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shop/' + data.id + '/enable').then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SHOP_DISABLE ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shop/' + data.id + '/unable').then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  SHOP_SHOPKEEPER_CHANGE ({commit, state}, data) {
    return new Promise((resolve) => {
      axios.put('/api/shop/manager/change?shopId=' + data.shopId + '&managerId=' + data.managerId).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  }

}

const mutations = {
  SHOP_LIST (state, paging) {
    state.shop.list = paging.data
    state.shop.total = paging.total
  },
  SHOP_EDIT  (state, json) {
    state.shop.temp = json
  },
  SHOP_SET_SIZE (state, size) {
    state.shop.params.size = size
  },
  SHOP_SET_PAGE (state, page) {
    state.shop.params.page = page
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
