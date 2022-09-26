<template>
    <v-container>
        <h2>Liste des étudiants</h2>

        <v-data-table
        :headers="headers"
        :items="students"
        :sort-desc="[false, true]"
        multi-sort
        class="elevation-1"
        @click:row="rowClick"
        ></v-data-table>
    </v-container>
    
  </template>
  
<script>
    export default {
      data () {
        return {
          headers: [
            { text: 'Numéro étudiant', value: 'student_number' },
            { text: 'Nom complet', value: 'name' },
            { text: 'Statut étudiant', value: 'statut' },
            { text: 'Quantité de commentaires', value: 'commentary_quantity' },
            { text: 'Nombre de cours en difficulté', value: 'critical_course_quantity' }
          ],
          students: [ // TODO modifier pour aller chercher les étudiants dans la BD
            {
              student_number: '202045777',
              name: 'Vincent Lamy',
              statut: 'Services adaptés',
              commentary_quantity: '2',
              critical_course_quantity: '0',
            },
            {
              student_number: '0000000',
              name: 'Vincent Deux',
              statut: 'Sous Contrat',
              commentary_quantity: '2',
              critical_course_quantity: '0',
            }
          ]
        }
    },
    methods: {
        rowClick(item, row) {
            let URL = `/student_form/${item.student_number}`
            window.location = URL;
            window.location.href = URL;
            window.location.assign(URL);
        }
    }
}
  </script>