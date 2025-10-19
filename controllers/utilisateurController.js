const db = require('../config/db');
const bcrypt = require('bcryptjs');

const utilisateurController = {
  creerUtilisateur: async (req, res) => {
    try {
      console.log("Body reçu:", req.body);

      const {
        email, motDePasse, nom, prenom, role, sexe, age,
        specialite, cabinet, tarif_consultation, disponibilite,
        date_naissance, telephone, num_cin
      } = req.body;

      if (!email || !motDePasse || !nom || !prenom || !role || !sexe || !age || !date_naissance || !telephone || !num_cin) {
        return res.status(400).json({ error: "Champs manquants" });
      }

      if (role === "medecin" && (!specialite || !cabinet || !tarif_consultation)) {
        return res.status(400).json({ error: "Champs du médecin manquants" });
      }

      const motDePasseHache = await bcrypt.hash(motDePasse, 10);

      const [result] = await db.execute(
        "INSERT INTO Utilisateur (email, nom, prenom, motDePasse, role, sexe, age, date_naissance, telephone, num_cin) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)",
        [email, nom, prenom, motDePasseHache, role, sexe, age, date_naissance, telephone, num_cin]
      );

      if (role === "medecin") {
        await db.execute(
          "INSERT INTO Medecin (idUtilisateur, specialite, cabinet, tarif_consultation,disponibilite) VALUES (?, ?, ?, ?,?)",
          [result.insertId, specialite, cabinet, tarif_consultation, disponibilite]
        );
      } else if (role === "patient") {
        await db.execute(
          "INSERT INTO Patient (idUtilisateur) VALUES (?)",
          [result.insertId]
        );
      } else {
        return res.status(400).json({ error: "Rôle invalide" });
      }

      res.json({
        success: true,
        message: "Utilisateur créé avec succès",
        id: result.insertId
      });

    } catch (error) {
      console.error("ERREUR COMPLETE:", error);
      res.status(500).json({
        error: "Erreur serveur",
        message: error.message,
        code: error.code
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, motDePasse } = req.body;

      const [users] = await db.execute(
        `SELECT idUtilisateur, email, nom, prenom, motDePasse, role, telephone, sexe, age FROM Utilisateur WHERE email = ?`,
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Email incorrect",
        });
      }
      const utilisateur = users[0];

      const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
      if (!motDePasseValide) {
        return res.status(401).json({
          success: false,
          message: "mot de passe incorrect",
        });
      }

      const { motDePasse: _, ...utilisateurSansMotDePasse } = utilisateur;

      res.json({
        success: true,
        message: "Connexion réussie",
        utilisateur: utilisateurSansMotDePasse,
      });
    } catch (error) {
      console.error("Erreur connexion:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la connexion",
      });
    }
  },

  getUtilisateurById: async (req, res) => {
  try {
    const { id } = req.params;

    // Récupération des informations du patient uniquement
    const [userRows] = await db.execute(`
      SELECT u.idUtilisateur, u.email, u.nom, u.prenom, u.telephone, u.role, p.num_dossier_medical
      FROM utilisateur u
      LEFT JOIN patient p ON u.idUtilisateur = p.idUtilisateur
      WHERE u.idUtilisateur = ?
    `, [id]);

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient non trouvé" });
    }

    const patient = userRows[0];

    res.json({ success: true, patient });
  } catch (error) {
    console.error("❌ Erreur SQL :", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
};

module.exports = utilisateurController;