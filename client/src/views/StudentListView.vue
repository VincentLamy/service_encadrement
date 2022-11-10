<template>
  <v-container>
    <h2>Liste des étudiants</h2>

    <h3 id="filter" @click="filter = !filter">Filtrer</h3>
    <v-container v-if="filter">
      <v-row no-gutters>
        <v-col>
          <v-checkbox v-model="hasStudentCode" label="A un statut etudiant">
          </v-checkbox>
          <v-checkbox v-model="hasComments" label="A des commentaires">
          </v-checkbox>
        </v-col>

        <v-text-field
          v-model="nbClassesInDifficulty"
          type="number"
          label="Cours en difficulté"
          min="0"
        ></v-text-field>
      </v-row>
    </v-container>

    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Rechercher"
    ></v-text-field>
    <v-data-table
      id="list_student"
      :headers="headers"
      :items="students"
      :sort-desc="[false, true]"
      class="elevation-1"
      @click:row="rowClick"
      :search="search"
    >
      <!-- <template v-slot:header.student_critical_state>
          <v-icon color="red">mdi-alert-circle</v-icon>
        </template> -->
    </v-data-table>
  </v-container>
</template>

<script>
import API from "../api";

export default {
  name: "student_list",
  data() {
    return {
      headers: [
        // { text: '',                               value: 'critical_state(student_critical_state)'},
        { text: "Numéro étudiant", value: "no_etudiant" },
        { text: "Nom complet", value: "nom" },
        {
          text: "Statut étudiant",
          value: "TA_EtuStatut[0].statut_etudiant.code",
          filter: (value) => {
            if (this.hasStudentCode) {
              if (!value) return false;
              return true;
            }
            return true;
          },
        },
        {
          text: "Quantité de commentaires",
          value: "commentary_quantity",
          filter: (value) => {
            if (this.hasComments) {
              if (!value) return false;
              return true;
            }
            return true;
          },
        },
        {
          text: "Nombre de cours en difficulté",
          value: "critical_course_quantity",
          filter: (value) => {
            return value >= this.nbClassesInDifficulty;
          },
        },
      ],
      students: [],
      model: null,
      search: "",
      filter: false,
      // Filters
      hasStudentCode: "",
      hasComments: "",
      nbClassesInDifficulty: 0,
    };
  },
  async created() {
    const response = await API.getAllStudent(
      JSON.parse(sessionStorage.getItem("authentication")).token
    );
    this.students = response;

    for (let index = 0; index < this.students.length; index++) {
      this.students[index].nom =
        this.students[index].nom + ", " + this.students[index].prenom;
      this.students[index].critical_course_quantity =
        this.amountClassesInDifficulty(index);

      // if(this.students[index].critical_course_quantity > 0){
      //   document.getElementById("list_student").style.color = "red";
      // }
      // else {
      //   this.students[index].student_critical_state = false;
      // }
    }
  },
  methods: {
    rowClick(item) {
      this.$router.push({
        name: "student_form",
        params: { id: item.no_etudiant },
      });
    },
    searchClick(item) {
      const no_etudant = item.slice(item.lastIndexOf(" "));
      this.$router.push({ name: "student_form", params: { id: no_etudant } });
    },
    amountClassesInDifficulty(index) {
      let amount = 0;

      this.students[index].TA_EtudiantGroupe.forEach((note) => {
        if (note.note_ponderee / note.pourcentage_note_cumulee < 0.6) {
          amount++;
        }
      });
      return amount;
    },
  },
};
</script>
