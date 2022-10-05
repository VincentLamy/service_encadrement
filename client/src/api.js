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

  // To insert a étudiants internationaux list
  static async addEtudiantsInternationaux(etudiantsInternationaux) {
    const res = await axios.post(`${url}/etudiantsInternationaux`, etudiantsInternationaux);
    return res.data;
  }
}