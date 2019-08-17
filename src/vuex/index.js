import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user'
import Routers from './modules/routers'
import setting from './modules/setting'
import member from './modules/member'
import banner from './modules/banner'
import category from './modules/category'
import properties from './modules/properties'
import series from './modules/series'
import item from './modules/item'
import trade from './modules/trade'
import refund from './modules/refund'
import coupon from './modules/coupon'
import marketing from './modules/marketing'
import brand from './modules/brand'
import sizes from './modules/sizes'
import shop from './modules/shop'
import partner from './modules/partner'
import shopkeeper from './modules/shopkeeper'
import address from './modules/address'
import menu from './modules/menu'
import role from './modules/role'
import stock from './modules/stock'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    User,
    Routers,
    setting,
    member,
    banner,
    category,
    properties,
    series,
    item,
    trade,
    refund,
    coupon,
    marketing,
    brand,
    sizes,
    shop,
    partner,
    shopkeeper,
    address,
    menu,
    role,
    stock
  }
})
