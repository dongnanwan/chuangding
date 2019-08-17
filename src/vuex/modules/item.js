import axios from '@/axios'
import qs from 'qs'
const state = {
  item: {
    list: [],
    params: {
      code: '',
      title: '',
      status: '',
      firstId: 0,
      secondId: 0,
      seriesId: 0,
      manage: true,
      page: 1,
      size: 10
    },
    total: 0,
    temp: {
      id: 0,
      uid: 0,
      code: '',
      status: null,
      title: '',
      subTitle: '',
      firstId: '',
      secondId: '',
      mainImage: '',
      images: [],
      colors: [],
      sizes: [],
      seriesId: 0,
      marketPrice: 0,
      lowPrice: 0,
      highPrice: 0,
      totalStock: 0,
      contentList: [],
      skuList: [],
      property: {
        propertyIds: [],
        propertyValues: []
      }
    }
  }
}

const getters = {
  item: state => state.item
}

const actions = {
  ITEM_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/item', {params: state.item.params}).then((res) => {
        console.log('-------------------------------')
        console.log(res.data.data.data)
        let json = res.data
        commit('ITEM_LIST', json.data)
        resolve(json)
      })
    })
  },
  ITEM_SIZE_CHG ({commit, state}, size) {
    return new Promise((resolve) => {
      commit('ITEM_SET_SIZE', size)
    })
  },
  ITEM_PAGE_CHG ({commit, state}, page) {
    return new Promise((resolve) => {
      commit('ITEM_SET_PAGE', page)
    })
  },
  ITEM_POST ({commit, state}) {
    return new Promise((resolve) => {
      axios.post('/api/item', state.item.temp).then((res) => {
        let json = res.data
        if (json.code === 200) {
          state.item.temp = {
            id: 0,
            uid: 0,
            code: '',
            status: null,
            title: '',
            subTitle: '',
            firstId: '',
            secondId: '',
            mainImage: '',
            images: [],
            colors: [],
            sizes: [],
            seriesId: 0,
            marketPrice: 0,
            lowPrice: 0,
            highPrice: 0,
            totalStock: 0,
            contentList: [],
            skuList: [],
            property: null
          }
        }
        resolve(json)
      })
    })
  },
  ITEM_TEMP_CLEAR ({commit, state}) {
    return new Promise((resolve) => {
      state.item.temp = {
        id: 0,
        uid: 0,
        code: '',
        status: null,
        title: '',
        subTitle: '',
        firstId: '',
        secondId: '',
        mainImage: '',
        images: [],
        colors: [],
        sizes: [],
        seriesId: 0,
        marketPrice: 0,
        lowPrice: 0,
        highPrice: 0,
        totalStock: 0,
        contentList: [],
        skuList: [],
        property: {
          propertyIds: [],
          propertyValues: []
        }
      }
    })
  },
  ITEM_EDIT ({commit, state}, item) {
    return new Promise((resolve) => {
      if (item.id !== state.item.temp.id) {
        axios.get('/api/item/' + item.id).then((res) => {
          let json = res.data
          if (json.data) {
            commit('ITEM_EDIT', json.data)
          }
          resolve(json.data)
        })
      } else {
        resolve()
      }
    })
  },
  ITEM_GET ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.get('/api/item/' + id).then((res) => {
        let json = res.data
        resolve(json.data)
      })
    })
  },
  ITEM_SET_STATUS ({commit, state}, params) {
    return new Promise((resolve) => {
      axios.post('/api/item/chgStatus', qs.stringify(params)).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  ITEM_ONLINE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.post('/api/item/online', qs.stringify({id: id})).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  ITEM_OFFLINE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.post('/api/item/offline', qs.stringify({id: id})).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  ITEM_DELETE ({commit, state}, id) {
    return new Promise((resolve) => {
      axios.delete('/api/item?id=' + id).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  ITEM_Relevance_SAVE ({commit, state}, params) {
    return new Promise((resolve) => {
      axios.post('/api/item/relevance', qs.stringify(params)).then((res) => {
        let json = res.data
        resolve(json)
      })
    })
  },
  ALL_SYNC ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/import/all').then((res) => {
        let json = res.data
        if (json.code === 200) {
          resolve(json)
        }
      })
    })
  }
}

const mutations = {
  ITEM_LIST (state, paging) {
    state.item.list = paging.data
    state.item.total = paging.total
  },
  ITEM_SET_SIZE (state, size) {
    state.item.params.size = size
  },
  ITEM_SET_PAGE (state, page) {
    state.item.params.page = page
  },
  ITEM_EDIT (state, item) {
    state.item.temp = item
    if (state.item.temp.property === null) {
      state.item.temp.property = {
        propertyIds: [],
        propertyValues: []
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
