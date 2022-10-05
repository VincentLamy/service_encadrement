<template>
  <v-container>
    <!-- Titre de la page -->
      <h2>Liste des étudiants</h2>

      <!-- Liste des étudiants -->
      <v-data-table
      id="list_student"
      :headers="headers"
      :items="students"
      :sort-desc="[false, true]"
      class="elevation-1"
      @click:row="rowClick"
      >
        <template v-slot:header.student_critical_state>
          <v-icon color="red">mdi-alert-circle</v-icon>
        </template>

        <template  v-slot:item.student_critical_state>
          <td> <!-- v-if="item.critical_course_quantity > 3" -->
            <v-icon color="red">mdi-alert-circle</v-icon>
            <!-- {{ change_critical_state_value(student) }} -->
          </td>
        </template>

        <template v-slot:items >
          <tr v-for="student in students" :key="student.no_etudiant">
            <td>{{ student.no_etudiant }}</td>
            <td>{{ student.nom + ', ' + student.prenom }}</td>
            <td>{{ student.TA_EtuStatut[0].statut_etudiant.code }}</td>
            <td>{{ student.comments_quantity }}</td>
            <td>{{ student.critical_course_quantity }}</td>
          </tr>
        </template>
    </v-data-table>
  </v-container>
</template>
  
<script>
  import API from '@/api';

    export default {
      data () {
        return {
            headers: [
              { text: '',                               value: 'student_critical_state'},
              { text: 'Numéro étudiant',                value: 'no_etudiant' },
              { text: 'Nom complet',                    value: `prenom`},
              { text: 'Statut étudiant',                value: 'TA_EtuStatut[0].statut_etudiant.code' },
              { text: 'Quantité de commentaires',       value: 'commentary_quantity' },
              { text: 'Nombre de cours en difficulté',  value: 'critical_course_quantity' }
            ],
            students: []
          }
    },
    async created() {
      const response = await API.getListStudent();
      this.students = response;

      console.log(this.students);
    },
    methods: {
      rowClick(item, row) {
          let URL = `/student_form/${item.no_etudiant}`
          window.location = URL;
          window.location.href = URL;
          window.location.assign(URL);
      },
      change_critical_state_value(item) {
        if (item.student_critical_state == true) 
          item.student_critical_state == false;
        else if (item.student_critical_state == false) 
          item.student_critical_state = true;
      }
    } 
  }
  </script>