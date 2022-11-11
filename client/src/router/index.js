import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import CSVImportView from "../views/CSVImportView";
import StudentListView from "../views/StudentListView";
import StudentFormView from "../views/StudentFormView";

import SupervisorFormView from "../views/SupervisorFormView";
import SupervisorListView from "../views/SupervisorListView";
import SupervisorAddView from "../views/SupervisorAddView";

import CourseListView from "../views/CourseListView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/csv_import",
    name: "csv-import",
    component: CSVImportView,
  },
  {
    path: "/student_list",
    name: "student_list",
    component: StudentListView,
  },
  {
    path: "/student_form/:id",
    name: "student_form",
    component: StudentFormView,
  },
  {
    path: "/supervisor_list",
    name: "supervisor_list",
    component: SupervisorListView,
  },
  {
    path: "/supervisor_form/:id",
    name: "supervisor_form",
    component: SupervisorFormView,
  },
  {
    path: "/add_supervisor",
    name: "add_supervisor",
    component: SupervisorAddView,
  },
  {
    path: "/course_list",
    name: "course_list",
    component: CourseListView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && !sessionStorage.getItem("authentication"))
    next({ name: "login" });
  else next();
});

export default router;
