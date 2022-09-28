<template>
  <v-container>
    <h1 class="my-2 d-flex justify-center">Nom de l'étudiant</h1>

    <!--
      ************************************************
      Informations de l'étudiant
      ************************************************ 
    -->
    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">Informations de l'étudiant</h2>
        <v-row no-gutters>
          <!-- Numéro de dossier -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="No. de dossier"
              type="number"
              hide-spin-buttons
            />
          </v-col>

          <!-- Code permanent -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Code permanent" />
          </v-col>

          <!-- Service d'enseignement -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-combobox label="Service d'enseignement" />
          </v-col>

          <!-- Numéro de programme -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-select label="No. de programme" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-5 d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <!--
      ************************************************
      Informations de l'étudiant à l'international
      ************************************************ 
    -->
    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">
          Informations de l'étudiant à l'international
        </h2>
        <v-row no-gutters>
          <!-- Statut -->
          <v-col class="px-3" sm="6" cols="12">
            <v-select label="Statut" />
          </v-col>

          <!-- Pays d'origine -->
          <v-col class="px-3" sm="6" cols="12">
            <v-select label="Pays d'origine" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-5 d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <!--
      ************************************************
      Questionnaire de mathématiques
      ************************************************ 
    -->
    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">Questionnaire de mathématiques</h2>
        <v-row no-gutters>
          <!-- Heure de début -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-datetime-picker label="Heure de début" />
          </v-col>

          <!-- Heure de fin -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-datetime-picker label="Heure de fin" />
          </v-col>

          <!-- Effort fourni -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-textarea label="Effort fourni" />
          </v-col>

          <!-- Expérience en informatique -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-textarea label="Expérience en informatique" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-5 d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <!--
      ************************************************
      Cours & Commentaires 
      ************************************************ 
    -->

    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">Commentaires</h2>

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
              <v-btn color="primary my-3"> Ajouter un commentaire </v-btn>

              <!-- Cours de la session -->
              <v-expansion-panels accordion>
                <v-expansion-panel v-for="j in 5" :key="j">
                  <v-expansion-panel-header>
                    Cours #{{ j }} {{ code }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
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
                                  <v-chip class="ms-1" x-small>Remarque</v-chip>
                                  <v-chip class="ms-1" x-small>AUTN</v-chip>
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
                            <v-chip class="ms-1" x-small>Remarque</v-chip>
                            <v-chip class="ms-1" x-small>AUTN</v-chip>
                          </div>
                          <p class="ma-0">
                            Lapalme, Jocelyn 24 sept. 2021 10:15
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
      },
      semesters: {
        tab: null,
        codes: ["AUT21", "HIV21", "AUT22", "HIV22"],
      },
    };
  },
};
</script>
