<template>
    <v-container>
        <v-form ref="recoverPasswordForm" v-model="valid" lazy-validation>
                    
        </v-form>
    </v-container>
</template>


<script>
    import API from "@/api";

    export default {
        name: "Login",
        data: () => ({
            dialog: true,
            valid: true,
            
            email: "",

            loginEmailRules: [
                v => !!v || "Required",
                v => /.+@.+\..+/.test(v) || "E-mail must be valid"
            ],
            show1: false,
            rules: {
                required: value => !!value || "Required.",
            },
        }),
        methods: {
            async validate() {
                if (this.$refs.loginForm.validate()) {
                    await API.getUser(this.loginEmail)
                    .then(
                        function (response) {
                            response = response[0];

                            Email.send({
                            Host : "smtp.elasticemail.com",
                            Username : "username",
                            Password : "password",
                            To : 'them@website.com',
                            From : "you@isp.com",
                            Subject : "This is the subject",
                            Body : "And this is the body"
}).then(
  message => alert(message)
);
                        }
                    )

                    if (JSON.parse(sessionStorage.getItem('authentication')).type_utilisateur.nom == 'Administrateur') {
                        this.$router.push("/user_list");
                    }else if (JSON.parse(sessionStorage.getItem('authentication')).type_utilisateur.nom == 'Responsable') {
                        this.$router.push("/student_list");
                    }
                }
            }
        }
    }
</script>

<script src="https://smtpjs.com/v3/smtp.js"></script>