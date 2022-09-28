import Vue from 'vue'
import VueRouter from 'vue-router'
import DatetimePicker from 'vuetify-datetime-picker'
import HomeView from '../views/HomeView.vue'
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
    path: '/student_list',
    name: 'student_list',
    component: StudentListView
  },
  {
    
    path: '/student_form/:id',
    name: 'student_form',
    component: StudentFormView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
