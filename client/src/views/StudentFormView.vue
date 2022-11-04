<template>
  <!--
    ************************************************
    Informations de l'étudiant
    ************************************************ 
  -->
  <v-container>
    <div style="display: flex">
      <!-- Previous -->
      <div class="d-flex" style="align-items: center;">
        <v-btn type="submit" outlined @click="gotoPreviousStudent()" :loading="loading">Précédent
        </v-btn>
      </div>

      <h2 class="my-2 d-flex justify-center" style="flex-grow: 1;">
        {{ student.prenom }} {{ student.nom }}
      </h2>

      <!-- Next -->
      <div class="d-flex" style="align-items: center;">
        <v-btn type="submit" outlined @click="gotoNextStudent()" :loading="loading">Suivant</v-btn>
      </div>

    </div>
    <v-card class="py-2 px-3 mb-5" outlined>
      <v-card-text>
        <h3 class="d-flex justify-center mb-4">Informations de l'étudiant</h3>
        <v-row no-gutters>
          <!-- Numéro de dossier -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="No. de dossier" :value="student.no_etudiant" type="number" hide-spin-buttons outlined
              readonly />
          </v-col>

          <!-- Code permanent -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Code permanent" :value="student.code_permanent" outlined readonly />
          </v-col>

          <!-- Numéro de programme -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="No. de programme" :value="student.code_programme" outlined readonly />
          </v-col>

          <!-- Nombre de cours en difficulté -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Nb. de cours en difficulté" :value="amountClassesInDifficulty" outlined readonly />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <!-- Prénom de l'étudiant -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Prénom" :value="student.prenom" outlined readonly />
          </v-col>

          <!-- Nom de l'étudiant -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="Nom" :value="student.nom" outlined readonly />
          </v-col>

          <!-- Numéro de la session -->
          <v-col class="px-3" lg="3" sm="6" cols="12">
            <v-text-field label="No. de la session" :value="student.session_actuelle" type="number" min="0" max="99"
              outlined readonly />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-expansion-panels v-if="student.TA_EtuStatut || student.FormulaireMath" class="mb-5" multiple flat>
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
      <v-expansion-panel v-if="student.FormulaireMath[0]">
        <v-expansion-panel-header class="outlined">
          <h3>Questionnaire de mathématiques</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="outlined">
          <v-row class="mt-10" no-gutters>
            <!-- Heure de début -->
            <v-col class="px-3" sm="6" cols="12">
              <v-text-field label="Heure de début" :value="formattedDate(student.FormulaireMath[0].heure_debut)"
                outlined readonly />
            </v-col>

            <!-- Heure de fin -->
            <v-col class="px-3" sm="6" cols="12">
              <v-text-field label="Heure de fin" :value="formattedDate(student.FormulaireMath[0].heure_fin)" outlined
                readonly />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <!-- Effort fourni -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea label="Effort fourni" :value="student.FormulaireMath[0].effort_fourni" outlined readonly
                no-resize />
            </v-col>

            <!-- Expérience en informatique -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea label="Expérience en informatique" :value="student.FormulaireMath[0].experience_informatique"
                outlined readonly no-resize />
            </v-col>
          </v-row>

          <!-- Cours de mathématiques suivis -->

          <h4 class="d-flex justify-center mb-6">
            Cours de mathématiques de l'étudiant
          </h4>

          <!-- TODO - FormulaireMath[0], on modifie la BD ou on laisse ça de même? -->
          <template v-for="(ta_math, i) in student.FormulaireMath[0].TA_Math">
            <v-row no-gutters>
              <!-- Code du cours 
            <v-col class="px-3" lg="3" sm="6" cols="12">
              <v-text-field
                label="Code du cours"
                :value="ta_math.cours_math.code"
                prepend-icon="mdi-school"
                outlined
                readonly
              />
            </v-col>-->

              <!-- Nom du cours de math -->
              <v-col class="px-3" md="4" cols="12">
                <v-text-field label="Cours" :value="ta_math.cours_math.nom" outlined readonly />
              </v-col>

              <!-- Note de l'étudiant dans le cours -->
              <v-col class="px-3" md="4" cols="12">
                <v-text-field label="Note de l'étudiant" :value="ta_math.note_obtenue" outlined readonly />
              </v-col>

              <!-- Année durant laquelle l'étudiant a suivi le cours -->
              <v-col class="px-3" md="4" cols="12">
                <v-text-field label="Année" :value="'Secondaire ' + ta_math.cours_math.annee" outlined readonly />
              </v-col>
            </v-row>
            <v-divider v-if="i < student.FormulaireMath[0].TA_Math.length - 1" :key="i" class="mb-7"></v-divider>
          </template>
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
        <h3 class="d-flex justify-center">Commentaires</h3>

        <!-- Message si aucun cours n'est associé à l'étudiant -->
        <h4 v-if="semesters.length === 0" class="mt-4 grey--text">
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
              <!-- Ajouter un commentaire -->
              <v-btn block color="primary my-3" @click="show_add_comment = !show_add_comment">
                Ajouter un commentaire
              </v-btn>
              <v-comment-input :show="show_add_comment" :no-etudiant="student.no_etudiant" :remark-codes="remark_codes"
                :code-session="semester.code" method="publish" @cancel="show_add_comment = false"
                @published="getData" />

              <!-- Commentaires de la session -->
              <h4 class="d-flex justify-center my-4">
                Commentaires de la session
              </h4>
              <v-card class="px-5" outlined>
                <!-- Message si l'étudiant n'a aucun commentaire dans la session -->
                <h4 v-if="semester.comments.length === 0" class="my-5 grey--text">
                  L'étudiant n'a aucun commentaire sur cette session!
                </h4>

                <v-comment-list :data="semester.comments" :remark-codes="remark_codes" :editable-if="() => true"
                  @update-data="getData" />
              </v-card>
              <!-- Commentaires d'un cours -->
              <h4 class="d-flex justify-center my-4">
                Commentaires sur les cours de l'étudiant
              </h4>

              <!-- Cours de la session -->
              <v-expansion-panels accordion flat>
                <v-expansion-panel v-for="(student_group, sg_index) in semester.student_groups">
                  <v-expansion-panel-header class="outlined">
                    <v-container class="pa-0 pe-3">
                      <div class="d-flex flex-md-row flex-column justify-space-between col-12 pa-0">
                        <div class="d-flex flex-column col-md">
                          <div class="font-weight-bold">
                            <span>
                              <!-- Modifier le nom du cours -->
                              <v-menu v-model="course_input.show_menu[sg_index]" :close-on-content-click="false"
                                @input="onCourseMenuToggle">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn x-small outlined color="blue darken-3" class="mb-1" v-bind="attrs" v-on="on">
                                    {{
                                    student_group.groupe.cours.nom ||
                                    "Ajouter un nom au cours"
                                    }}
                                  </v-btn>
                                </template>
                                <template>
                                  <v-card>
                                    <v-card-title>
                                      Modifier le nom du cours
                                    </v-card-title>
                                    <v-card-text>
                                      <v-form ref="courseNameForm">
                                        <v-text-field label="Nom du cours" outlined v-model="course_input.value"
                                          counter="64" :rules="course_input.rules"
                                          :append-outer-icon="'mdi-arrow-right'" @click:append-outer="
                                            updateCourseName(
                                              student_group.groupe.cours.code,
                                              course_input.value,
                                              sg_index
                                            )
                                          " />
                                      </v-form>
                                    </v-card-text>
                                  </v-card>
                                </template>
                              </v-menu>
                            </span>
                            ({{ student_group.groupe.cours.code }})
                          </div>
                          <div>
                            Groupe : {{ student_group.groupe.no_groupe }}
                          </div>
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>
                            Durée : {{ student_group.groupe.cours.duree }}
                          </div>
                          <div>
                            Durée absence : {{ student_group.duree_absence }}
                          </div>
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>
                            Campus :
                            {{ student_group.groupe.cours.campus.ville }}
                          </div>
                        </div>
                      </div>
                      <v-divider></v-divider>
                      <div class="d-flex flex-md-row flex-column justify-space-between col-12 pa-0">
                        <div class="d-flex flex-column col-md">
                          <div>
                            Note pondérée : {{ student_group.note_ponderee }}
                          </div>
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>
                            Pourcentage note cumulée :
                            {{ student_group.pourcentage_note_cumulee }}
                          </div>
                        </div>
                        <div class="d-flex flex-column col-md">
                          <div>
                            Remarque note finale :
                            {{ student_group.code_remarque_note_finale.nom }}
                          </div>
                        </div>
                      </div>
                    </v-container>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="outlined">
                    <!-- Message si aucun commentaire n'est associé au cours -->
                    <h4 v-if="student_group.groupe.Commentaire.length === 0" class="mt-5 grey--text">
                      L'étudiant n'a aucun commentaire sur ce cours!
                    </h4>

                    <!-- Commentaires du cours -->
                    <v-comment-list :data="student_group.groupe.Commentaire" :remark-codes="remark_codes"
                      @update-data="getData" />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import API from "@/api";
