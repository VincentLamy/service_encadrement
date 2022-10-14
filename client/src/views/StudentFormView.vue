<template>
  <v-container>
    <h2 class="my-2 d-flex justify-center">
      {{ student.prenom }} {{ student.nom }}
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
              :value="student.no_etudiant"
              type="number"
              hide-spin-buttons
              outlined
              readonly
            />
          </v-col>

          <!-- Code permanent -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="Code permanent"
              :value="student.code_permanent"
              outlined
              readonly
            />
          </v-col>

          <!-- Numéro de programme -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="No. de programme"
              :value="student.code_programme"
              outlined
              readonly
            />
          </v-col>

          <!-- Nombre de cours en difficulté -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="Nb. de cours en difficulté"
              :value="amount_classes_in_difficulty"
              outlined
              readonly
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <!-- Prénom de l'étudiant -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="Prénom"
              :value="student.prenom"
              outlined
              readonly
            />
          </v-col>

          <!-- Nom de l'étudiant -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Nom" :value="student.nom" outlined readonly />
          </v-col>

          <!-- Numéro de la session -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field
              label="No. de la session"
              :value="student.session_actuelle"
              type="number"
              min="0"
              max="99"
              outlined
              readonly
            />
          </v-col>
        </v-row>
      </v-card-text>
      <!-- <v-card-actions class="px-5 d-flex justify-space-between">
        <v-btn color="grey" disabled plain>Annuler</v-btn>
        <v-btn type="submit" color="primary" plain>Mettre à jour</v-btn>
      </v-card-actions> -->
    </v-card>

    <v-expansion-panels
      v-if="student.TA_EtuStatut || student.FormulaireMath"
      class="mb-5"
      multiple
      flat
    >
      <!--
        ************************************************
        Informations de l'étudiant à l'international
        ************************************************ 
      -->
      <v-expansion-panel v-if="student.TA_EtuStatut">
        <v-expansion-panel-header class="outlined">
          <h3>Informations de l'étudiant à l'international</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="outlined">
          <v-row no-gutters class="mt-10">
            <!-- Statut -->
            <v-col class="px-3" sm="6" cols="12">
              <v-select label="Statut" outlined readonly />
            </v-col>

            <!-- Pays d'origine -->
            <v-col class="px-3" sm="6" cols="12">
              <v-select label="Pays d'origine" outlined readonly />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!--
        ************************************************
        Questionnaire de mathématiques
        ************************************************ 
      -->
      <v-expansion-panel v-if="student.FormulaireMath">
        <v-expansion-panel-header class="outlined">
          <h3>Questionnaire de mathématiques</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="outlined">
          <v-row class="mt-10" no-gutters>
            <!-- Heure de début -->
            <v-col class="px-3" sm="6" cols="12">
              <v-datetime-picker label="Heure de début" outlined disabled />
            </v-col>

            <!-- Heure de fin -->
            <v-col class="px-3" sm="6" cols="12">
              <v-datetime-picker label="Heure de fin" outlined disabled />
            </v-col>
          </v-row>

          <!-- Cours de mathématiques suivis -->
          <v-row
            v-for="(math_class, i) in math_form.classes"
            :key="i"
            no-gutters
          >
            <!-- Code du cours -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Code du cours"
                :value="math_class.code"
                prepend-icon="mdi-school"
                outlined
                readonly
              />
            </v-col>

            <!-- Nom du cours de math -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Nom du cours"
                :value="math_class.name"
                outlined
                readonly
              />
            </v-col>

            <!-- Note de l'étudiant dans le cours -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Note de l'étudiant"
                :value="math_class.mark"
                outlined
                readonly
              />
            </v-col>

            <!-- Année durant laquelle l'étudiant a suivi le cours -->
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Année"
                :value="math_class.year"
                outlined
                readonly
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <!-- Effort fourni -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea label="Effort fourni" outlined readonly />
            </v-col>

            <!-- Expérience en informatique -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea
                label="Expérience en informatique"
                outlined
                readonly
              />
            </v-col>
          </v-row>
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

        <!-- Message si aucun cours n'est associé à l'étudiant -->
        <h4 v-if="semesters.length === 0" class="grey--text">
          L'étudiant n'est inscrit à aucun cours!
        </h4>

        <!-- Onglets sessions -->
        <v-tabs v-model="semester_tab" v-if="semesters.length !== 0">
          <v-tab v-for="(semester, i) in semesters" :key="i">
            {{ semester.code }}
          </v-tab>
        </v-tabs>

        <v-container>
          <!-- Cours & Commentaires des sessions -->
          <v-tabs-items v-model="semester_tab" v-if="semesters.length !== 0">
            <v-tab-item v-for="(semester, i) in semesters" :key="i">
              <!-- Cours de la session -->
              <v-expansion-panels accordion flat>
                <v-expansion-panel
                  v-for="student_group in semester.student_groups"
                >
                  <v-expansion-panel-header class="outlined">
                    <v-container class="pa-0 pe-3">
                      <div class="d-flex flex-md-row flex-column justify-space-between col-12 pa-0">
                        <div class="d-flex flex-column col-md">
                          <div class="font-weight-bold">
                            <span v-if="student_group.groupe.cours.nom">
                              {{ student_group.groupe.cours.nom }}
                            </span>
                            <span v-else>
                              <v-menu>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn 
                                    x-small
                                    outlined
                                    color="blue darken-3"
                                    class="mb-1"
                                    @click.native.stop
                                    v-bind="attrs"
                                    v-on="on"
                                  >
                                    Ajouter un nom au cours
                                  </v-btn>
                                </template>
                                <template>
                                  <v-card>
                                    <v-card-text>
                                      <v-text-field 
                                        label="Nom du cours"
                                        outlined
                                        hide-details
                                        @click.stop
                                        :append-outer-icon="'mdi-arrow-right'"
                                        @click:append-outer=""
                                      />
                                    </v-card-text>
                                  </v-card>
                                </template>
                              </v-menu>
                            </span>
                            ({{ student_group.groupe.cours.code }})
                          </div>
                          <div>Groupe : {{ student_group.groupe.no_groupe }}</div> 
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>Durée : {{ student_group.groupe.cours.duree }}</div>
                          <div>Durée absence : {{ student_group.duree_absence }}</div>
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>Campus : {{ student_group.groupe.cours.campus.ville}}</div>
                        </div>
                      </div>
                      <v-divider></v-divider>
                      <div class="d-flex flex-md-row flex-column justify-space-between col-12 pa-0">
                        <div class="d-flex flex-column col-md">
                          <div>Note pondérée : {{ student_group.note_ponderee }}</div> 
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>Note cumulée : NaN</div>
                          <div>Pourcentage note cumulée : {{ student_group.pourcentage_note_cumulee }}</div> 
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>Note finale : NaN</div>
                          <div>Remarque note finale : {{ student_group.code_remarque_note_finale.nom }}</div>
                        </div>
                      </div>
                    </v-container>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="outlined">
                    <!-- Message si aucun commentaire n'est associé au cours -->
                    <h4
                      v-if="student_group.groupe.Commentaire.length === 0"
                      class="mt-5 grey--text"
                    >
                      L'étudiant n'a aucun commentaire sur ce cours!
                    </h4>

                    <!-- Commentaires d'un cours -->
                    <v-list
                      v-if="student_group.groupe.Commentaire.length !== 0"
                    >
                      <template
                        v-for="(comment, i) in student_group.groupe.Commentaire"
                      >
                        <v-list-item class="py-3">
                          <v-row class="align-center">
                            <!-- Titre + commentaire -->
                            <v-list-item-content>
                              <v-list-item-title>
                                <span class="black--text">
                                  {{ comment.titre }}
                                </span>
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{ comment.contenu }}
                              </v-list-item-subtitle>
                            </v-list-item-content>

                            <!-- Catégories du commentaire + date de publication -->
                            <v-list-item-action
                              class="d-flex flex-column justify-space-between"
                            >
                              <v-list-item-action-text>
                                <div class="d-flex justify-end">
                                  <v-chip
                                    class="ms-1 font-weight-bold"
                                    x-small
                                    >{{ comment.code_remarque.nom }}</v-chip
                                  >
                                </div>
                                <p class="ma-0 black--text">
                                  {{ comment.employe.nom }},
                                  {{ comment.employe.prenom }}
                                  <span class="ms-4 grey--text">
                                    {{ dateToString(comment.date_creation) }}
                                  </span>
                                </p>
                              </v-list-item-action-text>
                            </v-list-item-action>
                          </v-row>
                        </v-list-item>
                        <v-divider
                          v-if="i < student_group.groupe.Commentaire.length - 1"
                          :key="i"
                        ></v-divider>
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
                          <span class="black--text">
                            Commentaire sur la session #{{ k }}
                          </span>
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
                            <v-chip class="ms-1 font-weight-bold" x-small>
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
import API from "@/api";

export default {
  name: "FicheEtudiante",
  data() {
    return {
      student: {},
      semesters: [],
      semester_tab: null,
      amount_classes_in_difficulty: 0,
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
    };
  },
  methods: {
    dateToString(d) {
      d = new Date(d);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return d.toLocaleDateString("fr-CA", options);
    },
    updateClassName(new_name) {

    }
  },
  async created() {
    // Get student info
    this.student = await API.getStudentFormInfo(this.$route.params.id);
    console.log(this.student);

    // if(this.student.note_ponderee)

    // Get all semesters the student is in
    let duplicate_semesters = this.student.TA_EtudiantGroupe.map(
      (x) => x.groupe.session
    );
    this.semesters = Array.from(
      new Set(duplicate_semesters.map((s) => s.id))
    ).map((id) => {
      return {
        id: id,
        code: duplicate_semesters.find((s) => s.id === id).code,
        student_groups: this.student.TA_EtudiantGroupe.filter(
          (g) => g.groupe.session.id === id
        ),
      };
    });

    // Get amount of classes the student is currently failing
    this.amount_classes_in_difficulty = this.student.TA_EtudiantGroupe.filter(
      (g) => g.pourcentage_note_cumulee < 60
    ).length;
  },
};
</script>
