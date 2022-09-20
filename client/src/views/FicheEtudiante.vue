<template>
  <v-container>
    <h1>Nom de l'étudiant</h1>

    <v-card>
      <!-- Formulaire pour modifier les informations de l'étudiant -->
      <v-card-text>
        <v-row>
          <!-- Numéro de dossier -->
          <v-col>
            <v-text-field label="No. de dossier"></v-text-field>
          </v-col>

          <!-- Code permanent -->
          <v-col>
            <v-text-field label="Code permanent"></v-text-field>
          </v-col>

          <!-- Service d'enseignement -->
          <v-col>
            <v-combobox label="Service d'enseignement"></v-combobox>
          </v-col>

          <!-- Numéro de programme -->
          <v-col>
            <v-combobox label="No. de programme"></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "FicheEtudiante",
};
</script>
