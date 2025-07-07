const express = require("express");
const multer = require("multer");
const upload = multer(); // in-memory
const service = require("../services/document.service");
const categories = require("../utils/categories");

const router = express.Router();

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Sube un documento PDF
 *     tags: [Documents]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Documento subido exitosamente
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!categories.includes(category)) {
      return res.status(400).json({
        error: `Categoría inválida: {${category}}. Debe ser una de:`,
        disponibles: categories,
      });
    }

    const doc = await service.uploadDocument({
      file: req.file,
      title,
      description,
      category,
    });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Lista todos los documentos
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Listado de documentos
 */
router.get("/", async (req, res) => {
  try {
    const docs = await service.listDocuments();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents/{id}/download:
 *   get:
 *     summary: Descarga un documento PDF
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Devuelve el archivo
 */
router.get("/:id/download", async (req, res) => {
  try {
    const doc = await service.getDocument(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    const url = await service.getDownloadUrl(doc);
    res.json({ url }); // <<<
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents/{id}:
 *   put:
 *     summary: Edita los metadatos del documento
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Documento actualizado
 */
router.put("/:id", async (req, res) => {
  try {
    const doc = await service.updateDocument(req.params.id, req.body);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     summary: Elimina un documento
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       204:
 *         description: Eliminado
 */
router.delete("/:id", async (req, res) => {
  try {
    await service.deleteDocument(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
