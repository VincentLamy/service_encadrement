/********************************/
/* Importation                  */
/********************************/

// Vue3
import Vue                        from "vue";
import VueRouter                  from "vue-router";

// Authentification
import LoginView                  from "../views/LoginView.vue";                    // Formulaire de connexion
import RecoverPasswordAccessView  from "../views/RecoverPasswordAccessView.vue";    // Entrée du courriel pour 
import ResetPasswordView          from "../views/ResetPasswordView.vue";            // Entrée du courriel pour 

// Importation des données
import ImportView              from "../views/ImportView";                          // Importation et exportation des fichiers CSV et XLSX

// Étudiants
import StudentListView            from "../views/StudentListView";                  // Liste des étudiants
import StudentFormView            from "../views/StudentFormView";                  // Fiche des étudiants
import CourseListView             from "../views/CourseListView";                   // Liste des cours

// Responsables
import SupervisorListView         from "../views/SupervisorListView";               // Liste des responsables
import SupervisorFormView         from "../views/SupervisorFormView";               // Fiche des responsables
import SupervisorAddView          from "../views/SupervisorAddView";                // Formulaire d'ajout d'un responsable
import ChangeAdmin                from "../views/ChangeAdminView";                  // Changer le responsable avec les droits admin



/********************************/
/* Création du routeur          */
/********************************/

Vue.use(VueRouter);

const routes = [
      // Chemin d'accès                     // Nom de la route          // Page qui sera affiché
    { path: "/",                            name: "login",              component: LoginView,                 },    // Connexion
    { path: "/import",                      name: "import",             component: ImportView,                },    // Importation des données
    { path: "/student_list",                name: "student_list",       component: StudentListView,           },    // Liste des étudiants
    { path: "/student_form/:id",            name: "student_form",       component: StudentFormView,           },    // Fiche des étudiants
    { path: "/supervisor_list",             name: "supervisor_list",    component: SupervisorListView,        },    // Liste des responsables
    { path: "/supervisor_form/:id",         name: "supervisor_form",    component: SupervisorFormView,        },    // Fiche des responsables
    { path: "/add_supervisor",              name: "add_supervisor",     component: SupervisorAddView,         },    // Formulaire d'ajout d'un responsable
    { path: "/course_list",                 name: "course_list",        component: CourseListView,            },    // Liste des cours
    { path: "/recover_password",            name: "recover",            component: RecoverPasswordAccessView  },    // Demande pour réinitialiser son mot de passe
    { path: "/password_modif/:type/:token", name: "password_modif",     component: ResetPasswordView          },    // Réinitialisation du mot de passe
    { path: "/admin_modif/:token",          name: "admin_modif",        component: ChangeAdmin                },    // Changer l'utilisateur avec le rôle d'admin
];

// Création d'un routeur
const router = new VueRouter({
    mode: "history",            // Permet de naviguer entre les pages sans devoir recharger le navigateur
    base: process.env.BASE_URL, // URL du site 
    routes,                     // Routes qui seront utilisés
});

/**
 * Vérifie si l'utilisateur à la permission d'accéder la page souhaité.
 * 
 * @param {string} nom Nom de la route de la page que l'utilisateur veut voir
 * @returns un booléen
 */
function hasPermissionsNeeded(nom) {
    if (nom == "login")                                 // Si la page visée est la page de connexion
        return true;                                    // Autorise le passage

    if (sessionStorage.getItem("authentication"))       // Si l'utilisateur est connecté
        if (JSON.parse(sessionStorage.getItem("authentication")).user.type_utilisateur.nom != "Administrateur") { // Si l'utilisateur n'est pas un administrateur
            switch(nom) {
                case "supervisor_list": return false;   // Empêche la connexion à la page à la page de la liste des responsables
                case "supervisor_form": return false;   // Empêche la connexion à la page à la page de la fiche des responsables
                case "add_supervisor":  return false;   // Empêche la connexion à la page à la page du formulaire d'ajout d'un responsable
                case "course_list":     return false;   // Empêche la connexion à la page à la page de la liste des cours
                default:                return true;    // Si aucun de ces noms, retourne autorise le passage
            }
        }
        else {
            return true;                                // Autorise le passage
        }                           
    return false;                                       // Refuse le passage
}

// Avant chaque changement de route.
router.beforeEach((to, from, next) => {
    if (to.name == "recover" || to.name == "password_modif" || to.name == "admin_modif") // Si la route fait référence à une route pour modifier le mot de passe
        next();                                                                 // Autorise le passage et envoie vers la page visée

    else if (!sessionStorage.getItem("authentication") && to.name !== "login")  // Si l'utilisateur n'est pas connecté et que la page visée n'est pas la page de connexion
        next({ name: "login" });                                                // Redirige l'utilisateur vers la page de connexion

    else {

        if (!hasPermissionsNeeded(to.name))                                     // Si l'utilisateur n'a pas les permission de se rendre à la page visée
            next(false);                                                        // Refuse le passage et redirige vers la page précédente

        else
            next();                                                             // Autorise le passage et envoie vers la page visée
    }
});

export default router;  // Utilise le routeur comme routeur par défaut