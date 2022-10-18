<template>
  <v-container>
    <h2>Liste des étudiants</h2>

    <v-data-table id="list_student" :headers="headers" :items="students" :sort-desc="[false, true]" class="elevation-1"
      @click:row="rowClick">
      <!-- <template v-slot:header.student_critical_state>
          <v-icon color="red">mdi-alert-circle</v-icon>
        </template> -->
    </v-data-table>
  </v-container>
</template>
  
<script>
import API from '../api';

export default {
  name: "student_list",
  data() {
    return {
      headers: [
        // { text: '',                               value: 'critical_state(student_critical_state)'},
        { text: 'Numéro étudiant', value: 'no_etudiant' },
        { text: 'Nom complet', value: 'nom' },
        { text: 'Statut étudiant', value: 'TA_EtuStatut[0].statut_etudiant.code' },
        { text: 'Quantité de commentaires', value: 'commentary_quantity' },
        { text: 'Nombre de cours en difficulté', value: 'critical_course_quantity' }
      ],
      students: []
    };
  },
  async created() {
    const response = await API.getAllStudent();
    this.students = response;

    for (let index = 0; index < this.students.length; index++) {
      let critical_course_quantity = 0;

      this.students[index].nom = this.students[index].nom + ", " + this.students[index].prenom;

      for (let index2 = 0; index2 < this.students[index].TA_EtudiantGroupe; index2++) {
        if (this.students[index].TA_EtudiantGroupe[index2].note_ponderee / this.students[index].TA_EtudiantGroupe[index2].pourcentage_note_cumulee < 0.6) {
          critical_course_quantity++;
        }
      }

      this.students[index].critical_course_quantity = critical_course_quantity;

      // if(this.students[index].critical_course_quantity > 0){
      //   document.getElementById("list_student").style.color = "red";
      // }
      // else {
      //   this.students[index].student_critical_state = false;
      // }
    }

    console.log(this.students);
  },
  methods: {
    rowClick(item, row) {
      this.$router.push({ name: 'student_form', params: { id: item.no_etudiant } });
    }
  },
}
</script>