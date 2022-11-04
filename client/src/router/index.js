import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView'
import CSVImportView from '../views/CSVImportView'
import StudentListView from '../views/StudentListView'
import StudentFormView from '../views/StudentFormView'

import SupervisorFormView from '../views/SupervisorFormView'
import SupervisorListView from '../views/SupervisorListView'
import SupervisorAddView from '../views/SupervisorAddView'

Vue.use(VueRouter)

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
    path: '/supervisor_list',
    name: 'supervisor_list',
    component: SupervisorListView
  },
  {
    path: '/supervisor_form/:id',
    name: 'supervisor_form',
    component: SupervisorFormView
  },
  {
    path: '/add_supervisor',
    name: 'add_supervisor',
    component: SupervisorAddView
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