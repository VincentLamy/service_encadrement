<template>
  <!--
    ************************************************
    Supervisor information
    ************************************************ 
  -->
  <v-container>
    <div style="display: flex">
      <!-- Previous -->
      <div class="d-flex" style="align-items: center">
        <v-btn
          type="submit"
          outlined
          @click="gotoPreviousSupervisor()"
          :loading="loading"
          >Précédent</v-btn
        >
      </div>

      <!-- Supervisor name -->
      <h2
        class="my-2 d-flex justify-center blue--text text--darken-3"
        style="flex-grow: 1"
      >
        {{ supervisor.employe.prenom }} {{ supervisor.employe.nom }}
      </h2>

      <!-- Next -->
      <div class="d-flex" style="align-items: center">
        <v-btn
          type="submit"
          outlined
          @click="gotoNextSupervisor()"
          :loading="loading"
          >Suivant</v-btn
        >
      </div>
    </div>

    <!-- Form -->
    <v-form
      id="supervisor_form"
      ref="form"
      @submit.prevent="updateForm"
      enctype="multipart/form-data"
    >
      <!-- Alert on modification -->
      <v-alert v-model="success" dense text type="success" dismissible>
        Le superviseur a été mis à jour avec succès!
      </v-alert>

      <v-card class="py-2 px-3 mb-5" outlined>
        <v-card-text>
          <h3 class="d-flex justify-center mb-4">
            Informations du responsable
          </h3>

          <!-- New row -->
          <v-row no-gutters>
            <!-- Courriel -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field
                id="courriel_input"
                label="Courriel"
                :value="supervisor.courriel"
                :rules="[rules.required, rules.email]"
                outlined
              />
            </v-col>

            <!-- Sessions -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-select
                v-model="sessions_selected"
                :items="sessions"
                label="Sessions du responsable"
                multiple
                outlined
                @input="sortSelection"
              />
            </v-col>
          </v-row>

          <!-- New row -->
          <v-row no-gutters>
            <!-- Prénom -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field
                id="prenom_input"
                label="Prénom"
                :value="supervisor.employe.prenom"
                :rules="[rules.required]"
                outlined
              />
            </v-col>
            <!-- Nom -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field
                id="nom_input"
                label="Nom"
                :value="supervisor.employe.nom"
                :rules="[rules.required]"
                outlined
              />
            </v-col>
          </v-row>

          <!-- New row -->
          <v-row no-gutters>
            <!-- Date d'activation -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field
                id="date_activation_input"
                label="Date d'activation"
                :value="date_activation"
                outlined
                readonly
              />
            </v-col>
            <!-- Date de désactivation -->
            <v-col class="px-3" lg="6" sm="6" cols="12">
              <v-text-field
                id="date_desactivation_input"
                label="Date de désactivation"
                :value="date_desactivation"
                outlined
                readonly
              />
            </v-col>
          </v-row>

          <v-card-actions class="px-5 d-flex justify-space-between">
            <!-- Activate toggle -->
            <v-switch
              id="actif"
              v-model="activation_switch"
              inset
              :label="`${
                activation_switch
                  ? 'Le responsable est activé'
                  : 'Le responsable est désactivé'
              }`"
            >
            </v-switch>

            <!-- Update -->
            <div>
              <v-btn @click="makeAdmin" class="me-4">Léguer les droits administratifs</v-btn>
              <v-btn type="submit" color="primary">Mettre à jour</v-btn>
            </div>
          </v-card-actions>
        </v-card-text>
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
      supervisor: {
        employe: {},
      },
      date_activation: null,
      date_desactivation: null,
      show: false,
      rules: {
        required: (v) => !!v || "Champ obligatoire.",
        email: (v) =>
          /.+@cegepsherbrooke\.qc\.ca$/.test(v) ||
          "L'adresse courriel doit être valide.",
      },
      //rules: [(value) => !!value || "Ce champs ne peut pas être vide."],
      activation_switch: true,
      success: false,
      loading: false,
      sessions: [1, 2, 3, 4, 5, 6],
      sessions_selected: null,
    };
  },
  methods: {
    async updateForm(event) {
      const formData = new FormData();
      formData.append(
        "courriel",
        document.getElementById("courriel_input").value
      );
      formData.append("prenom", document.getElementById("prenom_input").value);
      formData.append("nom", document.getElementById("nom_input").value);
      formData.append("actif", document.getElementById("actif").ariaChecked);

      const switch_actif = document.getElementById("actif").ariaChecked;
      const supervisor_actif = this.supervisor.actif.toString();

      const today = new Date();

      // If the activation switch has changed
      if (switch_actif != supervisor_actif) {
        // If the activation switch is now true
        if (document.getElementById("actif").ariaChecked === "true") {
          formData.append(
            "date_desactivation",
            this.supervisor.date_activation
          );
          this.date_desactivation = "Non applicable";

          this.date_activation = this.dateToString(
            this.supervisor.date_activation
          );
        }
        // If the activation switch is now false
        else if (document.getElementById("actif").ariaChecked === "false") {
          this.supervisor.date_desactivation = today;

          formData.append(
            "date_desactivation",
            this.supervisor.date_desactivation
          );
          this.date_desactivation = this.dateToString(
            this.supervisor.date_desactivation
          );
        }
        this.supervisor.actif = !this.supervisor.actif;
        // If the activation switch hasn't changed
      } else {
        formData.append(
          "date_desactivation",
          this.supervisor.date_desactivation
        );
      }

      // Sessions
      formData.append("sessions", String(this.sessions_selected));

      if (this.$refs.form.validate()) {
        const response = await API.updateSupervisorFormInfo(
          this.supervisor.id,
          formData
        );
        if (response.code != "ERR_BAD_REQUEST") {
          this.success = true;
        }
      }
    },
    async gotoPreviousSupervisor() {
      // Get previous supervisor info
      this.loading = true;

      const previousSupervisor = await API.getPreviousSupervisor(
        this.supervisor.id
      );
      if (this.supervisor.id === previousSupervisor[0].id) {
        this.loading = false;
        this.success = false;
        return;
      }

      this.supervisor = previousSupervisor[0];
      this.activation_switch = this.supervisor.actif;

      // Sessions
      this.sessions_selected = this.supervisor.sessions.split(",").map(Number);

      this.date_activation = this.dateToString(this.supervisor.date_activation);
      if (
        this.supervisor.date_activation !== this.supervisor.date_desactivation
      ) {
        this.date_desactivation = this.dateToString(
          this.supervisor.date_desactivation
        );
      } else {
        if (
          this.supervisor.date_activation ===
            this.supervisor.date_desactivation &&
          this.supervisor.actif === false
        ) {
          this.date_activation = "Non applicable";
        }
        this.date_desactivation = "Non applicable";
      }

      await this.$router.push({
        name: "supervisor_form",
        params: { id: this.supervisor.id },
      });
      this.loading = false;
      this.success = false;
    },
    async gotoNextSupervisor() {
      // Get next supervisor info
      this.loading = true;

      const nextSupervisor = await API.getNextSupervisor(this.supervisor.id);
      if (this.supervisor.id === nextSupervisor[0].id) {
        this.loading = false;
        this.success = false;
        return;
      }

      this.supervisor = nextSupervisor[0];
      this.activation_switch = this.supervisor.actif;

      // Sessions
      this.sessions_selected = this.supervisor.sessions.split(",").map(Number);

      this.date_activation = this.dateToString(this.supervisor.date_activation);
      if (
        this.supervisor.date_activation !== this.supervisor.date_desactivation
      ) {
        this.date_desactivation = this.dateToString(
          this.supervisor.date_desactivation
        );
      } else {
        if (
          this.supervisor.date_activation ===
            this.supervisor.date_desactivation &&
          this.supervisor.actif === false
        ) {
          this.date_activation = "Non applicable";
        }
        this.date_desactivation = "Non applicable";
      }

      await this.$router.push({
        name: "supervisor_form",
        params: { id: this.supervisor.id },
      });
      this.loading = false;
      this.success = false;
    },

    dateToString(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };

      let dateToDate = new Date(date);
      dateToDate.setDate(dateToDate.getDate());
      dateToDate = dateToDate.toLocaleString("fr-CA", options);

      return dateToDate;
    },
    sortSelection() {
      this.sessions_selected.sort((x, y) => {
        return x - y;
      });
    },
    async makeAdmin() {
      const curr_user_id = JSON.parse(sessionStorage.getItem("authentication")).user.employe.no_employe;
      const selected_user_id = this.supervisor.id;

      // Switch administrative rights
      await API.sendEmailNewAdmin(curr_user_id, selected_user_id);

      // Logout
      this.$router.push("/");
      sessionStorage.clear();
      sessionStorage.setItem("logout_reason", "admin_switch");
    },
  },
  async created() {
    // Get supervisor info
    this.supervisor = await API.getSupervisorFormInfo(this.$route.params.id);
    this.activation_switch = this.supervisor.actif;

    this.date_activation = this.dateToString(this.supervisor.date_activation);

    // Sessions
    this.sessions_selected = this.supervisor.sessions.split(",").map(Number);

    if (
      this.supervisor.date_activation !== this.supervisor.date_desactivation
    ) {
      this.date_desactivation = this.dateToString(
        this.supervisor.date_desactivation
      );
    } else {
      if (
        this.supervisor.date_activation ===
          this.supervisor.date_desactivation &&
        this.supervisor.actif === false
      ) {
        this.date_activation = "Non applicable";
      }
      this.date_desactivation = "Non applicable";
    }
  },
};
</script>
