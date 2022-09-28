import Vue from 'vue'
import VueRouter from 'vue-router'
import DatetimePicker from 'vuetify-datetime-picker'
import HomeView from '../views/HomeView.vue'
import CSVImportView from '../views/CSVImportView.vue'
import StudentListView from '../views/StudentListView.vue'
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
    path: '/csv_import',
    name: 'csv-import',
    component: CSVImportView
  },
  {
    path: '/student_list',
    name: 'student_list',
    component: StudentListView
  },
  {
    path: '/student_form/:id',
    name: 'student_form',
    component: StudentFormView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
