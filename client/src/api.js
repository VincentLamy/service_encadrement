import axios from 'axios';
const url = '/api';

export default class API {
  // to insert a rapport d'encadrement
  static async addRapportEncadrement(rapportEncadrement) {
    const res = await axios.post(`${url}/rapportEncadrement`, rapportEncadrement);
    return res.data;
  }

  static async getAllStudent() {
    const res = await axios.get(`${url}/student_list`);
    return res.data;
  }
}