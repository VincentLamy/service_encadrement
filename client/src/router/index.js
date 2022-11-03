import Vue from 'vue'
import VueRouter from 'vue-router'
import DatetimePicker from 'vuetify-datetime-picker'
import LoginView from '../views/LoginView.vue'
import CSVImportView from '../views/CSVImportView.vue'
import StudentListView from '../views/StudentListView.vue'
import StudentFormView from '../views/StudentFormView.vue'

Vue.use(VueRouter)
Vue.use(DatetimePicker)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  // {
  //   path: '/recoverPassword',
  //   name: 'recoverPassword',
  //   component: RecoverPasswordView,
  // },
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