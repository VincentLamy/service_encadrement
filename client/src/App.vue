<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item v-for="(responsable, i) in responsable" :key="i">
        <v-list-item-content>
          <v-list-item-title class="text-h6" v-text="responsable.name"></v-list-item-title>
          <v-list-item-subtitle v-text="responsable.programme"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.link" link>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title fluid style="width: 100%" class="text-center">Service d'encadrement</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!--  -->
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      items: [
        { text: 'Liste des étudiants',    icon: 'mdi-account-multiple', link: "/student_list" },
        { text: 'Liste des responsables', icon: 'mdi-account-multiple', link: "/user_list" },
      ],
      responsable: [
        { name: "Vincent Lamy", programme: "Programmation"} // TODO Modifier pour aller chercher les données dans la BD
      ]
    }),
  }
</script>