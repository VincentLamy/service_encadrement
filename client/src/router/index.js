import Vue from "vue";
import VueRouter from "vue-router";


// Authentification
import LoginView from "../views/LoginView.vue";                                   // Formulaire de connexion
import RecoverPasswordAccessView from "../views/RecoverPasswordAccessView.vue";   // Entrée du courriel pour 
import ResetPasswordView from "../views/ResetPasswordView.vue";                   // Entrée du courriel pour 

// Importation des données
import CSVImportView from "../views/CSVImportView";                               // Importation et exportation des fichiers CSV et XLSX

// Étudiants
import StudentListView from "../views/StudentListView";                           // Liste des étudiants
import StudentFormView from "../views/StudentFormView";                           // Fiche des étudiants
import CourseListView from "../views/CourseListView";                             // Liste des cours

// Responsables
import SupervisorFormView from "../views/SupervisorFormView";
import SupervisorListView from "../views/SupervisorListView";
import SupervisorAddView from "../views/SupervisorAddView";
import SupervisorEmail from "../views/SupervisorEmailView";


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
    path: "/supervisor_email",
    name: "supervisor_email",
    component: SupervisorEmail
  },
  {
    path: "/course_list",
    name: "course_list",
    component: CourseListView,
  },
  { path: "/recover",
    name: "recover",
    component: RecoverPasswordAccessView
  },
  {
    path: "/reset_password/:token",
    name: "reset_password",
    component: ResetPasswordView
  }
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
    case "supervisor_email":
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
  if (to.name == "recover" || to.name == "reset_password")
    next();
  else if (!isAuthenticated() && to.name !== "login")
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
