<template>
  <v-container fluid fill-height>
    <v-alert
      id="resetPassword"
      close-text="Close Alert"
      color="red accent-4 red--text"
      type="error"
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
    password: "",
    confirmPassword: "",
    passwordRules: [v => !!v || "Le mot de passe est requis"],
    confirmPasswordRules: [v => !!v || "Le mot de passe est requis"]
  }),

  methods: {
    async validate() {
      if (this.$refs.resetPasswordForm.validate()) {

        console.log(this.$route.params.token);
        

        const password = await API.reset_password(this.$route.params.token, this.password); //TODO add token & insérer dans BD
        // let   alert    = document.getElementById("recover_alert");

        // if (!password) {
        //   alert.innerHTML = "Le courriel est invalide!";
        // } else {
        //   alert.innerHTML = "Un courriel a été envoyé à l'adresse précisée précédemment!"
        // }

        // alert.style.visibility = "visible";

        // setTimeout(() => {
        //   alert.style.visibility = "hidden";
        // }, 3000);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.confirmPassword || "Password must match";
    }
  }



  // // name: "ResetPassword",
  // // data: () => ({
  // //   dialog: true,
  // //   valid: true,

  // //   password: "",
  // //   confirmPassword: "",
    
  // //   show1: false,
  // //   rules: {
  // //     required: (v) => !!v                  || "Champ obligatoire.",
  // //     password: (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) || (v && v.length >= 8) || "Le mot de passe doit contenir au moins 8 caractères dont 1 majuscule, 1 minuscule, un nombre et un caractère spécial.",
  // //     same: () => this.confirmPassword == this.password || "Les mots de passe doivent être identiques.",
  // //   },
  // // }),
  // // beforeCreate() {
  // //   if (sessionStorage.getItem("authentication")) {
  // //     this.$router.push("/");
  // //     sessionStorage.clear();
  // //     this.name = "";
  // //   }
  // // },
  // // computed: {
  // //   passwordConfirmationRule() {
  // //     return () =>
  // //       this.password === this.confirmPassword || "Password must match";
  // //   }
  // // },
  // // methods: {
  // //   async validate() {
  // //     if (this.$refs.resetPasswordForm.validate()) {
  // //       const response = await API.resetPassword(this.password, this.confirmPassword);

  //       if (response.code === "ERR_BAD_REQUEST") {
  //         let alert = document.getElementById("login_alert");

  //         alert.innerHTML = "Le courriel ou le mot de passe est invalide!";
  //         alert.style.visibility = "visible";

  //         setTimeout(() => {
  //           document.getElementById("login_alert").style.visibility = "hidden";
  //         }, 3000);
  //       } else if (response.user.actif == 0) {
  //         let alert = document.getElementById("login_alert");

  //         alert.innerHTML =
  //           "Vous devez activez votre compte avant de pouvoir accéder au contenu du site!";
  //         alert.style.visibility = "visible";

  //         setTimeout(() => {
  //           document.getElementById("login_alert").style.visibility = "hidden";
  //         }, 3000);
  //       } else if (response.user.actif == 1) {
  //         sessionStorage.setItem("authentication", JSON.stringify(response));
  //       } else {
  //         let alert = document.getElementById("login_alert");

  //         alert.innerHTML =
  //           "Désolé, une erreur est survenu. Veuillez réessayer.";
  //         alert.style.visibility = "visible";

  //         setTimeout(() => {
  //           document.getElementById("login_alert").style.visibility = "hidden";
  //         }, 3000);
  //       }
  //     }

  //     if (sessionStorage.getItem("authentication")) {
  //       let type = JSON.parse(sessionStorage.getItem("authentication")).user.type_utilisateur.nom;
      
  //       if      (type == "Administrateur")  this.$router.push("/supervisor_list");
  //       else if (type == "Responsable")     this.$router.push("/student_list");
  //       else if (type == "Dev")             this.$router.push("/student_list");
  //     }
  //   },
  //   reset() {
  //     this.$refs.form.reset();
  //   },
  //   resetValidation() {
  //     this.$refs.form.resetValidation();
  //   },
  //   password_forgot() {
  //     this.$router.push('/recover');
      }
    // },
//   }
// }
</script>
