<template>
  <v-container>
    <h2 class="my-2 d-flex justify-center" style="flex-grow: 1">
      Changer l'adresse courriel
    </h2>

    <v-form ref="emailForm">
      <v-card :loading="loading">
        <v-card-text>
          <!-- Alerts -->
          <v-alert v-model="success" dense text type="success" dismissible>
            Un lien de vérification a été envoyé à votre nouvelle adresse
            courriel pour confirmer le changement de l'adresse du compte.
          </v-alert>

          <v-alert v-model="error" dense text type="error" dismissible>
            L'adresse courriel entrée dans le premier champ doit être la même
            que celle dans le champ de confirmation du courriel.
          </v-alert>

          <!-- Informative text -->
          <div class="d-flex align-items-center mb-3">
            <v-icon class="me-3"> mdi-information </v-icon>
            <p class="black--text ma-0">
              Veuillez rentrer la nouvelle adresse courriel qui sera associée à
              ce compte. Un courriel contenant un lien de vérification sera
              envoyé à cette adresse et une fois le lien cliqué, l'adresse
              associée au compte sera modifiée.
            </p>
          </div>

          <!-- Modify email form -->
          <v-text-field
            v-model="email"
            :rules="rules"
            label="E-mail"
            required
          />
          <v-text-field
            v-model="emailConfirm"
            :rules="rules"
            label="Confirmation de l'e-mail"
            required
          />
        </v-card-text>

        <!-- Submit button -->
        <v-card-actions>
          <v-btn color="primary" block @click="changeEmail">
            Modifier l'adresse courriel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import API from "../api";

export default {
  name: "supervisor_email",
  data() {
    return {
      success: false,
      error: false,
      loading: false,
      email: "",
      emailConfirm: "",
      rules: [
        (v) => !!v || "Champ obligatoire",
        (v) => /.+@.+\..+/.test(v) || "L'adresse courriel doit être valide",
      ],
    };
  },
  methods: {
    async changeEmail() {
      // Verify form
      if (!this.$refs.emailForm.validate()) return;

      // Verify that email and confirmation field have same value
      if (this.email !== this.emailConfirm) {
        this.error = true;
        return;
      }

      // Modify email
      this.loading = true;
      const { id } = JSON.parse(sessionStorage.getItem("authentication")).user;
      await API.updateSupervisorEmailAddress(id, this.email);
      this.error = false;
      this.success = true;
      this.loading = false;
    },
  },
};
</script>
