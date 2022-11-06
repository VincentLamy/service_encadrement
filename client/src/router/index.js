import Vue from 'vue'
import VueRouter from 'vue-router'
import DatetimePicker from 'vuetify-datetime-picker'
import LoginView from '../views/LoginView.vue'
import CSVImportView from '../views/CSVImportView'
import StudentListView from '../views/StudentListView'
import StudentFormView from '../views/StudentFormView'

import SupervisorFormView from '../views/SupervisorFormView'

Vue.use(VueRouter)
Vue.use(DatetimePicker)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/csv_import',
    name: 'csv-import',
    component: CSVImportView,
  },
  {
    path: '/student_list',
    name: 'student_list',
    component: StudentListView,
  },
  {
    path: '/student_form/:id',
    name: 'student_form',
    component: StudentFormView
  },
  {
    path: '/supervisor_form/:id',
    name: 'supervisor_form',
    component: SupervisorFormView
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

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !sessionStorage.getItem("authentication")) {
    next({ name: 'login' });
  } else {
    next();
  }
})

export default router