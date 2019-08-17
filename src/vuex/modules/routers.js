import {constantRouterMap} from '@/router'
const state = {
  tabViews: [],
  routers: constantRouterMap
}

const getters = {
  tabViews: state => state.tabViews,
  routers: state => state.routers
}

const actions = {
  addView ({commit, state}, view) {
    commit('addTabView', view)
  },
  delView ({commit}, view) {
    return new Promise((resolve) => {
      commit('delTabView', view)
      resolve([...state.tabViews])
    })
  }
}

const mutations = {
  addTabView (state, view) {
    if (state.tabViews.some(v => v.path === view.path)) return
    state.tabViews.push(view)
  },
  delTabView (state, view) {
    for (const [i, v] of state.tabViews.entries()) {
      if (v.path === view.path) {
        state.tabViews.splice(i, 1)
        break
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
