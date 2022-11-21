<template>
    <v-container>
        <h2 class="my-2 d-flex justify-center blue--text text--darken-3">
            Création d'un responsable
          </h2>
          <v-form ref="form" @submit.prevent="submitForm" class="pa-5" enctype="multipart/form-data">
            <v-card class="py-2 px-3 mb-5 mx-auto" outlined max-width="50%">

                  <!-- Prénom -->
                  <v-col class="px-3" lg="12" sm="12" cols="12">
                    <v-text-field id="prenom_input" label="Prénom" :rules="[rules.required]"
                      outlined />
                  </v-col>
                
                  <!-- Nom -->
                  <v-col class="px-3" lg="12" sm="12" cols="12">
                    <v-text-field id="nom_input" label="Nom" :rules="[rules.required]" outlined />
                  </v-col>

                  <!-- Courriel -->
                  <v-col class="px-3" lg="12" sm="12" cols="12">
                    <v-text-field id="courriel_input" label="Courriel" :rules="[rules.required, rules.email]" outlined />
                  </v-col>
            
                <!-- Create -->
                <v-btn block type="submit" color="primary">Créer</v-btn>
        
            </v-card>
          </v-form>
    </v-container>
  
  </template>

  <script>
import API from '../api';

    export default {
        data() {
            return{
                rules: {
                  required: (v) => !!v               || "Champ obligatoire.",
                  email:    (v) => /.+@cegepsherbrooke\.qc\.ca$/.test(v)       || "L'adresse courriel doit être valide.",
                },
            };
        },
        methods: {
            async submitForm(){
                const formData = new FormData();
                formData.append('courriel', document.getElementById("courriel_input").value);
                formData.append('prenom', document.getElementById("prenom_input").value);
                formData.append('nom', document.getElementById("nom_input").value);

                if(this.$refs.form.validate()) {
                    const response = await API.addSupervisor(formData);
                    this.$router.push({name : 'supervisor_list', params: {message : response.message }});
                }
            },
        },
    };
</script>