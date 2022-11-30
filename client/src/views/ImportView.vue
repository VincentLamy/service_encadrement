<template>
    <v-container>
        <v-alert
            id="csv_alert"
            close-text="Close Alert"
            :color="alertColor"
            :type="alertType"
            text
            dark
            dismissible
            v-if="alert"
        >{{ alertContent }}</v-alert>

        <h2 style="color: #fc8d33" class="mb-5">Importation des données</h2>
    
        <v-card id="import_card">
            <v-col class="text-center">
                <p 
                    style="color: black" 
                    class="body-1 mt-7"
                >Seulement les fichiers Excel et CSV sont acceptés.</p>
            </v-col>

            <v-row id="import_button">
                <v-col>
                    <v-row class="text-center">
                        <!-- Button for Rapport d'encadrement -->
                        <v-btn
                            color="primary"
                            dark
                            :loading="isSelecting"
                            @click="handleFileImport('rapport_encadrement')"
                            v-if="!loading"
                        >Importer Rapport d'encadrement</v-btn>
                    </v-row>

                    <v-row class="text-center">
                        <!-- Button for Sondage mathématiques -->
                        <v-btn
                            color="primary"
                            dark
                            id
                            :loading="isSelecting"
                            @click="handleFileImport('sondage_mathematiques')"
                            v-if="!loading"
                        >Importer Sondage mathématiques</v-btn>
                    </v-row>

                    <v-row class="text-center">
                        <!-- Button for Etudiants Internationaux -->
                        <v-btn
                            color="primary"
                            dark
                            id
                            :loading="isSelecting"
                            @click="handleFileImport('etudiants_internationaux')"
                            v-if="!loading"
                        >Importer Liste étudiants internationaux</v-btn>
                    </v-row>
                </v-col>
                
                <v-col id="select_session">
                    <v-select   
                        v-model="session_choisie"
                        placeholder="Session"   
                        :items=sessions
                        v-if="!loading"
                        :loading="isSelecting"
                    ></v-select>
                </v-col>
            </v-row>

            <!-- File input for all buttons -->
            <input
                ref="uploader"
                class="d-none"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                @change="onFileChanged"
            />

            <!-- Progress bar -->
            <v-progress-linear
                :active="loading"
                :value="loadingValue"
                absolute
                bottom
                color="deep-purple accent-4"
            ></v-progress-linear>
        </v-card>
    </v-container>
</template>

