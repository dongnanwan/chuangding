import axios from '@/axios'

const state = {
  stock: {
    list: [],
    total: 0,
    params:{
      page:1,
      size:2
    },
    accountlist:[],
    accounttotal:0,
    accountparams:{
      page:1,
      size:2
    }
  }
}

const getters = {
  stock: state => state.stock
}

const actions = {
  STOCK_LIST ({commit, state}) {
    return new Promise((resolve) => {
      axios.get('/api/stock/all',{params:state.stock.params}).then((res) => {
        let json = res.data
        if (json.code === 200) {
          commit('STOCK_LIST', json.data)
          resolve(json)
        }
      })
    })
  },
  STOCK_ARGS_CHANGE({commit,state},args){
    return new Promise((resolve)=>{
      commit('STOCK_ARGS_CHANGE',args)
    })
  },
  ACCOUNT_LIST({commit,state}){
    return new Promise((resolve)=>{
      axios('/api/stock/history',{params:state.stock.accountparams}).then((res)=>{
        let json = res.data
        if(json.code == 200){
          commit('ACCOUNT_LIST',json.data)
          // console.log(state.stock.accountlist)
        }
      })
    })
  },
  ACCOUNT_ARGS_CHANGE({commit,state},args){
    return new Promise((resolve)=>{
      commit('ACCOUNT_ARGS_CHANGE',args)
    })
  }
}

const mutations = {
  STOCK_LIST (state, paging) {
    state.stock.list = paging.data
    state.stock.total = paging.total
  },
  STOCK_ARGS_CHANGE (state,args){
    Object.assign(state.stock.params,args)
  },
  ACCOUNT_LIST(state,res){
    state.stock.accountlist = res.data
    state.stock.accounttotal = res.total
  },
  ACCOUNT_ARGS_CHANGE (state,args){
    Object.assign(state.stock.accountparams,args)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
