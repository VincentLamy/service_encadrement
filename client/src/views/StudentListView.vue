<template>
  <v-container>
    <h2>Liste des étudiants</h2>

    <h3 id="filter" @click="filter = !filter">Filtrer</h3>
    <v-container v-if="filter">
      <v-row no-gutters>
        <v-col>
          <v-checkbox v-model="hasToBeChecked" label="À recontrer">
          </v-checkbox>
          <v-checkbox v-model="hasStudentCode" label="A un statut etudiant">
          </v-checkbox>
        </v-col>

        <v-col>
          <v-checkbox v-model="hasComments" label="A des commentaires">
          </v-checkbox>
          <v-text-field
            v-model="nbClassesInDifficulty"
            type="number"
            label="Cours en difficulté"
            min="0"
          ></v-text-field>
        </v-col>
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
        {
          text: "À rencontrer",
          value: "a_surveiller",
          filter: (value) => {
            if (this.hasToBeChecked) {
              if (!value) return false;
              return true;
            }
            return true;
          },
        },
        { text: "Numéro étudiant", value: "no_etudiant" },
        { text: "Nom complet", value: "nom" },
        {
          text: "Statut étudiant",
          value: "TA_EtuStatut.statut_etudiant",
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
      hasToBeChecked: false,
      nbClassesInDifficulty: 0,
      sessions: null,
    };
  },
  async created() {
    this.sessions = JSON.parse(sessionStorage.getItem("authentication"))
      .user.sessions.split(",")
      .map(Number);

    if (!this.sessions) return;

    for (let i = 0; i < this.sessions.length; i++) {
      this.students.push(await API.getStudentsBySession(this.sessions[i]));
    }

    this.students = this.students.flat();

    for (let index = 0; index < this.students.length; index++) {
      this.students[index].nom =
        this.students[index].nom + ", " + this.students[index].prenom;
      this.students[index].critical_course_quantity =
        this.amountClassesInDifficulty(index);

      if (this.students[index].a_surveiller == false) {
        this.students[index].a_surveiller = "";
      } else {
        this.students[index].a_surveiller = "✔";
      }

      this.students[index].TA_EtuStatut.statut_etudiant =
        this.allStatutEtu(index);
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
    allStatutEtu(index) {
      let statut = "";

      this.students[index].TA_EtuStatut.forEach((etudiant) => {
        if (statut !== "") {
          statut += ", ";
        }
        statut += etudiant.statut_etudiant.code;
      });
      return statut;
    },
  },
};
</script>

<style>
#list_student td.text-start:first-child {
  text-align: center !important;
}
</style>
