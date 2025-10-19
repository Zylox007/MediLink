const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');


router.post('/', utilisateurController.creerUtilisateur);

router.get('/login', utilisateurController.login);

router.get('/:id', utilisateurController.getUtilisateurById);

module.exports = router;