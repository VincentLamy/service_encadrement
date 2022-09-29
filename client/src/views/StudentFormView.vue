<template>
  <v-container>
    <h2 class="my-2 d-flex justify-center blue--text text--darken-3">
      Nom de l'étudiant
    </h2>

    <!--
      ************************************************
      Informations de l'étudiant
      ************************************************ 
    -->
    <v-card class="py-2 px-3 mb-5" outlined>
      <v-card-text>
        <h3 class="d-flex justify-center mb-4">Informations de l'étudiant</h3>
        <v-row no-gutters>
          <!-- Numéro de dossier -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="No. de dossier"
              type="number"
              hide-spin-buttons
              outlined
            />
          </v-col>

          <!-- Code permanent -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Code permanent" outlined />
          </v-col>

          <!-- Numéro de programme -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-select label="No. de programme" outlined />
          </v-col>

          <!-- Nombre de cours en difficulté -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="Nb. de cours en difficulté"
              value="3"
              readonly
              filled
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <!-- Prénom de l'étudiant -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Prénom" outlined />
          </v-col>

          <!-- Nom de l'étudiant -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Nom" outlined />
          </v-col>

          <!-- Numéro de la session -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="No. de la session"
              type="number"
              min="0"
              max="99"
              outlined
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-5 d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <v-expansion-panels class="mb-5" multiple flat>
      <!--
        ************************************************
        Informations de l'étudiant à l'international
        ************************************************ 
      -->
      <v-expansion-panel>
        <v-expansion-panel-header class="outlined">
          <h3>Informations de l'étudiant à l'international</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="outlined">
          <v-row no-gutters class="mt-10">
            <!-- Statut -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-select label="Statut" outlined />
            </v-col>

            <!-- Pays d'origine -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-select label="Pays d'origine" outlined />
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between mt-5">
            <v-btn color="grey" disabled plain>Annuler</v-btn>
            <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!--
        ************************************************
        Questionnaire de mathématiques
        ************************************************ 
      -->
      <v-expansion-panel>
        <v-expansion-panel-header class="outlined">
          <h3>Questionnaire de mathématiques</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="outlined">
          <v-row class="mt-10" no-gutters>
            <!-- Heure de début -->
            <v-col class="px-3" sm="6" cols="12">
              <v-datetime-picker label="Heure de début" outlined />
            </v-col>

            <!-- Heure de fin -->
            <v-col class="px-3" sm="6" cols="12">
              <v-datetime-picker label="Heure de fin" outlined />
            </v-col>
          </v-row>

          <!-- Cours de mathématiques suivis -->
          <v-row v-for="math_class in math_form.classes" no-gutters>
            <!-- Code du cours -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Code du cours"
                :value="math_class.code"
                prepend-icon="mdi-school"
                outlined
              />
            </v-col>

            <!-- Nom du cours de math -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Nom du cours"
                :value="math_class.name"
                outlined
              />
            </v-col>

            <!-- Note de l'étudiant dans le cours -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Note de l'étudiant"
                :value="math_class.mark"
                outlined
              />
            </v-col>

            <!-- Année durant laquelle l'étudiant a suivi le cours -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field label="Année" :value="math_class.year" outlined />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <!-- Effort fourni -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea label="Effort fourni" outlined />
            </v-col>

            <!-- Expérience en informatique -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea label="Expérience en informatique" outlined />
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between mt-5">
            <v-btn color="grey" disabled plain>Annuler</v-btn>
            <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!--
      ************************************************
      Cours & Commentaires 
      ************************************************ 
    -->
    <v-card class="py-2 px-3 mb-5" outlined>
      <v-card-text>
        <h3 class="d-flex justify-center mb-4">Commentaires</h3>

        <!-- Onglets sessions -->
        <v-tabs v-model="semesters.tab">
          <v-tab v-for="code in semesters.codes">
            {{ code }}
          </v-tab>
        </v-tabs>

        <v-container>
          <!-- Cours & Commentaires des sessions -->
          <v-tabs-items v-model="semesters.tab">
            <v-tab-item v-for="(code, i) in semesters.codes" :key="i">
              <!-- Cours de la session -->
              <v-expansion-panels accordion flat>
                <v-expansion-panel v-for="j in 5" :key="j">
                  <v-expansion-panel-header class="outlined">
                    Cours #{{ j }} {{ code }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="outlined">
                    <!-- Commentaires d'un cours -->
                    <v-list>
                      <template v-for="k in 3">
                        <v-list-item class="py-3">
                          <v-row class="align-center">
                            <!-- Titre + commentaire -->
                            <v-list-item-content :key="k">
                              <v-list-item-title>
                                Commentaire sur la session #{{ k }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                Informations additionnelles
                              </v-list-item-subtitle>
                            </v-list-item-content>

                            <!-- Catégories du commentaire + date de publication -->
                            <v-list-item-action
                              class="d-flex flex-column justify-space-between"
                            >
                              <v-list-item-action-text>
                                <div class="d-flex justify-end">
                                  <v-chip
                                    class="ms-1 font-weight-bold blue--text text--darken-3"
                                    x-small
                                    >Remarque</v-chip
                                  >
                                  <v-chip
                                    class="ms-1 font-weight-bold blue--text text--darken-3"
                                    x-small
                                    >AUTN</v-chip
                                  >
                                </div>
                                <p class="ma-0">
                                  Lapalme, Jocelyn 24 sept. 2021 10:15
                                </p>
                              </v-list-item-action-text>
                            </v-list-item-action>
                          </v-row>
                        </v-list-item>
                        <v-divider v-if="k < 3" :key="k"></v-divider>
                      </template>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Commentaires de la session -->
              <v-btn color="primary my-3"> Ajouter un commentaire </v-btn>

              <v-list class="px-5" outlined>
                <template v-for="k in 3">
                  <v-list-item class="py-3">
                    <v-row class="align-center">
                      <!-- Titre + commentaire -->
                      <v-list-item-content :key="k">
                        <v-list-item-title>
                          Commentaire sur la session #{{ k }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          Informations additionnelles
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <!-- Catégories du commentaire + date de publication -->
                      <v-list-item-action
                        class="d-flex flex-column justify-space-between"
                      >
                        <v-list-item-action-text>
                          <div class="d-flex justify-end">
                            <v-chip
                              class="ms-1 font-weight-bold blue--text text--darken-3"
                              x-small
                            >
                              Remarque
                            </v-chip>
                            <v-chip
                              class="ms-1 font-weight-bold blue--text text--darken-3"
                              x-small
                            >
                              AUTN
                            </v-chip>
                          </div>
                          <p class="ma-0 black--text">
                            Lapalme, Jocelyn
                            <span class="ms-4 grey--text"
                              >24 sept. 2021 10:15</span
                            >
                          </p>
                        </v-list-item-action-text>
                      </v-list-item-action>

                      <!-- Boutons de modification -->
                      <v-btn class="ms-2" text icon>
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </v-row>
                  </v-list-item>
                  <v-divider v-if="k < 3" :key="k"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "FicheEtudiante",
  data() {
    return {
      math_form: {
        start_time: null,
        end_time: null,
        classes: [
          {
            code: "SN-473D",
            name: "Sec.4 SN",
            mark: 71,
            year: "Secondaire 4",
          },
          {
            code: "CST-1123F",
            name: "Sec.5 CST",
            mark: 94,
            year: "Secondaire 5",
          },
        ],
      },
      semesters: {
        tab: null,
        codes: ["AUT21", "HIV21", "AUT22", "HIV22"],
      },
    };
  },
};
</script>
