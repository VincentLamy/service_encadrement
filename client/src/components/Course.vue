<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="outlined">
      <v-container class="pa-0 pe-3">
        <div
          class="d-flex flex-md-row flex-column justify-space-between col-12 pa-0"
        >
          <!-- Course name + code -->
          <div class="d-flex flex-column col-md">
            <div class="font-weight-bold">
              <span>
                <!-- Modify course name -->
                <v-course-name-input
                  :data="data.groupe.cours"
                  @updated="updateData"
                />
              </span>
              ({{ data.groupe.cours.code }})
            </div>
            <div>Groupe : {{ data.groupe.no_groupe }}</div>
          </div>
          <!-- Course duration (h) + Total absence (h) -->
          <div class="d-flex flex-column col-md">
            <div>Durée : {{ data.groupe.cours.duree }}</div>
            <div>Durée absence : {{ data.duree_absence }}</div>
          </div>
          <!-- Campus -->
          <div class="d-flex flex-column col-md">
            <div>
              Campus :
              {{ data.groupe.cours.campus.ville }}
            </div>
          </div>
        </div>
        <v-divider></v-divider>
        <div
          class="d-flex flex-md-row flex-column justify-space-between col-12 pa-0"
        >
          <!-- Weighted grade -->
          <div class="d-flex flex-column col-md">
            <div>Note pondérée : {{ data.note_ponderee }}</div>
          </div>
          <!-- Cumulated grade -->
          <div class="d-flex flex-column col-md">
            <div>
              Pourcentage note cumulée :
              {{ data.pourcentage_note_cumulee }}
            </div>
          </div>
          <!-- Final grade remark -->
          <div class="d-flex flex-column col-md">
            <div>
              Remarque note finale :
              {{ data.code_remarque_note_finale.nom }}
            </div>
          </div>
        </div>
      </v-container>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="outlined">
      <!-- Message si aucun commentaire n'est associé au cours -->
      <h4 v-if="data.groupe.Commentaire.length === 0" class="mt-5 grey--text">
        L'étudiant n'a aucun commentaire sur ce cours!
      </h4>

      <!-- Commentaires du cours -->
      <v-comment-list
        :data="data.groupe.Commentaire"
        :remark-codes="remarkCodes"
        @update-data="updateData"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import CourseNameInput from "@/components/CourseNameInput";
import CommentList from "@/components/CommentList";

export default {
  name: "v-course",
  props: {
    data: {
      type: Object,
    },
    remarkCodes: {
      type: Array,
    },
  },
  methods: {
    updateData() {
      this.$emit("update-data");
    },
  },
  components: {
    "v-course-name-input": CourseNameInput,
    "v-comment-list": CommentList,
  },
};
</script>
