import axios from 'axios';
const url = '/api';

export default class API {
  // To get a student by Id
  static async getStudentById(no_etudiant) {
    const res = await axios.get(`${url}/getStudent/${no_etudiant}`);
    return res.data;
  }

  static async getCommentsByStudentId(no_etudiant) {
    const res = await axios.get(`${url}/getComment/${no_etudiant}`);
    return res.data;
  }

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
}