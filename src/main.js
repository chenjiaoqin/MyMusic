import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueResource from 'vue-resource'
import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'
import './icons'

Vue.config.devtools =true
Vue.use(VueLazyLoad,{
  loading:require('common/image/default.png')
})

Vue.prototype.$bus=new Vue()

Vue.prototype.$axios=axios

Vue.use(VueResource)

fastclick.attach(document.body);

Vue.config.productionTip = false


import 'common/stylus/index.styl'

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
