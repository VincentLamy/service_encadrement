<template>
  <v-container>
    <h2 style="color: #FC8D33" class="mb-5">Exportation des données</h2>
    <v-card>
      <v-col class="text-center">
        <p style="color: black" class="body-1 mt-7">Seulement les fichiers Excel ou CSV sont acceptés.</p>
      </v-col>

      <v-col class="text-center">
        <!-- Button for Rapport d'encadrement -->
        <v-btn color="primary" dark :loading="isSelecting" @click="handleFileImport('rapport_encadrement')"
          v-if="!loading">
          Importer Rapport d'encadrement
        </v-btn>
      </v-col>

      <v-col class="text-center">
        <!-- Button for Sondage mathématiques -->
        <v-btn color="primary" dark id :loading="isSelecting" @click="handleFileImport('sondage_mathematiques')"
          v-if="!loading">
          Importer Sondage mathématiques
        </v-btn>
      </v-col>

      <v-col class="text-center">
        <!-- Button for Etudiants Internationaux -->
        <v-btn color="primary" dark id :loading="isSelecting" @click="handleFileImport('etudiants_internationaux')"
          v-if="!loading">
          Importer Liste étudiants internationaux
        </v-btn>
      </v-col>

      <!-- File input for all buttons -->
      <input ref="uploader" class="d-none" type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="onFileChanged">

      <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="deep-purple accent-4">
      </v-progress-linear>
    </v-card>
  </v-container>
</template>

<script>
import API from '../api';

export default {
  name: 'CSVImport',
  data() {
    return {
      isSelecting: false,
      selectedFile: null,
      loading: false
    }
  },
  mounted() {
    let script = document.createElement('script');
    script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.2/xlsx.js');
    document.head.appendChild(script);
  },
  methods: {
    handleFileImport(button) {
      this.isSelecting = true;

      // After obtaining the focus when closing the FilePicker, return the button state to normal
      window.addEventListener('focus', () => {
        this.isSelecting = false
      }, { once: true });

      // Trigger click on the FileInput
      this.$refs.uploader.click();

      // Differentiate which button has been clicked
      this.$refs.uploader.id = button;
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      this.loading = true;

      let reader = new FileReader();

      reader.onload = (function (id, outsideRouter) {
        const button_id = id;
        const router = outsideRouter;

        return function (e) {
          var data = e.target.result;
          var workbook = XLSX.read(data, {
            type: 'binary'
          });

          workbook.SheetNames.forEach(async function (sheetName) {
            // File to object
            var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

            // Rapport encadrement
            if (button_id === "rapport_encadrement") {
              const response = await API.addRapportEncadrement(XL_row_object);
              router.push({ name: 'home', params: { response: response } });
            }
            // Sondage mathématiques
            else if (button_id === "sondage_mathematiques") {
              const response = await API.addSondageMathematiques(XL_row_object);
              router.push({ name: 'home', params: { response: response } });
            }
            // Etudiants internationaux
            else if (button_id === "etudiants_internationaux") {
              const response = await API.addEtudiantsInternationaux(XL_row_object);
              router.push({ name: 'home', params: { response: response } });
            }
          })
        };
      })(e.target.id, this.$router);

      reader.readAsBinaryString(this.selectedFile);
    },
  },
}
</script>