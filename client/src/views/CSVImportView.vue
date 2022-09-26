<template>
  <div>
      <!-- 1. Create the button that will be clicked to select a file -->
      <v-btn 
          color="primary" 
          rounded 
          dark 
          :loading="isSelecting" 
          @click="handleFileImport"
      >
          Upload File
      </v-btn>

      <!-- Create a File Input that will be hidden but triggered with JavaScript -->
      <input 
          ref="uploader" 
          class="d-none" 
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="onFileChanged"
      >
  </div>
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
        onFileChanged(e) {
          this.selectedFile = e.target.files[0];
          let reader = new FileReader();
          
          // To Array
          /*
          reader.addEventListener("loadend", () => {
            let data = reader.result.split("\r\n");
            for (let i in data) {
              data[i] = data[i].split(";");
            }
            const response = API.addRapportEncadrement(data);
            this.$router.push({ name:'home', params: {message: response.message} });
          });
          */
          // To Object
          
          reader.addEventListener("loadend", () => {
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
            const response = API.addRapportEncadrement(data);
            this.$router.push({ name:'home', params: {message: response.message} });
          });
          
          reader.readAsText(this.selectedFile);
        },
      }
  }
</script>