import CommentList from "@/components/CommentList";
import CommentInput from "@/components/CommentInput";

export default {
  name: "FicheEtudiante",
  data() {
    return {
      student: {},
      remark_codes: [],
      semesters: [],
      semester_tab: null,
      show_add_comment: false,
      loading: false,
      course_input: {
        show_menu: [],
        value: "",
        rules: [
          (v) => !!v || "Un nom de cours est requis",
          (v) =>
            v.length <= 64 ||
            "Le nom du cours doit contenir moins de 64 caractères",
        ],
      },
      comment: {
        title: {
          value: "",
          rules: [
            (v) => !!v || "Un titre est requis",
            (v) =>
              v.length <= 64 || "Le titre doit contenir moins de 64 caractères",
          ],
        },
        description: {
          value: "",
          rules: [
            (v) => !!v || "Une description est requise",
            (v) =>
              v.length <= 255 ||
              "La description doit contenir moins de 255 caractères",
          ],
        },
        remark_id: {
          value: null,
          rules: [(v) => !!v || "Un code de remarque doit être choisi"],
        },
      },
    };
  },
  methods: {
    async updateCourseName(code, name, input_index) {
      if (!this.$refs.courseNameForm[input_index].validate()) return;

      await API.changeCourseName({
        code: code,
        name: name,
      });
      this.course_input.show_menu[input_index] = false;
      await this.getData();
    },
    async onCourseMenuToggle(opened) {
      if (!opened) this.course_input.value = "";
    },
    async getData(no_etudiant) {
      // Get student info
      this.student = await API.getStudentFormInfo(no_etudiant || this.$route.params.id);

      // Get all remark codes
      this.remark_codes = await API.getRemarkCode();

      // Get all semesters the student is in
      let duplicate_semesters = this.student.TA_EtudiantGroupe.map(
        (x) => x.groupe.session
      );
      this.semesters = Array.from(
        new Set(duplicate_semesters.map((s) => s.id))
      ).map((id) => {
        const code = duplicate_semesters.find((s) => s.id === id).code;
        return {
          id: id,
          code: code,
          student_groups: this.student.TA_EtudiantGroupe.filter(
            (g) => g.groupe.session.id === id
          ),
          comments: this.student.semester_comments.filter(
            (s) => s.groupe.code_session === code
          ),
        };
      });
    },
    async gotoPreviousStudent() {
      // Get previous student info
      this.loading = true;

      const previousStudent = await API.getPreviousStudent(this.student.no_etudiant);
      await this.getData(previousStudent[0].no_etudiant);

      await this.$router.push({ name: 'student_form', params: { id: this.student.no_etudiant } });
      this.loading = false;
    },
    async gotoNextStudent() {
      // Get next student info
      this.loading = true;

      const nextStudent = await API.getNextStudent(this.student.no_etudiant);
      await this.getData(nextStudent[0].no_etudiant);

      await this.$router.push({ name: 'student_form', params: { id: this.student.no_etudiant } });
      this.loading = false;
    },
    formattedDate(string_date) {
      let d = new Date(Date.parse(string_date));
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return d.toLocaleDateString("fr-CA", options);
    },
  },
  async created() {
    await this.getData();
  },
  computed: {
    amountClassesInDifficulty() {
      return this.student.TA_EtudiantGroupe
        ? this.student.TA_EtudiantGroupe.filter(
          (g) => g.pourcentage_note_cumulee < 60
        ).length
        : 0;
    },
  },
  components: {
    "v-comment-list": CommentList,
    "v-comment-input": CommentInput,
  },
};
</script>
