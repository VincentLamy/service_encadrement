<template>
  <v-container>
    <div style="display: flex">
      <!-- Previous -->
      <div class="d-flex" style="align-items: center">
        <v-btn
          type="submit"
          outlined
          @click="gotoPreviousStudent()"
          :loading="loading"
          >Précédent
        </v-btn>
      </div>

      <h2 class="my-2 d-flex justify-center" style="flex-grow: 1">
        {{ student.prenom }} {{ student.nom }}
      </h2>

      <!-- Next -->
      <div class="d-flex" style="align-items: center">
        <v-btn
          type="submit"
          outlined
          @click="gotoNextStudent()"
          :loading="loading"
          >Suivant</v-btn
        >
      </div>
    </div>

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
              :value="amountClassesInDifficulty"
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

          <!-- Statut de étudiant (ex. SA)-->
          <v-col
            class="px-3"
            lg="3"
            sm="6"
            cols="12"
            v-if="student.TA_EtuStatut && student.TA_EtuStatut[0]"
          >
            <v-text-field
              label="Statut"
              :value="allStatutEtu"
              outlined
              readonly
            />
          </v-col>
        </v-row>

        <!-- Switch pour déterminer si l'étudiant est à surveiller -->
        <v-switch
          v-model="student.a_surveiller"
          color="red"
          hide-details
          label="À rencontrer"
          :disabled="student.a_surveiller === undefined"
          :loading="flag_loading"
          @change="setFlag"
        />
      </v-card-text>
    </v-card>

    <v-expansion-panels
      v-if="
        (student.TA_EtudiantPaysStatut &&
          student.TA_EtudiantPaysStatut.length) ||
        student.FormulaireMath
      "
      class="mb-5"
      multiple
      flat
    >
      <!--
        ************************************************
        Informations de l'étudiant à l'international
        ************************************************ 
      -->
      <v-expansion-panel
        v-if="
          student.TA_EtudiantPaysStatut && student.TA_EtudiantPaysStatut.length
        "
      >
        <v-expansion-panel-header class="outlined">
          <h3>Informations de l'étudiant à l'international</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="outlined">
          <v-row no-gutters class="mt-10">
            <!-- Statut -->
            <v-col class="px-3" sm="6" cols="12">
              <v-text-field
                label="Statut"
                :value="student.TA_EtudiantPaysStatut[0].statut.nom"
                outlined
                readonly
              />
            </v-col>
            <!-- Pays d'origine -->
            <v-col class="px-3" sm="6" cols="12">
              <v-text-field
                label="Pays d'origine"
                :value="student.TA_EtudiantPaysStatut[0].pays.nom"
                outlined
                readonly
              />
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
            <!-- Heure de début du questionnaire -->
            <v-col class="px-3">
              <v-text-field
                label="Heure de début du questionnaire"
                :value="formattedDate(student.FormulaireMath[0].heure_debut)"
                outlined
                readonly
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <!-- Effort fourni -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea
                label="Effort fourni"
                :value="student.FormulaireMath[0].effort_fourni"
                outlined
                readonly
                no-resize
              />
            </v-col>

            <!-- Expérience en informatique -->
            <v-col class="px-3" sm="6" cols="12">
              <v-textarea
                label="Expérience en informatique"
                :value="student.FormulaireMath[0].experience_informatique"
                outlined
                readonly
                no-resize
              />
            </v-col>
          </v-row>

          <!-- Cours de mathématiques suivis -->

          <h4 class="d-flex justify-center mb-6">
            Cours de mathématiques de l'étudiant
          </h4>

          <div
            v-for="(ta_math, i) in student.FormulaireMath[0].TA_Math"
            :key="ta_math.id"
          >
            <v-row no-gutters>
              <!-- Nom du cours de math -->
              <v-col class="px-3" md="4" cols="12">
                <v-text-field
                  label="Cours"
                  :value="ta_math.cours_math.nom"
                  outlined
                  readonly
                />
              </v-col>

              <!-- Note de l'étudiant dans le cours -->
              <v-col class="px-3" md="4" cols="12">
                <v-text-field
                  label="Note de l'étudiant"
                  :value="ta_math.note_obtenue"
                  outlined
                  readonly
                />
              </v-col>

              <!-- Année durant laquelle l'étudiant a suivi le cours -->
              <v-col class="px-3" md="4" cols="12">
                <v-text-field
                  label="Année"
                  :value="'Secondaire ' + ta_math.cours_math.annee"
                  outlined
                  readonly
                />
              </v-col>
            </v-row>
            <v-divider
              v-if="i < student.FormulaireMath[0].TA_Math.length - 1"
              :key="i"
              class="mb-7"
            ></v-divider>
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
            <v-tab-item v-for="semester in semesters" :key="semester.code">
              <!-- Ajouter un commentaire -->
              <v-btn
                block
                color="primary my-3"
                @click="show_add_comment = !show_add_comment"
              >
                Ajouter un commentaire
              </v-btn>
              <v-comment-input
                :show="show_add_comment"
                :no-etudiant="student.no_etudiant"
                :remark-codes="remark_codes"
                :code-session="semester.code"
                method="publish"
                @cancel="show_add_comment = false"
                @published="getData"
              />

              <!-- Commentaires de la session -->
              <h4 class="d-flex justify-center my-4">
                Commentaires de la session
              </h4>
              <v-card class="px-5" outlined>
                <!-- Message si l'étudiant n'a aucun commentaire dans la session -->
                <h4
                  v-if="semester.comments.length === 0"
                  class="my-5 grey--text"
                >
                  L'étudiant n'a aucun commentaire sur cette session!
                </h4>

                <v-comment-list
                  :data="semester.comments"
                  :remark-codes="remark_codes"
                  :editable-if="(c) => c.employe.no_employe === no_employe"
                  @update-data="getData"
                />
              </v-card>
              <!-- Commentaires d'un cours -->
              <h4 class="d-flex justify-center my-4">
                Commentaires sur les cours de l'étudiant
              </h4>

              <!-- Cours de la session -->
              <v-course-list
                :data="semester.student_groups"
                :remark-codes="remark_codes"
                @update-data="getData"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import API from "@/api";
