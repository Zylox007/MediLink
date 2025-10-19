const db = require('../config/db');

const medecinController = {
  getMedecins: async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          u.idUtilisateur,
          u.prenom,
          u.nom,
          u.sexe,
          u.email,
          m.specialite,
          m.cabinet,
          m.tarif_consultation,
          m.disponibilite
        FROM utilisateur u
        INNER JOIN medecin m ON u.idUtilisateur = m.idUtilisateur
        WHERE u.role = 'medecin'
      `);

      res.json({ success: true, medecins: rows });
    } catch (error) {
      console.error("❌ Erreur SQL :", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

};

module.exports = medecinController;