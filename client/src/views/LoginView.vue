<template>
    <v-container fluid fill-height>
        <v-alert id="login_alert" close-text="Close Alert" color="red accent-4 red--text" type="error" text dark>
        </v-alert>

        <v-card id="loginForm" class="px-4">
            <v-card-text>
                <v-form ref="loginForm" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="E-mail" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="loginPassword" :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" xsm="12" align-end>
                            <v-btn x-large block :disabled="!valid" color="success" @click="validate"> Login </v-btn>
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
            
            loginPassword: "",
            loginEmail: "",

            loginEmailRules: [
                v => !!v || "Champ obligatoire",
                v => /.+@.+\..+/.test(v) || "L\'adresse courriel doit être valide."
            ],
            show1: false,
            rules: {
                required: value => !!value || "Champ obligatoire.",
                min: v => (v && v.length >= 8) || "Vous devez avoir au moins une majuscule, une minuscule et un chiffre, en plus d'avoir au moins 8 caractères."
            },
        }),
        beforeCreate() {
            if(sessionStorage.getItem('authentication')) {
                this.$router.push("/");
                sessionStorage.clear();
                this.name = ""; 
            }
        },
        methods: {
            async validate() {
                let is_connected = false;
                
                if (this.$refs.loginForm.validate()) {
                    
                    await API.getUser(this.loginEmail, this.loginPassword)
                    .then(
                        function (response) {
                            response = response[0];

                            console.log(response); //TODO remove

                            if (response == undefined) {
                                let alert = document.getElementById("login_alert");

                                alert.innerHTML = "Le courriel ou le mot de passe est invalide!";
                                alert.style.visibility = "visible";

                                setTimeout(() => {document.getElementById("login_alert").style.visibility = "hidden"}, 3000);
                            } else if (response.actif == 0) {
                                let alert = document.getElementById("login_alert")

                                alert.innerHTML = "Vous devez activez votre compte avant de pouvoir accéder au contenu du site!";
                                alert.style.visibility = "visible";

                                setTimeout(() => {document.getElementById("login_alert").style.visibility = "hidden"}, 3000);
                            } else if (response.actif == 1) {
                                sessionStorage.setItem('authentication', JSON.stringify(response));
                            } else {
                                let alert = document.getElementById("login_alert")

                                alert.innerHTML = "Désolé, une erreur est survenu. Veuillez réessayer.";
                                alert.style.visibility = "visible";

                                setTimeout(() => {document.getElementById("login_alert").style.visibility = "hidden"}, 3000);
                            
                            }
                        }
                    )

                    var type = JSON.parse(sessionStorage.getItem('authentication')).type_utilisateur.nom;
                    
                    if (type == "Administrateur")
                        this.$router.push("/supervisor_list");
                    else if (type == "Responsable")
                        this.$router.push("/student_list");
                    else if (type == "Dev")
                        this.$router.push("/student_list");
                }
            },
            reset() {
                this.$refs.form.reset();
            },
            resetValidation() {
                this.$refs.form.resetValidation();
            }
        }
    }
 </script>