const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/medecinController');

router.get('/', medecinController.getMedecins);

router.get('/:id', medecinController.getMedecinById);

module.exports = router;