<template>
  <v-container class="d-flex justify-center align-center" style="height: 100%;">
    <v-card :loading="loading" style="min-width: 400px; width: 50%;">
      <v-card-text v-if="loading">
        <h2 class="my-2">Configuration du nouveau compte administrateur...</h2>
      </v-card-text>
      <v-card-text v-else-if="!error">
        <h2 class="my-2">Vous êtes devenu administrateur de la plateforme!</h2>
        <p>
          Vous avez maintenant accès à la liste complète des comptes responsables de l'application web
          ainsi qu'à la liste de tous les cours.
        </p>
        <v-btn block href="/" color="primary">
          Retourner à la page de connexion
        </v-btn>
      </v-card-text>
      <v-card-text v-else>
        <h2 class="my-2">Une erreur est survenue...</h2>
        <p>
          Vérifiez que vous aillez bien copié le lien dans la barre de chercher sans l'avoir modifier.
          Si l'erreur persiste, veuillez contacter l'administrateur pour qu'il recrée une nouvelle
          requête de changement d'administrateur.
        </p>
        <v-btn block href="/" color="primary">
          Retourner à la page de connexion
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import API from "@/api";

export default {
  name: "ChangeAdmin",
  data() {
    return {
      loading: true,
      error: false,
    };
  },
  async created() {
    const response = await API.makeSupervisorAdmin(this.$route.params.token);
    this.loading = false;
    this.error = response.code !== undefined;
  },
};
</script>
