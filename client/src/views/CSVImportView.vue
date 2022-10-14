<template>
  <v-container>
    <h2 style="color: #FC8D33" class="mb-5">Exportation des données</h2>
    <v-card>
      <v-col class="text-center">
        <p style="color: black" class="body-1 mt-7">Seulement les fichiers Excel ou CSV sont acceptés.</p>
      </v-col>

      <v-col class="text-center">
        <!-- Button for Rapport d'encadrement -->
        <v-btn 
          color="primary" 
          dark 
          :loading="isSelecting" 
          @click="handleFileImport('rapport_encadrement')"
        >
          Importer Rapport d'encadrement
        </v-btn>
      </v-col>

      <v-col class="text-center">
        <!-- Button for Sondage mathématiques -->
        <v-btn 
          color="primary"
          dark
          id
          :loading="isSelecting"
          @click="handleFileImport('sondage_mathematiques')"
        >
          Importer Sondage mathématiques
        </v-btn>
      </v-col>
      
      <v-col class="text-center">
        <!-- Button for Etudiants Internationaux -->
        <v-btn 
          color="primary"
          dark
          id
          :loading="isSelecting"
          @click="handleFileImport('etudiants_internationaux')"
        >
          Importer Liste étudiants internationaux
        </v-btn>
      </v-col>

      <!-- File input for all buttons -->
      <input 
        ref="uploader" 
        class="d-none" 
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="onFileChanged"
      >
    </v-card>
  </v-container>
</template>

<script>
  import API from '../api';

  export default {
      name: 'CSVImport',
      data(){
          return {
              isSelecting: false,
              selectedFile: null
          }
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
          const extension = this.selectedFile.name.split('.').pop();

          let reader = new FileReader();

          // To Object
          reader.addEventListener("loadend", async () => {
            let data = {};

            if (extension === "csv" || extension === "xlsx") {
              let temp = reader.result.split("\r\n");

              for (let i in temp) {
                temp[i] = temp[i].split(/;(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
              }

              for (let i in temp[0]) {
                data[temp[0][i]] = [];
                for (let j=1; j<temp.length; j++) {
                  data[temp[0][i]].push(temp[j][i]);
                }
              }
            }

            // Rapport encadrement
            if (e.target.id === "rapport_encadrement") {
              const response = await API.addRapportEncadrement(data);
              this.$router.push({ name:'home', params: {response: response} });
            } 
            // Sondage mathématiques
            else if (e.target.id === "sondage_mathematiques") {
              const response = await API.addSondageMathematiques(data);
              this.$router.push({ name:'home', params: {response: response} });
            }
            // Etudiants internationaux
            else if (e.target.id === "etudiants_internationaux") {
              const response = await API.addEtudiantsInternationaux(data);
              this.$router.push({ name:'home', params: {response: response} });
            }
          });

          reader.readAsText(this.selectedFile);
        },
      }
  }
  
</script>