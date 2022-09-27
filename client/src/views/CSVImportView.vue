<template>
  <v-container>
    <v-col class="text-center">
      <!-- Rapport d'encadrement -->
      <v-btn 
        color="primary" 
        class="ma-2"
        dark 
        :loading="isSelecting" 
        @click="handleFileImport"
      >
        Télécharger Rapport d'encadrement
      </v-btn>

      <!-- File input for Rapport d'encadrement -->
      <input 
        ref="uploader" 
        class="d-none" 
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="rapportEncadrement"
      >

    </v-col>
    <v-col class="text-center">
      <!-- Sondage mathématiques -->
      <v-btn 
        color="primary" 
        class="ma-2"
        dark 
        :loading="isSelecting" 
        @click="handleFileImport"
      >
        Télécharger Sondage mathématiques
      </v-btn>

      <!-- File input for Sondage mathématiques -->
      <input 
        ref="uploader" 
        class="d-none" 
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="sondageMathematiques"
      >
    </v-col>
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
        handleFileImport() {
          this.isSelecting = true;

          // After obtaining the focus when closing the FilePicker, return the button state to normal
          window.addEventListener('focus', () => {
              this.isSelecting = false
          }, { once: true });
          
          // Trigger click on the FileInput
          this.$refs.uploader.click();
        },
        rapportEncadrement(e) {
          this.selectedFile = e.target.files[0];
          let reader = new FileReader();
          
          // To Array
          /*
          reader.addEventListener("loadend", async () => {
            let data = reader.result.split("\r\n");
            for (let i in data) {
              data[i] = data[i].split(";");
            }
            const response = await API.addRapportEncadrement(data);
            this.$router.push({ name:'home', params: {message: response.message} });
          });
          */

          // To Object
          
          reader.addEventListener("loadend", async () => {
            let temp = reader.result.split("\r\n");
            for (let i in temp) {
              temp[i] = temp[i].split(";");
            }

            let data = {};
            for (let i in temp[0]) {
              data[temp[0][i]] = [];
              for (let j=1; j<temp.length; j++) {
                data[temp[0][i]].push(temp[j][i]);
              }
            }
            const response = await API.addRapportEncadrement(data);
            this.$router.push({ name:'home', params: {message: response.message} });
          });
          reader.readAsText(this.selectedFile);
        },
        sondageMathematiques(e) {
          console.log("Sondage mathématiques");
          this.$router.push({ name:'home', params: {} });
        },
      }
  }
</script>