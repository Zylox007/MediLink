const db = require('../config/db');

const rendezvousController = {
 creerRendezVous: async (req, res) => {
  try {
    const { idMedecin, idPatient, date, heure, statut } = req.body;

    if (!idMedecin || !idPatient || !date || !heure) {
      return res.status(400).json({
        error: true,
        message: 'Champs obligatoires manquants'
      });
    }

    const maintenant = new Date();
    const dateRdv = new Date(`${date}T${heure}`);

    if (dateRdv < maintenant) {
      return res.status(400).json({
        error: true,
        message: "La date du rendez-vous est déjà passée"
      });
    }

    const [rdvExiste] = await db.execute(
      "SELECT * FROM RendezVous WHERE idMedecin = ? AND date = ? AND heure = ?",
      [idMedecin, date, heure]
    );

    if (rdvExiste.length > 0) {
      return res.status(400).json({
        error: true,
        message: "Le médecin a déjà un rendez-vous à cette date et heure."
      });
    }

    const [result] = await db.execute(
      `INSERT INTO RendezVous (date, heure, statut, idPatient, idMedecin)
       VALUES (?, ?, ?, ?, ?)`,
      [date, heure, statut || 'prévu', idPatient, idMedecin]
    );

    res.status(201).json({
      success: true,
      message: 'Rendez-vous créé avec succès',
      idRdv: result.insertId
    });

  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous :', error);
    res.status(500).json({
      error: true,
      message: 'Erreur serveur',
      details: error.message
    });
  }
},

  getRendezVousByPatient: async (req, res) => {
    try {
      const { idPatient } = req.params;
      const [rows] = await db.execute(
        "SELECT * FROM RendezVous WHERE idPatient = ?",
        [idPatient]
      );
      res.json({ success: true, rendezvous: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  annulerRendezVous: async (req, res) => {
    try {
      const { id } = req.params;
      await db.execute(
        'UPDATE RendezVous SET statut = "Annulé" WHERE idRdv = ?',
        [id]
      );
      res.json({ success: true, message: "Rendez-vous annulé" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

modifierRendezVous: async (req, res) => {
  try {
    const { id } = req.params;
    const { date, heure, idMedecin, idPatient, statut } = req.body;

    const maintenant = new Date();
    const dateRdv = new Date(`${date}T${heure}`);


    if (dateRdv < maintenant) {
      return res.status(400).json({
        success: false,
        message: "La date du rendez-vous est déjà passée"
      });
    }

    const [rdvExiste] = await db.execute(
      "SELECT * FROM RendezVous WHERE idMedecin = ? AND date = ? AND heure = ? AND idRdv != ?",
      [idMedecin, date, heure, id]
    );

    if (rdvExiste.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Le médecin a déjà un rendez-vous à cette date"
      });
    }

    const [result] = await db.execute(
      "UPDATE RendezVous SET date = ?, heure = ?, idMedecin = ?, idPatient = ?, statut = ? WHERE idRdv = ?",
      [date, heure, idMedecin, idPatient, statut, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Rendez-vous introuvable"
      });
    }

    res.json({
      success: true,
      message: "Rendez-vous modifié avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la modification du rendez-vous :", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

};

module.exports = rendezvousController;