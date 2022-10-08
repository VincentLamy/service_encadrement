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
          // var XLSX = require("xlsx");

          // e.target.files[0].arrayBuffer().then((res) => {
          //   let data = new Uint8Array(res);
          //   let workbook = XLSX.read(data, {type:"array"});
          //   let first_sheet_name = workbook.SheetNames[0];
          //   let worksheet = workbook.Sheets[first_sheet_name]

          //   let jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          //   let json = jsonData.map((x) => ({
          //     ...x
          //   }));

          //   let fileNameWitoutExtension = e.target.files[0].name.substring(0, e.target.files[0].name.lastIndexOf("."));
            
          //   let new_worksheet = XLSX.utils.json_to_sheet(json);
          //   let new_workbook = XLSX.utils.book_new();
            
          //   XLSX.utils.book_append_sheet(new_workbook, new_worksheet, "CSV_Sheet");

          //   XLSX.writeFile(new_workbook, fileNameWitoutExtension + ".csv");
          // });
        
          // const csv=require('csvtojson')

          this.selectedFile = e.target.files[0];
          let reader = new FileReader();
            
          // To Object
          reader.addEventListener("loadend", async () => {
            let temp = reader.result.split("\r\n");

            for (let i in temp) {
              temp[i] = temp[i].split(/;(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
            }

            let data = {};
            for (let i in temp[0]) {
              data[temp[0][i]] = [];
              for (let j=1; j<temp.length; j++) {
                data[temp[0][i]].push(temp[j][i]);
              }
            }

            // Rapport encadrement
            if (e.target.id === "rapport_encadrement") {
              const response = API.addRapportEncadrement(data);
              this.$router.push({ name:'home', params: {message: response.message} });
            } 
            // Sondage mathématiques
            else if (e.target.id === "sondage_mathematiques") {
              const response = API.addSondageMathematiques(data);
              this.$router.push({ name:'home', params: {message: response.message} });
            }
          });

          reader.readAsText(this.selectedFile);
        }
      },
    }
  // }
</script>