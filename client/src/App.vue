<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-if="what_page(this.$route.name)"
      v-model="drawer"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="text-h6 blue--text text--darken-3"
            v-text="name"
          ></v-list-item-title>
          <v-list-item-subtitle v-text="programme"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            v-if="canAccess(item.link)"
            :to="item.link"
            link
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                class="blue--text text--darken-3"
                v-text="item.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="what_page(this.$route.name)"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title
        fluid
        style="width: 100%"
        class="text-center blue--text text--darken-3"
        >Service d'encadrement</v-toolbar-title
      >

      <v-btn
        v-if="what_page(this.$route.name)"
        id="disconnect_button"
        @click="logout()"
        >Déconnexion</v-btn
      >
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,

    items: [
      {
        title: "Liste des étudiants",
        icon: "mdi-account-multiple",
        link: "/student_list",
      },
      {
        title: "Liste des responsables",
        icon: "mdi-account-multiple",
        link: "/supervisor_list",
      },
      { title: "Liste des cours", icon: "mdi-school", link: "/course_list" },
      {
        title: "Importer un fichier CSV",
        icon: "mdi-attachment",
        link: "/import",
      },
    ],

    name: "",
    programme: "Programmation",
  }),
  updated() {
    let authentication;

    // Si nous avons une variable de session
    if (sessionStorage.getItem("authentication")) {
      // Va chercher les données sur l'utilisateur
      authentication = JSON.parse(
        sessionStorage.getItem("authentication")
      ).user;

      // Si ça a fonctionné
      if (authentication) {
        // Modifie le nom
        this.name =
          authentication.employe.prenom + " " + authentication.employe.nom;

        // Modifie le programme
        // TODO this.programme = authentication.departement;
      }
    }
  },
  methods: {
    /**
     * Déconnecte l'utilisateur et efface toutes les données enregistrées sur lui.
     */
    logout() {
      // Si aucune variable de session existe
      if (!sessionStorage.getItem("authentication"))
        // Quitte
        return;

      // Renvoie l'utilisateur à la page de connexion.
      this.$router.push("/");

      // Efface toutes les variables de session.
      sessionStorage.clear();

      // Efface le nom et le programme de l'utilisateur de l'interface.
      this.name = "";
      this.programme = "";
    },

    /**
     * Vérifie sur quelle page l'utilisateur se situe.
     *
     * @param {string} page - Le nom de la page.
     */
    what_page(page) {
      switch (page) {
        case "login":
        case "recover":
        case "password_modif":
          return false;
        default:
          return true;
      }
    },

    /**
     * Vérifie si l'utilisateur à accès à la page.
     *
     * @param {link} link - Lien de la page.
     */
    canAccess(link) {
      let user, // Données sur l'utilisateur.
        type; // Type d'utilisateur

      if (sessionStorage.getItem("authentication")) {
        user = JSON.parse(sessionStorage.getItem("authentication")).user;
        if (user) type = user.type_utilisateur.nom;
      }

      switch (type) {
        case "Administrateur":
          return true;
        case "Responsable":
          const accessRights = {
            "/student_list": true,
            "/supervisor_list": false,
            "/course_list": false,
            "/import": true,
            "/supervisor_email": false,
          };
          return accessRights[link];
        default:
          return false;
      }
    },
  },
};
</script>

<style>
@import "./assets/styles/style.css";
</style>
