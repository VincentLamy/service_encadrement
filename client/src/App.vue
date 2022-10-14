<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item v-for="(responsable, i) in responsable" :key="i">
        <v-list-item-content>
          <v-list-item-title class="text-h6 blue--text text--darken-3" v-text="responsable.name"></v-list-item-title>
          <v-list-item-subtitle v-text="responsable.programme"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group color="primary">
          <v-list-item v-if="item.info" v-for="(item, i) in items" :key="i" :to="item.link" link>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="blue--text text--darken-3" v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title fluid style="width: 100%" class="text-center blue--text text--darken-3">Service d'encadrement</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  const dev = {
    "liste_etudiants": true,
    "liste_responsables": true,
    "csv": true,
  }

  const admin = {
    "liste_etudiants": false,
    "liste_responsables": true,
    "csv": false,
  }

  const responsable = {
    "liste_etudiants": true,
    "liste_responsables": false,
    "csv": true,
  }

  const current = dev;

  export default {
    data: () => ({
      drawer: null,
      items: [
        { title: 'Liste des étudiants',     icon: 'mdi-account-multiple', link: "/student_list", info: current.liste_etudiants },
        { title: 'Liste des responsables',  icon: 'mdi-account-multiple', link: "/supervisor_list", info: current.liste_responsables },
        { title: 'Importer un fichier CSV', icon: 'mdi-attachment', link: "/csv_import", info: current.csv },
      ],
      responsable: [
        { name: "Vincent Lamy", programme: "Programmation" } // TODO Modifier pour aller chercher les données dans la BD
      ]
    }),
  }
</script>

<style>
  @import './assets/styles/style.css';
</style>