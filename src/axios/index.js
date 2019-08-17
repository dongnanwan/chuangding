import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
import Vue from 'vue'

const service = axios.create({
  timeout: 50000 // request timeout
})
service.interceptors.request.use(function (config) {
  config.headers.Authorization = 'Authorization ' + sessionStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  Vue.prototype.closeLoading()
  return Promise.reject(error)
})
service.interceptors.response.use(function (response) {
  if (response.status === 200) {
    let json = response.data
    if (json.code === 401 || json.code === 302) {
      if (Vue.closeLoading) {
        Vue.closeLoading()
      }
      router.push('/login')
    } else if (json.code === 500 && json.message) {
      Message.warning(json.message)
    }
    if (sessionStorage.getItem('login_time') !== null) {
      sessionStorage.setItem('login_time', new Date().getTime())
    }
  }
  return response
}, function (error) {
  Vue.prototype.closeLoading()
  if (error.response && error.response.status === 403) {
    Message.error('您没有权限操作')
  }
  return Promise.reject(error)
})

export default service
