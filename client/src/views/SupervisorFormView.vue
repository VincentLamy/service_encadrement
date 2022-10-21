<template>
  <!--
    ************************************************
    Supervisor information
    ************************************************ 
  -->
  <v-container>
    <div style="display: flex">
      <!-- Previous -->
      <div class="d-flex" style="align-items: center;">
        <v-btn type="submit" outlined @click="gotoPreviousSupervisor()">Précédent</v-btn>
      </div>

      <!-- Form -->
      <v-form id="supervisor_form" ref="form" @submit.prevent="updateForm" class="pa-5 d-xl-flex"
        enctype="multipart/form-data" style="flex: 5;">
        <!-- Supervisor name -->
        <h2 class="my-2 d-flex justify-center blue--text text--darken-3">
          {{ supervisor.employe.prenom }} {{ supervisor.employe.nom }}
        </h2>

        <!-- Alert on modification -->
        <v-alert v-model="success" dense text type="success" dismissible>
          Le superviseur a été mis à jour avec succès!
        </v-alert>

        <v-card class="py-2 px-3 mb-5" outlined>
          <v-card-text>
            <h3 class="d-flex justify-center mb-4">Informations du responsable</h3>
            <v-row no-gutters>
              <!-- Courriel -->
              <v-col class="px-3" lg="6" sm="6" cols="12">
                <v-text-field id="courriel_input" label="Courriel" :value="supervisor.courriel" :rules="rules"
                  outlined />
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
              <!-- Date de création -->
              <v-col class="px-3" lg="6" sm="6" cols="12">
                <v-text-field id="date_activation_input" label="Date de création" :value="date_activation" outlined
                  readonly />
              </v-col>
            </v-row>

            <!-- New row -->
            <v-row no-gutters>
              <!-- Date de désactivation -->
              <v-col class="px-3" lg="6" sm="6" cols="12">
                <v-text-field id="date_desactivation_input" label="Date de désactivation" :value="date_desactivation"
                  outlined readonly />
              </v-col>
            </v-row>


            <v-card-actions class="px-5 d-flex justify-space-between">
              <!-- Activate toggle -->
              <v-switch id="actif" v-model="activation_switch" inset
                :label="`${activation_switch ? 'Le responsable est activé' : 'Le responsable est désactivé'}`">
              </v-switch>

              <!-- Update -->
              <v-btn type="submit" color="primary">Mettre à jour</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-form>

      <!-- Next -->
      <div class="d-flex" style="align-items: center;">
        <v-btn type="submit" outlined @click="gotoNextSupervisor()">Suivant</v-btn>
      </div>
    </div>
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
      success: false,
    };
  },
  methods: {
    async updateForm(event) {
      const formData = new FormData();
      formData.append('courriel', document.getElementById("courriel_input").value);
      formData.append('prenom', document.getElementById("prenom_input").value);
      formData.append('nom', document.getElementById("nom_input").value);
      formData.append('actif', document.getElementById("actif").ariaChecked);

      const switch_actif = document.getElementById("actif").ariaChecked;
      const supervisor_actif = this.supervisor.actif.toString();

      // If the activation switch has changed
      if (switch_actif != supervisor_actif) {
        // If the activation switch is now true
        if (document.getElementById("actif").ariaChecked === 'true') {
          formData.append('date_desactivation', document.getElementById("date_activation_input").value);
          this.date_desactivation = 'Non applicable';
        }
        // If the activation switch is now false
        else if (document.getElementById("actif").ariaChecked === 'false') {
          formData.append('date_desactivation', this.dateToString(Date.now()));
          this.date_desactivation = this.dateToString(Date.now());
        }
        this.supervisor.actif = !this.supervisor.actif;
        // If the activation switch hasn't changed
      } else {
        // Prevent problems if date desactivation is Non applicable
        if (document.getElementById("date_desactivation_input").value === 'Non applicable') {
          formData.append('date_desactivation', document.getElementById("date_activation_input").value);
        } else {
          formData.append('date_desactivation', document.getElementById("date_desactivation_input").value);
        }
        this.date_desactivation = document.getElementById("date_desactivation_input").value;
      }

      if (this.$refs.form.validate()) {
        const response = await API.updateSupervisorFormInfo(this.supervisor.id, formData);
        this.success = true;
      }
    },
    async gotoPreviousSupervisor() {
      // Get previous supervisor info
      const previousSupervisor = await API.getPreviousSupervisor(this.$route.params.id);
      this.supervisor = previousSupervisor[0];
      this.date_activation = this.dateToString(this.supervisor.date_activation);

      if (this.date_activation !== this.dateToString(this.supervisor.date_desactivation)) {
        this.date_desactivation = this.dateToString(this.supervisor.date_desactivation);
      } else {
        this.date_desactivation = 'Non applicable';
      }

      this.activation_switch = this.supervisor.actif;

      this.$router.push({ name: 'supervisor_form', params: { id: this.supervisor.id } });
    },
    async gotoNextSupervisor() {
      // Get next supervisor info
      const nextSupervisor = await API.getNextSupervisor(this.$route.params.id);
      this.supervisor = nextSupervisor[0];
      this.date_activation = this.dateToString(this.supervisor.date_activation);

      if (this.date_activation !== this.dateToString(this.supervisor.date_desactivation)) {
        this.date_desactivation = this.dateToString(this.supervisor.date_desactivation);
      } else {
        this.date_desactivation = 'Non applicable';
      }

      this.activation_switch = this.supervisor.actif;

      this.$router.push({ name: 'supervisor_form', params: { id: this.supervisor.id } });
    },
    dateToString(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };

      let dateToDate = new Date(date);
      dateToDate.setDate(dateToDate.getDate());
      dateToDate = dateToDate.toLocaleString("fr-CA", options);

      return dateToDate;
    },
  },
  async created() {
    // Get supervisor info
    this.supervisor = await API.getSupervisorFormInfo(this.$route.params.id);
    this.activation_switch = this.supervisor.actif;

    this.date_activation = this.dateToString(this.supervisor.date_activation);

    if (this.date_activation !== this.dateToString(this.supervisor.date_desactivation)) {
      this.date_desactivation = this.dateToString(this.supervisor.date_desactivation);
    } else {
      this.date_desactivation = 'Non applicable';
    }
  },
};
</script>