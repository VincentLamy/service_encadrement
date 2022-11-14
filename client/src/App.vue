<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-if="this.$route.name !== 'login'"
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
            v-if="canAccess(i)"
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
        v-if="this.$route.name !== 'login'"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title
        fluid
        style="width: 100%"
        class="text-center blue--text text--darken-3"
        >Service d'encadrement</v-toolbar-title
      >

      <v-btn
        v-if="this.$route.name !== 'login'"
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
      {
        title: "Liste des cours",
        icon: "mdi-school",
        link: "/course_list",
      },
      {
        title: "Importer un fichier CSV",
        icon: "mdi-attachment",
        link: "/csv_import",
      },
    ],
    name: "",
    programme: "Programmation",
  }),
  updated() {
    const authentication = JSON.parse(sessionStorage.getItem("authentication")).user;

    if (authentication) {
      this.name =
        authentication.employe.prenom +
        " " +
        authentication.employe.nom;
        
      // this.programme = auth.departement;
    }
  },
  methods: {
    logout() {
      if (sessionStorage.getItem("authentication")) {
        this.$router.push("/");
        sessionStorage.clear();
        this.name = "";
      }
    },
    canAccess(link) {
      let type = JSON.parse(sessionStorage.getItem("authentication")).user;

      if (type) type = type.type_utilisateur.nom;

      if (type == "Administrateur") {
        switch (link) {
          case 0: // student_list
            return false;
          case 1: // supervisor_list
            return true;
          case 2: // course_list
            return true;
          case 3: // csv_import
            return true;
          default:
            break;
        }
      } else if (type == "Responsable") {
        switch (link) {
          case 0: // student_list
            return true;
          case 1: // supervisor_list
            return false;
          case 2: // course_list
            return false;
          case 3: // csv_import
            return true;
          default:
            break;
        }
      } else if (type == "Dev") {
        switch (link) {
          case 0: // student_list
            return true;
          case 1: // supervisor_list
            return true;
          case 2: // course_list
            return true;
          case 3: // csv_import
            return true;
          default:
            break;
        }
      }
    },
  },
};
</script>

<style>
@import "./assets/styles/style.css";
</style>
