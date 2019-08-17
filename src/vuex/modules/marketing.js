import axios from '@/axios'
import qs from 'qs'
const state = {
  marketing: {
    list: [],
    params: {
      type: '',
      page: 1,
      size: 10
    },
    total: 0,
    temp: {
      id: 0,
      itemId: 0,
      title: '',
      startTime: '',
      endTime: '',
      type: '',
      openNum: 0,
      percent: 0,
      skuList: [
      ]
    }
  }
}

const getters = {
  marketing: state => state.marketing
}

const actions = {
  marketing_List ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/marketing', {params: state.marketing.params}).then((res) => {
        let json = res.data
        commit('marketing_LIST', json.data)
        resolve(json)
      })
    })
  },
  marketing_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('marketing_SET_SIZE', size)
    })
  },
  marketing_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('marketing_SET_PAGE', page)
    })
  },
  marketing_POST ({commit, state}) {
    return new Promise((resolve) => {
      axios.post('/api/marketing', state.marketing.temp).then((res) => {
        let json = res.data
        if (json.code === 200) {
          state.marketing.temp = {
          }
        }
        resolve(json)
      })
    })
  },
  marketing_TEMP_CLEAR ({commit, state}) {
    return new Promise((resolve) => {
      state.marketing.temp = {
      }
    })
  },
  marketing_EDIT ({commit, state}, marketing) {
    return new Promise((resolve) => {
      if (marketing.id !== state.marketing.temp.id) {
        axios.get('/api/marketing/' + marketing.id).then((res) => {
          let json = res.data
          if (json.data) {
            commit('marketing_EDIT', json.data)
          }
          resolve(json.data)
        })
      } else {
        resolve()
      }
    })
  },
  marketing_GET ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.get('/api/marketing/' + id).then((res) => {
        let json = res.data
        resolve(json.data)
      })
    })
  },
  marketing_SET_STATUS ({commit, state}, params) {
    return new Promise((resolve) => {
      axios.post('/api/marketing/chgStatus', qs.stringify(params)).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  marketing_SET_ITEM ({commit, state}, item) {
    return new Promise((resolve) => {
      commit('marketing_Set', item)
      resolve()
    })
  },
  marketing_OFFLINE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.post('/api/marketing/offline', qs.stringify({id: id})).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  marketing_DELETE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.delete('/api/marketing?id=' + id).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  }
}

const mutations = {
  marketing_LIST (state, paging) {
    state.marketing.list = paging.data
    state.marketing.total = paging.total
  },
  marketing_SET_SIZE (state, size) {
    state.marketing.params.size = size
  },
  marketing_SET_PAGE (state, page) {
    state.marketing.params.page = page
  },
  marketing_EDIT (state, marketing) {
    state.marketing.temp.id = marketing.id
    state.marketing.temp.itemId = marketing.itemId
    state.marketing.temp.title = marketing.title
    state.marketing.temp.type = marketing.type
    state.marketing.temp.openNum = marketing.openNum
    state.marketing.temp.percent = marketing.percent
    state.marketing.temp.skuList = marketing.skuList
  },
  marketing_Set (state, item) {
    state.marketing.temp.id = 0
    state.marketing.temp.type = ''
    state.marketing.temp.openNum = 0
    state.marketing.temp.percent = 0
    state.marketing.temp.title = item.title
    state.marketing.temp.itemId = item.id
    state.marketing.temp.skuList = []
    item.skuList.forEach(sku => {
      state.marketing.temp.skuList.push({
        skuId: sku.id,
        price: sku.price,
        sku: sku
      })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