import CourseList from "@/components/CourseList";
import CommentInput from "@/components/CommentInput";
import CommentList from "@/components/CommentList";

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
      flag_loading: false,
    };
  },
  async created() {
    // Get student data from BD
    await this.getData();

    // Get user employe id
    this.no_employe = JSON.parse(
      sessionStorage.getItem("authentication")
    ).user.employe.no_employe;
  },
  methods: {
    async getData(
      no_student = this.student.no_etudiant || this.$route.params.id
    ) {
      // Get student info
      this.student = await API.getStudentFormInfo(no_student);

      // Get all remark codes
      this.remark_codes = await API.getRemarkCode();

      // Get all semesters the student is in
      let duplicate_semesters = this.student.TA_EtudiantGroupe.map(
        (x) => x.groupe.session
      );

    const unique_semesters = [];

    for (let i = 0; i < duplicate_semesters.length; i++) {
      if (!unique_semesters.find((semester) => duplicate_semesters[i].code === semester.code)) {
        const new_semester = duplicate_semesters[i];
        new_semester.student_groups = this.student.TA_EtudiantGroupe.filter((g) => g.groupe.id_session === duplicate_semesters[i].id);
        new_semester.comments = this.student.semester_comments.filter((comment) => comment.groupe.id_session === duplicate_semesters[i].id);
        unique_semesters.push(new_semester);
      }
    }

    this.semesters = unique_semesters;

    
  },
    async gotoPreviousStudent() {
      // Get previous student info
      this.loading = true;

      const formData = new FormData();
      formData.append(
        "sessions",
        JSON.parse(sessionStorage.getItem("authentication")).user.sessions
      );

      const previousStudent = await API.getPreviousStudentBySessions(
        this.student.no_etudiant,
        formData
      );

      if (this.student.no_etudiant === previousStudent[0].no_etudiant) {
        this.loading = false;
        return;
      }

      await this.getData(previousStudent[0].no_etudiant);
      this.$router.push({
        name: "student_form",
        params: { id: this.student.no_etudiant },
      });
      this.loading = false;
    },
    async gotoNextStudent() {
      // Get next student info
      this.loading = true;

      const formData = new FormData();
      formData.append(
        "sessions",
        JSON.parse(sessionStorage.getItem("authentication")).user.sessions
      );

      const nextStudent = await API.getNextStudentBySessions(
        this.student.no_etudiant,
        formData
      );

      if (this.student.no_etudiant === nextStudent[0].no_etudiant) {
        this.loading = false;
        return;
      }

      await this.getData(nextStudent[0].no_etudiant);

      await this.$router.push({
        name: "student_form",
        params: { id: this.student.no_etudiant },
      });
      this.loading = false;
    },
    async setFlag() {
      this.flag_loading = true;
      await API.flagStudent(
        this.student.no_etudiant,
        this.student.a_surveiller
      );
      this.flag_loading = false;
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
  computed: {
    amountClassesInDifficulty() {
      return this.student.TA_EtudiantGroupe
        ? this.student.TA_EtudiantGroupe.filter(
            (g) =>
              g.pourcentage_note_cumulee &&
              g.note_ponderee / g.pourcentage_note_cumulee < 0.6
          ).length
        : 0;
    },
    allStatutEtu() {
      let statut = "";
      this.student.TA_EtuStatut.forEach((etudiant) => {
        if (statut !== "") {
          statut += ", ";
        }
        statut += etudiant.statut_etudiant.code;
      });
      return statut;
    },
  },
  components: {
    "v-course-list": CourseList,
    "v-comment-list": CommentList,
    "v-comment-input": CommentInput,
  },
};
</script>