<script>
    import API from "../api";

    export default {
        name: "CSVImport",
        data() {
            return {
                sessions: [],
                session_choisie: "",
                isSelecting: false,
                selectedFile: null,
                loading: false,
                loadingValue: 0,
                alert: false,
                alertContent: "",
                alertColor: "green",
                alertType: "success",
            };
        },
        async created() {
            const response = await API.getAllSessions();
            let session_actuelle = this.getSessionActuelle();

            this.session_choisie = session_actuelle;

            if (!response) {
                this.sessions.push(session_actuelle);                
            } else if (response.length != 0 && response[0].code != session_actuelle) {
                this.sessions.push(session_actuelle);
            
                for (let session = 0; session < response.length; session++) {
                    this.sessions.push(response[session].code); 
                }
            } else if (response[0].code == session_actuelle) {
                for (let session = 0; session < response.length; session++) {
                    this.sessions.push(response[session].code); 
                }
            }
            
        },
        mounted() {
            let script = document.createElement("script");
            
            script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.2/xlsx.js");
            document.head.appendChild(script);
        },
        methods: {
            getSessionActuelle() {
                const   today = new Date(),
                    
                        yy = today.getFullYear().toString().substring(2),
                        mm = today.getMonth() + 1,
                        dd = today.getDate();
            
                let session_actuelle = "";

                // AUT
                if ((mm == 8 && dd >= 1 || mm > 8) && (mm == 12 && dd <= 31 || mm < 12)) {
                    session_actuelle = "AUT" + yy;
                }

                // HIV
                if ((mm == 1 && dd >= 1 || mm > 1) && (mm == 5 && dd <= 19 || mm < 5)) {
                    session_actuelle = "HIV" + yy;
                }

                // ETE
                if ((mm == 5 && dd >= 20 || mm > 5) && (mm == 7 && dd <= 31 || mm < 7)) {
                    session_actuelle = "ETE" + yy;
                }

                return session_actuelle;
            },
            handleFileImport(button) {
                this.isSelecting = true;

                // After obtaining the focus when closing the FilePicker, return the button state to normal
                window.addEventListener(
                    "focus", 
                    () => { this.isSelecting = false; }, 
                    { once: true }
                );

                // Trigger click on the FileInput
                this.$refs.uploader.click();

                // Differentiate which button has been clicked
                this.$refs.uploader.id = button;
            },
            onFileChanged(e) {
                this.selectedFile = e.target.files[0];
                this.loading = true;

                let reader = new FileReader();
                let session_choisie = this.session_choisie;

                if(!session_choisie) {
                    session_choisie = this.getSessionActuelle();
                }

                reader.onload = (function (id, outsideRouter, file) {
                    const button_id = id;
                    const router = outsideRouter;

                    return function (e) {
                        let data = e.target.result;
                        let workbook = XLSX.read(data, { type: "binary" });

                        workbook.SheetNames.forEach(async function (sheetName) {
                            // File to object
                            let XL_row_object = XLSX.utils.sheet_to_json(
                                workbook.Sheets[sheetName], 
                                { defval: "" }
                            );

                            let response;

                            let ok = true;
                            let i = 0;
                            let bypassed = [];

                            // Rapport encadrement
                            if (button_id === "rapport_encadrement") {
                                do {
                                    response = await API.addOneRapportEncadrement(XL_row_object[i], session_choisie);
                                    // If it works
                                    if (response.ok === "true") {
                                        file.loadingValue = (i / XL_row_object.length) * 100;
                                        file.alertContent = 
                                            i + 
                                            1 + 
                                            " lignes entrées sur " + 
                                            XL_row_object.length +
                                            ". Veuillez rester sur cette page.";
                                        file.alertColor = "green";
                                        file.alertType = "success";
                                        file.alert = true;

                                        if (response.bypassed === "true")
                                            bypassed.push(i + 2);
                                    } else {                                          // If error
                                        ok = false;
                                    }
                                    i++;
                                } while (i < XL_row_object.length && ok === true);

                                // Check if students need to be removed
                                const statusResponse = await API.removeInactiveStudents();
                            }
                            else if (button_id === "sondage_mathematiques") { // Sondage mathématiques
                                do {
                                    response = await API.addOneSondageMathematiques(XL_row_object[i], session_choisie);

                                    // If it works
                                    if (response.ok === "true") {
                                        file.loadingValue = (i / XL_row_object.length) * 100;

                                        file.alertContent =
                                            i +
                                            1 +
                                            " lignes entrées sur " +
                                            XL_row_object.length +
                                            ". Veuillez rester sur cette page.";
                                        file.alertColor = "green";
                                        file.alertType = "success";
                                        file.alert = true;

                                        if (response.bypassed === "true") {
                                            bypassed.push(i + 1);
                                        }
                                    } else {              // If error
                                        ok = false;
                                    }
                                        i++;
                                } while (i < XL_row_object.length && ok === true);
                            }       
                            // Etudiants internationaux
                            else if (button_id === "etudiants_internationaux") {
                                do {
                                    response = await API.addOneEtudiantsInternationaux(XL_row_object[i], session_choisie);

                                    // If it works
                                    if (response.ok === "true") {
                                        file.loadingValue = (i / XL_row_object.length) * 100;

                                        file.alertContent =
                                            i +
                                            1 +
                                            " lignes entrées sur " +
                                            XL_row_object.length +
                                            ". Veuillez rester sur cette page.";
                                        file.alertColor = "green";
                                        file.alertType = "success";
                                        file.alert = true;

                                        if (response.bypassed === "true") {
                                            bypassed.push(i + 2);
                                        }
                                    } else { // If error
                                        ok = false;
                                    }
                                    i++;
                                } while (i < XL_row_object.length && ok === true);
                            }

                            // If it works (end)
                            if (response.ok === "true") {
                                file.alertContent = "Le fichier a bien été importé. ";
                                file.alertColor = "green";
                                file.alertType = "success";

                                //TODO simplifier?
                                // If lines were bypassed
                                if (bypassed.length > 0) {
                                    file.alertContent += "Les lignes ";
                                    bypassed.forEach((value) => {
                                    file.alertContent += value + ", ";
                                    });
                                    file.alertContent = file.alertContent.slice(0, -2);
                                    file.alertContent +=
                                    " n'ont pas été ajouté parce qu'elles contenaient des erreurs.";
                                }
                            } else {  // If error (end)
                                if (i > 1)  file.alertContent = "Un problème est survenu à la ligne " + (i + 1);
                                else        file.alertContent = "Un problème est survenu dès la première ligne ";
                            
                                file.alertColor = "red";
                                file.alertType = "error";
                            }

                            file.value = 0;
                            file.alert = true;
                            file.loading = false;
                        });
                    };
                })(e.target.id, this.$router, this);
                
                reader.readAsBinaryString(this.selectedFile);
            },
        },
    };
</script>
