<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Hello World
          </v-list-item-title>
          <v-list-item-subtitle>
            Philippe Lacasse
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            Steve Jr Dion
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            Vincent Simard-Schmidt
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            Vincent Lamy
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!--  -->
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ drawer: null }),
  }
</script>