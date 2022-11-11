import axios from "axios";
const url = "/api";

let config;
if (sessionStorage.getItem("authentication")) {
  config = {
    headers: {
      Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("authentication")).token,
    },
  };
}

export default class API {
  // To insert a rapport d'encadrement
  static async addRapportEncadrement(rapportEncadrement) {
    try {
      const res = await axios.post(`${url}/rapportEncadrement`, rapportEncadrement, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  static async getAllStudent() {
    try {
    const res = await axios.get(`${url}/student_list`, config);
    return res.data;
    } catch (err) {
      return err;
    }
  }

  // To insert a sondage mathematiques
  static async addSondageMathematiques(sondageMathematiques) {
    try {
      const res = await axios.post(`${url}/sondageMathematiques`,sondageMathematiques, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // To insert a étudiants internationaux list
  static async addEtudiantsInternationaux(etudiantsInternationaux) {
    try {
      const res = await axios.post(`${url}/etudiantsInternationaux`,etudiantsInternationaux, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets all students
  static async getAllStudent() {
    const res = await axios.get(`${url}/student_list`, config);
    return res.data;
  }

  // Gets student form info by ID
  static async getStudentFormInfo(no_etudiant) {
    try {
      const res = await axios.get(`${url}/student_form/${no_etudiant}`, config)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Set student flag state
  static async flagStudent(no_etudiant, flagged) {
    try {
      const res = await axios.patch(`${url}/flagStudent/${no_etudiant}`, {flagged: flagged}, config);
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Gets all responsable
  static async getAllSupervisor() {
    const res = await axios.get(`${url}/supervisor_list`, config);
    return res.data;
  }

  // Gets supervisor form info by ID
  static async getSupervisorFormInfo(id) {
    try {
      const res = await axios.get(`${url}/supervisor_form/${id}`, config)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // to insert Supervisor into database
  static async addSupervisor(data) {
    const res = await axios.post(`${url}/add_supervisor/`, data, config);
    return res.data;
  }

  // Updates supervisor form info by ID
  static async updateSupervisorFormInfo(id, post) {
    try {
      const res = await axios.patch(`${url}/supervisor_form/${id}`, post, config)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Gets previous supervisor by ID
  static async getPreviousSupervisor(id) {
    try {
      const res = await axios.get(`${url}/previous_supervisor_form/${id}`, config)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Gets next supervisor by ID
  static async getNextSupervisor(id) {
    try {
      const res = await axios.get(`${url}/next_supervisor_form/${id}`, config)
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Update course name
  static async changeCourseName(course) {
    try {
      const res = await axios.patch(`${url}/changeCourseName`, course, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Add comment
  static async addComment(comment) {
    try {
      const res = await axios.post(`${url}/addComment`, comment, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Edit comment
  static async editComment(comment) {
    try {
      const res = await axios.patch(`${url}/editComment`, comment, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Get all remark codes
  static async getRemarkCode() {
    try {
      const res = await axios.get(`${url}/getRemarkCodes`, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets previous supervisor by numero etudiant
  static async getPreviousStudent(numero_etudiant) {
    try {
      const res = await axios.get(`${url}/previous_student_form/${numero_etudiant}`, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }


  // Gets next supervisor by numero etudiant
  static async getNextStudent(numero_etudiant) {
    try {
      const res = await axios.get(`${url}/next_student_form/${numero_etudiant}`, config);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Vérifie si l'utilisateur existe.
  static async login(username, password) {
    try {
      const res = await axios.post(`${url}/login`, { "username": username, "password": password });
      return res.data;
    } catch (err) {
      return err;
    }
  }
}
