<template>
  <v-container>
      <h2>Liste des étudiants</h2>

      <v-data-table
      id="list_student"
      :headers="headers"
      :items="students"
      :sort-desc="[false, true]"
      class="elevation-1"
      >
        <template v-slot:header.student_critical_state>
          <v-icon color="red">mdi-alert-circle</v-icon>
        </template>

        <!-- État critique de l'étudiant -->
        <template v-slot:item.student_critical_state>
          <tr v-for="student in students" :key="student" v-on:click="rowClick(student.no_etudiant)">
            <td> <!-- v-if="item.critical_course_quantity > 3" -->
              <v-icon color="red">mdi-alert-circle</v-icon>
              {{ change_critical_state_value(student) }}
            </td>
          </tr>
        </template>

        <!-- Emplacement du nom de l'étudiant -->
        <template v-slot:item.nom>
          <tr v-for="student in students" :key="student" v-on:click="rowClick(student.no_etudiant)">
            <td>{{ student.nom + ', ' + student.prenom }}</td>
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
              { text: 'Nom complet',                    value: 'nom' },
              { text: 'Statut étudiant',                value: 'statut' },
              { text: 'Quantité de commentaires',       value: 'commentary_quantity' },
              { text: 'Nombre de cours en difficulté',  value: 'critical_course_quantity' }
            ],
            students: []
            // : [ // TODO modifier pour aller chercher les étudiants dans la BD
              // {
              //   student_critical_state: '',
              //   student_number: '202045777',
              //   name: 'Vincent Lamy',
              //   statut: 'Services adaptés',
              //   commentary_quantity: '2',
              //   critical_course_quantity: '3',
              // },
              // { 
              //   student_critical_state: '',
              //   student_number: '0000000',
              //   name: 'Vincent Deux',
              //   statut: 'Sous Contrat',
              //   commentary_quantity: '2',
              //   critical_course_quantity: '12',
              // }
            // ]
          }
        // }

        // return {
        //     headers: [
        //       { text: '', value: 'student_critical_state'},
        //       { text: 'Numéro étudiant', value: 'no_etudiant' },
        //       { text: 'Nom complet', value: 'nom' },
        //       { text: 'Statut étudiant', value: 'statut' },
        //       { text: 'Quantité de commentaires', value: 'commentary_quantity' },
        //       { text: 'Nombre de cours en difficulté', value: 'critical_course_quantity' }
        //     ],
        //     students: [ // TODO modifier pour aller chercher les étudiants dans la BD
        //       {
        //         student_critical_state: '',
        //         no_etudiant: '202045777',
        //         nom: 'Vincent Lamy',
        //         statut: 'Services adaptés',
        //         commentary_quantity: '2',
        //         critical_course_quantity: '3',
        //       },
        //       { 
        //         student_critical_state: '',
        //         student_number: '0000000',
        //         name: 'Vincent Deux',
        //         statut: 'Sous Contrat',
        //         commentary_quantity: '2',
        //         critical_course_quantity: '12',
        //       }
        //     ]
        // }
    },
    async created() {
      const response = await API.getAllStudent();
      this.students = response;

      // console.log(this.students);
    },
    methods: {
      rowClick(student_number) {
          let URL = `/student_form/${student_number}`
          window.location = URL;
          window.location.href = URL;
          window.location.assign(URL);
      },
      change_critical_state_value(item) {
        if (item.student_critical_state == true) {
          item.student_critical_state == false;
        }else if (item.student_critical_state == false) {
          item.student_critical_state = true;
        }
      }
    } 
  }
  </script>