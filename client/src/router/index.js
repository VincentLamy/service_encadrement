import Vue from "vue";
import VueRouter from "vue-router";


// Authentification
import LoginView from "../views/LoginView.vue";                                   // Formulaire de connexion
import RecoverPasswordAccessView from "../views/RecoverPasswordAccessView.vue";   // Entrée du courriel pour 

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
  { path: "/recover",
    name: "recover",
    component: RecoverPasswordAccessView
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name == "recover") {
    next();
  } else if (to.name !== "login" && !sessionStorage.getItem("authentication"))
    next({ name: "login" });
  else 
    next();
});

export default router;
