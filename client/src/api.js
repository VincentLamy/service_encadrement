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

  static async getAllStudent() {
    const res = await axios.get(`${url}/student_list`);
    return res.data;
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
      const res = await axios.get(`${url}/student_form/${no_etudiant}`);
      return res.data;  
    }
    catch (err) {
      return err;
    }
  }

  // Update course name
  static async changeCourseName(course) {
    try {
      const res = await axios.patch(`${url}/changeCourseName`, course);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Add comment
  static async addComment(comment) {
    try {
      const res = await axios.post(`${url}/addComment`, comment);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Edit comment
  static async editComment(comment) {
    try {
      const res = await axios.patch(`${url}/editComment`, comment);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Get all remark codes
  static async getRemarkCode() {
    try {
      const res = await axios.get(`${url}/getRemarkCodes`);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }
}