<template>
  <v-container fluid fill-height> <!-- v-if="sameToken()" -->
    <v-alert
      id="resetPassword_alert"
      close-text="Close Alert"
      :color="colorAlert"
      text
      dark
    >
    </v-alert>

    <v-card id="resetPasswordForm" class="px-4">
      <v-card-text>
        <v-form ref="resetPasswordForm" v-model="valid" lazy-validation>
          <v-row>
            
            <v-col cols="12">
              <v-text-field 
                label="Password" 
                v-model="password" 
                :rules="passwordRules" 
                type="password" 
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <v-text-field 
                label="Confirm Password"
                v-model="confirmPassword" 
                :rules="confirmPasswordRules.concat(passwordConfirmationRule)" 
                type="password" 
                required
              ></v-text-field>
            </v-col>
            
            <v-col class="d-flex" cols="12" sm="6" xsm="12" align-end>
              <v-btn
                x-large
                block
                :disabled="!valid"
                color="success"
                @click="validate"
              >Confirmer</v-btn>
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
  data: () => ({
    valid: true,
    colorAlert: "",
    password: "",
    confirmPassword: "",
    passwordRules: [v => !!v || "Le mot de passe est requis"],  
    confirmPasswordRules: [v => !!v || "Le mot de passe est requis"]
  }),
  methods: {
    async validate() {
      if (this.$refs.resetPasswordForm.validate()) {
        const response = await API.password_modif(this.$route.params.type, this.$route.params.token, this.password);
        let alert = document.getElementById("resetPassword_alert");

        console.log(response)

        if (response.message == 1 && response.type == "reset") {
          this.colorAlert = "green accent-4 green--text";
          alert.innerHTML = "Votre mot de passe a bien été réinitialiser, vous pouvez vous connecter.";
        } else if (response.message == 1 && response.type == "activate") {
          this.colorAlert = "green accent-4 green--text";
          alert.innerHTML = "Votre compte a été activé, vous pouvez vous connecter.";
        } else {
          this.colorAlert = "red accent-4 red--text";
          alert.innerHTML = "Une erreur s\'est produite. Veuillez réessayer";
        } 
          
        alert.style.visibility = "visible";

        setTimeout(() => {
          document.getElementById("resetPassword_alert").style.visibility = "hidden";
          this.$router.push("/");
        }, 3000);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    //TODO vérifier que le token soit valide.
    // sameToken() {
    //   this.$route.params.token
    // }
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.confirmPassword || "Password must match";
    }
  }
}
</script>