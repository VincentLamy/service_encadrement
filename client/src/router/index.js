import Vue from 'vue'
import VueRouter from 'vue-router'
import DatetimePicker from 'vuetify-datetime-picker'
import HomeView from '../views/HomeView.vue'
import StudentFormView from '../views/StudentFormView.vue'

Vue.use(VueRouter)
Vue.use(DatetimePicker)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/etudiant',
    name: 'etudiant',
    component: StudentFormView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
