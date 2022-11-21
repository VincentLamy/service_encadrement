<template>
    <v-container fluid fill-height>
        <v-alert
        id="recover_alert"
        close-text="Close Alert"
        :color="colorAlert"
        text
        dark
        >
        </v-alert>

        <v-card id="recoverForm" class="px-4">
        <v-card-text>
            <v-form ref="recoverForm" v-model="valid" lazy-validation>
            <v-row>
                <v-col cols="12">
                <v-text-field
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                    label="Courriel"
                    required
                ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6" xsm="12" align-end>
                <v-btn
                    large
                    block
                    :disabled="!valid"
                    @click="main_menu()"
                >Retour</v-btn>
                
                  <v-btn
                    large
                    block
                    :disabled="!valid"
                    color="success"
                    @click="validate()"
                >Envoyer</v-btn>
                </v-col>
            </v-row>
            </v-form>
        </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import API from "@/api";

export default {
  name: "RecoverPassword",
  data: () => ({
    valid: true,
    
    email: "",
    colorAlert: "",

    rules: {
      required: (value) => !!value || "Champ obligatoire.",
      email: (value) => /.+@.+\..+/.test(value) || "L'adresse courriel doit être valide.",
    },
  }),
  methods: {
    async main_menu() {
      this.$router.push("/");
    },
    async validate() {
      if (this.$refs.recoverForm.validate()) {

        const email_send = await API.recover_password(this.email);
        let alert        = document.getElementById("recover_alert");

        if (!email_send) {
          this.colorAlert = "red accent-4 red--text";
          alert.innerHTML = "Le courriel est invalide!";
        } else {
          this.colorAlert = "green accent-4 green--text";
          alert.innerHTML = "Un courriel a été envoyé à l'adresse précisée précédemment!"
        }

        alert.style.visibility = "visible";

        setTimeout(() => {
          alert.style.visibility = "hidden";
        }, 3000);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

