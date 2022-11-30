import axios from "axios";
const url = "/api";

// Returns authentification token config()()
function config() {
  if (sessionStorage.getItem("authentication")) {
    return {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(sessionStorage.getItem("authentication")).token,
      },
    };
  }
  return null;
}

export default class API {
  // To insert a single rapport d'encadrement
  static async addOneRapportEncadrement(rapportEncadrement) {
    try {
      const res = await axios.post(`${url}/oneRapportEncadrement`, rapportEncadrement, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // To insert a single sondage mathematiques
  static async addOneSondageMathematiques(sondageMathematiques) {
    try {
      const res = await axios.post(`${url}/oneSondageMathematiques`, sondageMathematiques, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // To insert a single étudiants internationaux list
  static async addOneEtudiantsInternationaux(etudiantsInternationaux) {
    try {
      const res = await axios.post(`${url}/oneEtudiantsInternationaux`, etudiantsInternationaux, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // To check if students need to be removed or not
  static async removeInactiveStudents() {
    try {
      const res = await axios.delete(`${url}/removeInactiveStudents`, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets all students
  static async getAllStudent() {
    try {
      const res = await axios.get(`${url}/student_list`, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets all students
  static async getStudentsBySession(session) {
    try {
      const res = await axios.get(`${url}/students_by_session/${session}`, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets student form info by ID
  static async getStudentFormInfo(no_etudiant) {
    try {
      const res = await axios.get(`${url}/student_form/${no_etudiant}`, config())
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Set student flag state
  static async flagStudent(no_etudiant, flagged) {
    try {
      const res = await axios.patch(`${url}/flagStudent/${no_etudiant}`, {flagged: flagged}, config());
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Gets all responsable
  static async getAllSupervisor() {
    const res = await axios.get(`${url}/supervisor_list`, config());
    return res.data;
  }

  // Gets supervisor form info by ID
  static async getSupervisorFormInfo(id) {
    try {
      const res = await axios.get(`${url}/supervisor_form/${id}`, config())
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // to insert Supervisor into database
  static async addSupervisor(data) {
    const res = await axios.post(`${url}/add_supervisor/`, data, config());
    return res.data;
  }

  // Updates supervisor form info by ID
  static async updateSupervisorFormInfo(id, post) {
    try {
      const res = await axios.patch(`${url}/supervisor_form/${id}`, post, config())
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Gets previous supervisor by ID
  static async getPreviousSupervisor(id) {
    try {
      const res = await axios.get(`${url}/previous_supervisor_form/${id}`, config())
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Gets next supervisor by ID
  static async getNextSupervisor(id) {
    try {
      const res = await axios.get(`${url}/next_supervisor_form/${id}`, config())
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  static async requestAdminChange(supervisor_id) {
    try {
      const res = await axios.get(`${url}/request_admin_change/${supervisor_id}`, config());
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Give administrative rights to supervisor
  static async makeSupervisorAdmin(supervisor_token) {
    try {
      const res = await axios.patch(`${url}/make_supervisor_admin/${supervisor_token}`, config());
      return res.data;
    }
    catch (err) {
      return err;
    }
  }

  // Update course name
  static async changeCourseName(course) {
    try {
      const res = await axios.patch(`${url}/changeCourseName`, course, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Add comment
  static async addComment(comment) {
    try {
      const res = await axios.post(`${url}/addComment`, comment, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Edit comment
  static async editComment(comment) {
    try {
      const res = await axios.patch(`${url}/editComment`, comment, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Get all remark codes
  static async getRemarkCode() {
    try {
      const res = await axios.get(`${url}/getRemarkCodes`, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets previous supervisor by numero etudiant
  static async getPreviousStudent(numero_etudiant) {
    try {
      const res = await axios.get(`${url}/previous_student_form/${numero_etudiant}`, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets previous supervisor by numero etudiant and session
  static async getPreviousStudentBySessions(numero_etudiant, data) {
    try {
      const res = await axios.post(`${url}/previous_student_form_by_sessions/${numero_etudiant}`, data, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }


  // Gets next supervisor by numero etudiant
  static async getNextStudent(numero_etudiant) {
    try {
      const res = await axios.get(`${url}/next_student_form/${numero_etudiant}`, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets next supervisor by numero etudiant and session
  static async getNextStudentBySessions(numero_etudiant, data) {
    try {
      const res = await axios.post(`${url}/next_student_form_by_sessions/${numero_etudiant}`, data, config());
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Checks if user exists
  static async login(username, password) {
    try {
      const res = await axios.post(`${url}/login`, { "username": username, "password": password });
      return res.data;
    } catch (err) {
      return err;
    }
  }

  static async recover_password(email) {
    try {
      const res = await axios.post(`${url}/recover_password`, { "courriel": email });  
      return res.data;
    } catch (err) {
      return err;
    }
  }

  static async password_modif(type, token, password) {
    try {
      const res = await axios.patch(`${url}/password/${type}/${token}`, { "password": password });  
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // Gets all courses
  static async getAllCourse() {
    const res = await axios.get(`${url}/course_list`, config());
    return res.data;
  }
}
