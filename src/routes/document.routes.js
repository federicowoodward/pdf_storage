const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management
 */
router.use('/documents', documentController);

module.exports = router;
