<template>
  <v-container>
    <h2 class="my-2 d-flex justify-center blue--text text--darken-3">
      {{ supervisor.employe.prenom }} {{ supervisor.employe.nom }}
    </h2>

    <!--
    ************************************************
    Supervisor information
    ************************************************ 
    -->

    <v-form ref="form" @submit.prevent="updateForm" class="pa-5" enctype="multipart/form-data">
      <v-card class="py-2 px-3 mb-5" outlined>
        <v-card-text>
          <h3 class="d-flex justify-center mb-4">Informations du responsable</h3>
          <v-row no-gutters>
            <!-- Courriel -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field id="courriel_input" label="Courriel" :value="supervisor.courriel" :rules="rules" outlined />
            </v-col>
            <!-- Prénom -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field id="prenom_input" label="Prénom" :value="supervisor.employe.prenom" :rules="rules"
                outlined />
            </v-col>
          </v-row>

          <!-- New row -->
          <v-row no-gutters>
            <!-- Nom -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field id="nom_input" label="Nom" :value="supervisor.employe.nom" :rules="rules" outlined />
            </v-col>
            <!-- Date d'activation -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field label="Date d'activation" :value="date_activation" outlined readonly />
            </v-col>
          </v-row>

          <!-- New row -->
          <v-row no-gutters>
            <!-- Date de désactivation -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field label="Date de désactivation" :value="date_desactivation" outlined readonly />
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions class="px-5 d-flex justify-space-between">
          <!-- Activate toggle -->
          <v-switch id="actif" v-model="activation_switch" inset
            :label="`${activation_switch ? 'Le responsable est activé' : 'Le responsable est désactivé'}`"></v-switch>

          <!-- Update -->
          <v-btn type="submit" color="primary">Mettre à jour</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import API from "@/api";

export default {
  name: "FicheSuperviseur",
  data() {
    return {
      supervisor: {},
      date_activation: null,
      date_desactivation: null,
      show: false,
      rules: [(value) => !!value || "Ce champs ne peut pas être vide."],
      activation_switch: true,
    };
  },
  methods: {
    async updateForm(event) {
      const formData = new FormData();
      formData.append('courriel', document.getElementById("courriel_input").value);
      formData.append('prenom', document.getElementById("prenom_input").value);
      formData.append('nom', document.getElementById("nom_input").value);
      formData.append('actif', document.getElementById("actif").ariaChecked);

      if (this.$refs.form.validate()) {
        const response = await API.updateSupervisorFormInfo(this.supervisor.id, formData);
      }
    },
  },
  async created() {
    // Get student info
    this.supervisor = await API.getSupervisorFormInfo(this.$route.params.id);
    this.activation_switch = this.supervisor.actif;

    // Format date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    this.date_activation = new Date(this.supervisor.date_activation);
    this.date_activation.setDate(this.date_activation.getDate() + 1);
    this.date_activation = this.date_activation.toLocaleDateString("fr-CA", options);

    this.date_desactivation = new Date(this.supervisor.date_desactivation);
    this.date_desactivation.setDate(this.date_desactivation.getDate() + 1);
    this.date_desactivation = this.date_desactivation.toLocaleDateString("fr-CA", options);
  },
};
</script>