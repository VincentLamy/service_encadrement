<template>
  <v-container>
    <h2 style="color: #FC8D33" class="mb-5">Exportation des données</h2>
    <v-card>
      <v-col class="text-center">
        <p style="color: black" class="body-1 mt-7">Exporte un fichier en CSV.</p>
      </v-col>

      <v-col class="text-center">
        <!-- Button for Rapport d'encadrement -->
        <v-btn color="primary" dark :loading="isSelecting" @click="onExportRapportEncadrement" v-if="!loading">
          Exporter Rapport d'encadrement
        </v-btn>
      </v-col>

      <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="deep-purple accent-4">
      </v-progress-linear>
    </v-card>
  </v-container>
</template>

<script>
import API from '../api';

export default {
  name: 'CSVExport',
  data() {
    return {
      isSelecting: false,
      loading: false,
    }
  },
  methods: {
    convertToCSV(arr) {
      const array = [Object.keys(arr[0])].concat(arr);

      return array.map(it => {
        return Object.values(it).toString();
      }).join('\n');
    },
    async onExportRapportEncadrement(e) {
      this.loading = true;

      // Exportation
      const reportAsJSON = await API.exportRapportEncadrement();
      const reportAsCSV = this.convertToCSV(reportAsJSON);

      const url = window.URL.createObjectURL(new Blob([reportAsCSV]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rapport_encadrement.csv');
      document.body.appendChild(link);
      link.click();
    },
  },
}
</script>