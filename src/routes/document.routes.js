const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');

router.use('/documents', documentController);

module.exports = router;
