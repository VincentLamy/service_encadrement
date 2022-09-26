<template>

  <v-container>
    <v-col sm="8" class="mx-auto">
      <v-card class="pa-5">
        <v-card-title class="justify-center"> Ajouter un commentaire </v-card-title>

        <v-divider></v-divider>
        
        <v-form ref="comments" @submit.prevent="submitComments" class="pa-5" enctype="multipart/form-data">

          <v-row>

            <v-col class="d-flex" sm="6">
              <v-select :items="type" label="Type remarque"></v-select>
            </v-col>

            <v-col class="d-flex" sm="6">
              <v-select :items="remarque" label="Remarques" disabled></v-select>
            </v-col>

          </v-row>
      
          <v-row>
            <v-col sm="9">
              <v-textarea label="Commentaire"></v-textarea>
            </v-col>

            <v-col sm="3" align="center">
              <v-btn type="submit" class="my-9" color="error" depressed>Annuler</v-btn>
              <v-btn type="submit" color="primary" depressed> Publier</v-btn>
            </v-col>

          </v-row>
          
        
        </v-form>
      </v-card>
    </v-col>
  </v-container>

  
</template>

<script>
  export default {
    data: () => ({
      type: ['Remarques', 'Chance de réussite', 'Progression'], // Prendre info de la BD
      remarque: ['01 - Arrive souvent en retard', '02 - Dort en classe', 'AUTN'], // Prendre info de la BD
    }),
  }
</script>
  