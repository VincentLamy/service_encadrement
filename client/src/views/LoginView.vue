<template>
    <v-container fluid fill-height>
        
        <!-- Alerte lorsque les informations d'identification sont invalides. -->
        <v-alert id="login_alert" close-text="Close Alert" color="red accent-4 red--text" type="error" text dark></v-alert>
        
        <!-- TODO <iframe id="f1" ref="frame1" :src="'/recoverPassword.html'"></iframe> -->

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
                        
                        <v-col class="d-flex" cols="12" sm="6" xsm="12"></v-col>

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
    import { mapWritableState  } from 'pinia'
    import { useAuthenticationStore } from '@/store/authentication'
    import API from "@/api";

    export default {
        name: "Login",
        data: () => ({
            dialog: true,
            valid: true,
            
            loginPassword: "",
            loginEmail: "",

            loginEmailRules: [
                v => !!v || "Required",
                v => /.+@.+\..+/.test(v) || "E-mail must be valid"
            ],
            show1: false,
            rules: {
                required: value => !!value || "Required.",
                min: v => (v && v.length >= 8) || "Min 8 characters"
            },
            store: null,
        }),
        computed: {
            ...mapWritableState(useAuthenticationStore, ['first_name']),
            ...mapWritableState(useAuthenticationStore, ['last_name']),
            ...mapWritableState(useAuthenticationStore, ['type']),
            ...mapWritableState(useAuthenticationStore, ['departement']),
            ...mapWritableState (useAuthenticationStore, ['is_activated']),
        },
        methods: {
            async validate() {
                let is_connected = false;
                
                if (this.$refs.loginForm.validate()) {
                    const store = useAuthenticationStore()
                    
                    await API.getUser(this.loginEmail, this.loginPassword)
                    .then(
                        function (response) {
                            response = response[0];

                            if (response == undefined) {
                                let alert = document.getElementById("login_alert");

                                alert.innerHTML = "Le courriel ou le mot de passe est invalide!";
                                alert.style.visibility = "visible";

                                setTimeout(() => {document.getElementById("login_alert").style.visibility = "hidden"}, 3000);
                            } else if (response.employe.actif == false) {
                                let alert = document.getElementById("login_alert")

                                alert.innerHTML = "Vous devez activez votre compte avant de pouvoir accéder au contenu du site!";
                                alert.style.visibility = "visible";

                                setTimeout(() => {document.getElementById("login_alert").style.visibility = "hidden"}, 3000);
                            } else {
                                store.$patch({
                                    first_name: response.employe.prenom,
                                    last_name: response.employe.nom,
                                    type: response.type_utilisateur.nom,
                                    is_activated: response.actif, 
                                });

                                store.$subscribe((mutation, state) => {
                                    // import { MutationType } from 'pinia'
                                    mutation.type // 'direct' | 'patch object' | 'patch function'
                                    // same as cartStore.$id
                                    mutation.first_name
                                    mutation.last_name 
                                    mutation.type
                                    mutation.is_activated
                                    // only available with mutation.type === 'patch object'
                                    mutation.payload // patch object passed to cartStore.$patch()


                                    // persist the whole state to the local storage whenever it changes
                                    localStorage.setItem('auth', JSON.stringify(state))
                                });

                                console.log(localStorage.getItem('auth'));
   
                                is_connected = true;
                            }
                        }
                    )

                    if(is_connected)
                        // console.log(store)
                        // console.log(localStorage.getItem('auth'))
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