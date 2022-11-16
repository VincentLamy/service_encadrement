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

function isAuthenticated() {
  return sessionStorage.getItem("authentication");
}

function hasPermissionsNeeded(to) {
  if (to.name === "login") {
    return true;
  }

  let type;
  if  (sessionStorage.getItem("authentication") !== null) {
    type = JSON.parse(sessionStorage.getItem("authentication")).user.type_utilisateur.nom;
  } else {
    return false;
  }

  switch(to.name) {
    case "csv-import":
      return true;
    case "student_list":
    case "student_form":
      switch(type) {
        case "Administrateur":
          return false;
        case "Responsable":
          return true;
        case "Dev":
          return true;
      }
    case "supervisor_list":
    case "supervisor_form":
    case "add_supervisor":
    case "course_list":
      switch(type) {
        case "Administrateur":
          return true;
        case "Responsable":
          return false;
        case "Dev":
          return true;
      }
  }
}

router.beforeEach((to, from, next) => {
  if (!isAuthenticated() && to.name !== "login")
    next({ name: "login" });
  else {
    if (!hasPermissionsNeeded(to)) {
      next(false);
    } else {
    next();
    }
  }
});

export default router;
