import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import Print from 'vue-print-nb'

import store from './vuex'

Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(Print)
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

Vue.prototype.openLoading = function (text) {
    Vue.prototype.loading = Vue.prototype.$loading({
        lock: true,
        text: text || '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
  
Vue.prototype.closeLoading = function () {
    Vue.prototype.loading.close()
}
  

const i18n = new VueI18n({
    locale: 'zh',
    messages
})


// let arr = ['/test','/stockcommon','/login','/dashboard','/403']
// axios.get('/api/permission').then((res)=>{
//     res.data.data.forEach((val,ind)=>{
//         val.children.forEach((value,index)=>{
//             arr.push(value.path)
//         })
//     })
// })

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {

    to.meta.keepAlive = true;
    from.meta.keepAlive = true;

    let arr = ['/login','/dashboard','/403']
    if(sessionStorage.getItem('user_permissions')){
        JSON.parse(sessionStorage.getItem('user_permissions')).forEach((val,ind)=>{
            val.children.forEach((value,index)=>{
                arr.push(value.path)
            })
        })
    }
 

    
    let flag = false
    // const role = localStorage.getItem('ms_username');
    const role = sessionStorage.getItem('who_name');
    if (!role && to.path !== '/login'){
        next('/login');
    }else{
        arr.forEach((val,ind)=>{
            if(val == to.path){
                flag = true
            }
        })
        if(flag){
            next()
        }else{
            next('/403')
        }
        // next()
       
    }
    

    
    
    // if (!role && to.path !== '/login') {
       
    //     next('/login');
    // } else if (to.meta.permission) {
       
    //     role === 'admin' ? next() : next('/403');
    // } else {
        
    //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //             confirmButtonText: '确定'
    //         });
    //     } else {
    //         next();
    //     }
    // }
})


new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')