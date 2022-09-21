<template>
  <v-container>
    
    <h1 class="my-2">Nom de l'étudiant</h1>

    <!-- Informations de l'étudiants -->
    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">Informations de l'étudiant</h2>
        <v-row>
          <!-- Numéro de dossier -->
          <v-col>
            <v-text-field
              label="No. de dossier"
              type="number"
              hide-spin-buttons
            />
          </v-col>

          <!-- Code permanent -->
          <v-col>
            <v-text-field label="Code permanent" />
          </v-col>

          <!-- Service d'enseignement -->
          <v-col>
            <v-combobox label="Service d'enseignement" />
          </v-col>

          <!-- Numéro de programme -->
          <v-col>
            <v-select label="No. de programme" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Informations de l'étudiant à l'international -->
    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">
          Informations de l'étudiant à l'international
        </h2>
        <v-row>
          <!-- Statut -->
          <v-col>
            <v-select label="Statut" />
          </v-col>

          <!-- Pays d'origine -->
          <v-col>
            <v-select label="Pays d'origine" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Questionnaire de mathématiques de l'étudiant (Sec.4 & Sec.5) -->
    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">Questionnaire de mathématiques</h2>
        <v-row>
          <v-col>
            <!-- Heure de début -->
            <v-menu
              ref="math_st_menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="math_form.start_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="math_form.start_time"
                  label="Heure de début"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="math_form.start_time"
                full-width
                @click:minute="$refs.math_st_menu.save(math_form.start_time)"
              />
            </v-menu>

            <!-- Heure de fin -->
            <v-menu
              ref="math_et_menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="math_form.end_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="math_form.end_time"
                  label="Heure de début"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="math_form.end_time"
                full-width
                @click:minute="$refs.math_et_menu.save(math_form.end_time)"
              />
            </v-menu>
          </v-col>

          <!-- Effort fourni -->
          <v-col>
            <v-textarea label="Effort fourni" />
          </v-col>

          <!-- Expérience en informatique -->
          <v-col>
            <v-textarea label="Expérience en informatique" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Cours de l'étudiant & Commentaires des professeurs -->
    <v-card class="py-2 px-3 mb-5">
      <v-card-text>
        <h2 class="d-flex justify-center">Commentaires</h2>
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
      }
    }
  }
};
</script>
