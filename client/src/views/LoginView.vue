<template>
  <v-container fluid fill-height>
    <v-alert
      id="login_alert"
      close-text="Close Alert"
      color="red accent-4 red--text"
      type="error"
      text
      dark
    >
    </v-alert>

    <v-card id="loginForm" class="px-4">
      <v-card-text>
        <v-form ref="loginForm" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="loginEmail"
                :rules="[rules.required, rules.email]"
                label="Courriel"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="loginPassword"
                :append-icon="show1 ? 'eye' : 'eye-off'"
                :rules="[rules.required, rules.password]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Mot de passe"
                hint="Le mot de passe doit contenir au moins 8 caractères dont 1 majuscule, 1 minuscule, un nombre et un caractère spécial."
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6" xsm="12"> 
              <v-btn @click="password_forgot">Mot de passe oublié</v-btn>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6" xsm="12" align-end>
              <v-btn
                x-large
                block
                :disabled="!valid"
                color="success"
                @click="validate"
              >Login</v-btn>
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
  name: "Login",
  data: () => ({
    dialog: true,
    valid: true,

    loginEmail: "",
    loginPassword: "",
    
    show1: false,
    rules: {
      required: (v) => !!v                  || "Champ obligatoire.",
      email:    (v) => /.+@.+\..+/.test(v)  || "L'adresse courriel doit être valide.",
      password: (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || (v && v.length >= 8) || "Le mot de passe doit contenir au moins 8 caractères dont 1 majuscule, 1 minuscule, un nombre et un caractère spécial.",
    },
  }),
  beforeCreate() {
    if (sessionStorage.getItem("authentication")) {
      this.$router.push("/");
      sessionStorage.clear();
      this.name = "";
    }
  },
  methods: {
    async validate() {
      if (this.$refs.loginForm.validate()) {
        const response = await API.login(this.loginEmail, this.loginPassword);

        if (response.code === "ERR_BAD_REQUEST") {
          let alert = document.getElementById("login_alert");

          alert.innerHTML = "Le courriel ou le mot de passe est invalide!";
          alert.style.visibility = "visible";

          setTimeout(() => {
            document.getElementById("login_alert").style.visibility = "hidden";
          }, 3000);
        } else if (response.user.actif == 0) {
          let alert = document.getElementById("login_alert");

          alert.innerHTML =
            "Vous devez activez votre compte avant de pouvoir accéder au contenu du site!";
          alert.style.visibility = "visible";

          setTimeout(() => {
            document.getElementById("login_alert").style.visibility = "hidden";
          }, 3000);
        } else if (response.user.actif == 1) {
          sessionStorage.setItem("authentication", JSON.stringify(response));
        } else {
          let alert = document.getElementById("login_alert");

          alert.innerHTML =
            "Désolé, une erreur est survenu. Veuillez réessayer.";
          alert.style.visibility = "visible";

          setTimeout(() => {
            document.getElementById("login_alert").style.visibility = "hidden";
          }, 3000);
        }
      }

      if (sessionStorage.getItem("authentication")) {
        let type = JSON.parse(sessionStorage.getItem("authentication")).user.type_utilisateur.nom;
      
        if      (type == "Administrateur")  this.$router.push("/supervisor_list");
        else if (type == "Responsable")     this.$router.push("/student_list");
        else if (type == "Dev")             this.$router.push("/student_list");
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    password_forgot() {
      this.$router.push('/recover');
    }
  },
};
</script>
