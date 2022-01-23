import Vue from 'vue'
import VueRouter from 'vue-router'
import Orders from '../components/Orders.vue'
import store from '../src/store'
import Login from '../components/Login'
import DetailsOrder from '../components/DetailsOrder'
import TrackingParcel from "../components/TrackingParcel";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    alias: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/orders',
    component: Orders,
    name: 'orders',
    meta: {requiresAuth: true},
  },
  {
    path: '/details-order/:orderId',
    component: DetailsOrder,
    name: 'details-order',
    meta: {requiresAuth: true},
  },
  {
    path: '/tracking-parcel',
    component: TrackingParcel,
    name: 'tracking-parcel',
    meta: {requiresAuth: true},
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router
