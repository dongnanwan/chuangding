import axios from '@/axios'
const state = {
  baseProperties: []
}

const getters = {
  baseProperties: state => state.baseProperties
}

const actions = {
  listBaseProperties ({commit, state}) {
    return new Promise(resolve => {
      axios.get('/api/item-property/base-properties').then(res => {
        commit('setBaseProperties', res.data.data)
        resolve(res.data)
      })
    })
  },
  saveBaseProperty ({commit, state}, property) {
    return new Promise(resolve => {
      axios.post('/api/item-property/save-property', property).then(res => {
        let json = res.data
        if (json.code === 200 && property.id === 0) {
          property.id = json.data
          commit('addBaseProperty', property)
        }
        resolve(json)
      })
    })
  },
  deleteProperty ({commit, state}, index) {
    return new Promise(resolve => {
      let property = state.baseProperties[index]
      axios.delete('/api/item-property/delete-property', {params: {id: property.id}}).then(res => {
        let json = res.data
        if (json.code === 200) {
          commit('delBaseProperty', index)
          resolve()
        }
      })
    })
  },
  listPropertyValues ({commit, state}, id) {
    return new Promise(resolve => {
      axios.get('/api/item-property/base-property-values', {params: {id: id}}).then(res => {
        let json = res.data
        resolve(json.data)
      })
    })
  },
  deletePropertyValue ({commit, state}, id) {
    return new Promise(resolve => {
      axios.delete('/api/item-property/delete-property-value', {params: {id: id}}).then(res => {
        let json = res.data
        console.log(json)
        if (json.code === 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  },
  saveBasePropertyValue ({commit, state}, value) {
    return new Promise(resolve => {
      axios.post('/api/item-property/save-property-value', value).then(res => {
        resolve(res.data)
      })
    })
  }
}

const mutations = {
  setBaseProperties (state, list) {
    state.baseProperties = list
  },
  delBaseProperty (state, index) {
    state.baseProperties.splice(index, 1)
  },
  addBaseProperty (state, property) {
    state.baseProperties = state.baseProperties.concat(property)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
