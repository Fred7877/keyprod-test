import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vuex from 'vuex'
import store from './src/store'
import VueRouter from 'vue-router'
import router from './router'
import mixin from "./mixin.js";

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)

if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser')
  worker.start()
}

new Vue({
  mixins: [mixin],
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')