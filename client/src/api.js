import axios from 'axios';
const url = '/api';

export default class API {
  // To insert a rapport d'encadrement
  static async addRapportEncadrement(rapportEncadrement) {
    const res = await axios.post(`${url}/rapportEncadrement`, rapportEncadrement);
    return res.data;
  }

  // To insert a sondage mathematiques
  static async addSondageMathematiques(sondageMathematiques) {
    const res = await axios.post(`${url}/sondageMathematiques`, sondageMathematiques);
    return res.data;
  }
  
  // Gets all students
  static async getAllStudent() {
    const res = await axios.get(`${url}/student_list`);
    return res.data;
  }

  // Gets student form info by ID
  static async getStudentFormInfo(no_etudiant) {
    const res = await axios.get(`${url}/student_form/${no_etudiant}`)
    return res.data;
  }
}