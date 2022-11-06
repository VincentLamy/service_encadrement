import axios from "axios";
const url = "/api";

export default class API {
  // To insert a rapport d'encadrement
  static async addRapportEncadrement(rapportEncadrement) {
    try {
      const res = await axios.post(
        `${url}/rapportEncadrement`,
        rapportEncadrement
      );
      return res.data;
    } catch (err) {
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
      const res = await axios.post(
        `${url}/sondageMathematiques`,
        sondageMathematiques
      );
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // To insert a étudiants internationaux list
  static async addEtudiantsInternationaux(etudiantsInternationaux) {
    try {
      const res = await axios.post(
        `${url}/etudiantsInternationaux`,
        etudiantsInternationaux
      );
      return res.data;
    } catch (err) {
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

  // Gets all responsable
  static async getAllSupervisor() {
    const res = await axios.get(`${url}/supervisor_list`);
    return res.data;
  }

  // Gets supervisor form info by ID
  static async getSupervisorFormInfo(id) {
    try {
      const res = await axios.get(`${url}/supervisor_form/${id}`)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // to insert Supervisor into database
  static async addSupervisor(data) {
    const res = await axios.post(`${url}/add_supervisor/`, data);
    return res.data;
  }

  // Updates supervisor form info by ID
  static async updateSupervisorFormInfo(id, post) {
    try {
      const res = await axios.patch(`${url}/supervisor_form/${id}`, post)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

<<<<<<< HEAD
  // Vérifie si l'utilisateur existe.
  static async getUser(username, password) {
    const res = await axios.post(`${url}/get_user`, { "username": username, "password": password });
    return res.data;
  }
}
=======
  // Gets previous supervisor by ID
  static async getPreviousSupervisor(id, post) {
    try {
      const res = await axios.get(`${url}/previous_supervisor_form/${id}`, post)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Gets next supervisor by ID
  static async getNextSupervisor(id, post) {
    try {
      const res = await axios.get(`${url}/next_supervisor_form/${id}`, post)
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
    } catch (err) {
      return err;
    }
  }

  // Add comment
  static async addComment(comment) {
    try {
      const res = await axios.post(`${url}/addComment`, comment);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Edit comment
  static async editComment(comment) {
    try {
      const res = await axios.patch(`${url}/editComment`, comment);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Get all remark codes
  static async getRemarkCode() {
    try {
      const res = await axios.get(`${url}/getRemarkCodes`);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets previous supervisor by numero etudiant
  static async getPreviousStudent(numero_etudiant) {
    try {
      const res = await axios.get(`${url}/previous_student_form/${numero_etudiant}`);
      return res.data;
    } catch (err) {
      return err;
    }
  }


  // Gets next supervisor by numero etudiant
  static async getNextStudent(numero_etudiant) {
    try {
      const res = await axios.get(`${url}/next_student_form/${numero_etudiant}`);
      return res.data;
    } catch (err) {
      return err;
    }
  }
}
>>>>>>> main
