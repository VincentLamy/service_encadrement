import axios from 'axios';
const url = '/api';

export default class API {
  // To insert a rapport d'encadrement
  static async addRapportEncadrement(rapportEncadrement) {
    try {
      const res = await axios.post(`${url}/rapportEncadrement`, rapportEncadrement);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }
  
  // To insert a sondage mathematiques
  static async addSondageMathematiques(sondageMathematiques) {
    try {
      const res = await axios.post(`${url}/sondageMathematiques`, sondageMathematiques);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // To insert a étudiants internationaux list
  static async addEtudiantsInternationaux(etudiantsInternationaux) {
    try {
      const res = await axios.post(`${url}/etudiantsInternationaux`, etudiantsInternationaux);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }
  
  // Gets all students
  static async getAllStudent() {
    const res = await axios.get(`${url}/student_list`);
    return res.data;
  }

  // Gets student form info by ID
  static async getStudentFormInfo(no_etudiant) {
    try {
      const res = await axios.get(`${url}/student_form/${no_etudiant}`)
      return res.data;  
    }
    catch (err) {
      return err;
    }
  }

  // Vérifie si l'utilisateur existe.
  static async getUser(username, password) {
    const res = await axios.post(`${url}/get_user`, { "username": username, "password": password });
    return res.data;
  }
}