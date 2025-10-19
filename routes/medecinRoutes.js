const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/medecinController');

router.get('/', medecinController.getMedecins);

module.exports = router;