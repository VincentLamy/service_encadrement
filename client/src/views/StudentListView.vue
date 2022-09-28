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

        <template v-slot:body="{ items }">
          <tr v-for="item in items" :key="item.student_number" v-on:click="rowClick(item.student_number)">
            <td v-if="item.critical_course_quantity > 3">
              <v-icon color="red">mdi-alert-circle</v-icon>
              {{ change_critical_state_value(item) }}
            </td>
            <td v-else>
              <v-icon></v-icon>
            </td>
            <td>{{ item.student_number }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.statut }}</td>
            <td>{{ item.commentary_quantity }}</td>
            <td>{{ item.critical_course_quantity }}</td>
          </tr>
        </template>
    </v-data-table>
  </v-container>
</template>
  
<script>
    export default {
      data () {
        return {
          headers: [
            { text: '', value: 'student_critical_state'},
            { text: 'Numéro étudiant', value: 'student_number' },
            { text: 'Nom complet', value: 'name' },
            { text: 'Statut étudiant', value: 'statut' },
            { text: 'Quantité de commentaires', value: 'commentary_quantity' },
            { text: 'Nombre de cours en difficulté', value: 'critical_course_quantity' }
          ],
          students: [ // TODO modifier pour aller chercher les étudiants dans la BD
            {
              student_critical_state: '',
              student_number: '202045777',
              name: 'Vincent Lamy',
              statut: 'Services adaptés',
              commentary_quantity: '2',
              critical_course_quantity: '3',
            },
            { 
              student_critical_state: '',
              student_number: '0000000',
              name: 'Vincent Deux',
              statut: 'Sous Contrat',
              commentary_quantity: '2',
              critical_course_quantity: '12',
            }
          ]
        }
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