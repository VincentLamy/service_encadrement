<template>
    <v-container>
  
        <h2>Liste des responsables</h2>
  
        <v-data-table
        id="list_student"
        :headers="headers"
        :items="supervisor"
        :sort-desc="[false, true]"
        class="elevation-1"
        @click:row="rowClick"
        >
          <!-- <template v-slot:header.student_critical_state>
            <v-icon color="red">mdi-alert-circle</v-icon>
          </template> -->
      </v-data-table>
      <v-btn 
          class=mt-2
          color="primary" 
          dark 
          @click="addSupervisor()"
        >
          Ajouter un responsable d'encadrement
        </v-btn>
    </v-container>
  </template>
    
<script>
import API from '../api';

export default {
  name: "supervisor_list",
  data() {
    return {
      headers: [
        { text: 'Adresse courriel', value: 'courriel' },
        { text: 'Nom complet', value: 'employe' },
        { text: 'Actif', value: 'actif' },
        { text: 'Date d\'activation', value: 'date_activation' },
        { text: 'Date de désactivation', value: 'date_desactivation' }
      ],
      supervisor: []
    };
  },
  async created() {
    const response = await API.getAllSupervisor();
    this.supervisor = response;

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    

    for (let index = 0; index < this.supervisor.length; index++) {

        if (this.supervisor[index].date_activation !== this.supervisor[index].date_desactivation) {
          this.supervisor[index].date_activation = new Date(this.supervisor[index].date_activation);
          this.supervisor[index].date_activation.setDate(this.supervisor[index].date_activation.getDate());
          this.supervisor[index].date_activation = this.supervisor[index].date_activation.toLocaleDateString("fr-CA", options);

          this.supervisor[index].date_desactivation = new Date(this.supervisor[index].date_desactivation);
          this.supervisor[index].date_desactivation.setDate(this.supervisor[index].date_desactivation.getDate());
          this.supervisor[index].date_desactivation = this.supervisor[index].date_desactivation.toLocaleDateString("fr-CA", options);
        }
        else {

          if (this.supervisor[index].date_activation === this.supervisor[index].date_desactivation && this.supervisor[index].actif === false) {
            this.supervisor[index].date_activation = "Non applicable";
          } else {
            this.supervisor[index].date_activation = new Date(this.supervisor[index].date_activation);
            this.supervisor[index].date_activation.setDate(this.supervisor[index].date_activation.getDate());
            this.supervisor[index].date_activation = this.supervisor[index].date_activation.toLocaleDateString("fr-CA", options);
          }

          this.supervisor[index].date_desactivation = "Non applicable";
        }

        if (this.supervisor[index].actif === true) {
            this.supervisor[index].actif = "Oui"
        } else {
            this.supervisor[index].actif = "Non"
        };

        this.supervisor[index].employe = this.supervisor[index].employe.nom + ", " + this.supervisor[index].employe.prenom;

    }
  },
            
  methods: {
    rowClick(item, row) {
    this.$router.push({ name: 'supervisor_form', params: { id: item.id } });
      },
    addSupervisor() {
      this.$router.push({ name: 'add_supervisor' });
    },
  },
}

</script>
