const s3 = require("../utils/s3");
const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { AppDataSource } = require("../db");
const Document = require("../models/document.entity");
const logger = require("../utils/logger");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const bucket = process.env.S3_BUCKET;

// Helper para loggear y relanzar
function handleError(context, error) {
  logger.error(`[Service] ${context}:`, error);
  throw error;
}

const uploadDocument = async ({ file, title, description, category }) => {
  let s3Key;
  try {
    s3Key = `${Date.now()}_${file.originalname}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
    logger.success("Archivo subido a S3/MinIO", s3Key);
  } catch (e) {
    handleError("Fallo uploadDocument (S3 upload)", e);
  }
  try {
    const repo = AppDataSource.getRepository("Document");
    const doc = repo.create({ title, description, category, s3_key: s3Key });
    const saved = await repo.save(doc);
    logger.success("Documento metadatos guardados en PG", saved.id);
    return saved;
  } catch (e) {
    // Si falla en PG, borrar el archivo de S3 para no dejar basura
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: s3Key }));
      logger.info("Archivo S3 eliminado tras fallo en PG", s3Key);
    } catch (delErr) {
      logger.warn("Fallo al limpiar S3 tras error PG", delErr);
    }
    handleError("Fallo uploadDocument (PG save)", e);
  }
};

const listDocuments = async () => {
  try {
    const repo = AppDataSource.getRepository("Document");
    const docs = await repo.find();
    logger.info("Listando documentos", `Total: ${docs.length}`);
    return docs;
  } catch (e) {
    handleError("Fallo listDocuments", e);
  }
};

const getDocument = async (id) => {
  try {
    const repo = AppDataSource.getRepository("Document");
    const doc = await repo.findOneBy({ id: +id });
    if (!doc) {
      logger.warn("Documento no encontrado", id);
      return null;
    }
    logger.info("Documento encontrado", id);
    return doc;
  } catch (e) {
    handleError("Fallo getDocument", e);
  }
};

const getDownloadUrl = async (doc) => {
  try {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: doc.s3_key });
    let url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 1 });
    url = url.replace("http://minio:9000", "http://localhost:9000");
    logger.info("URL firmada generada para", doc.s3_key);
    return url;
  } catch (e) {
    handleError("Fallo getDownloadUrl", e);
  }
};

const updateDocument = async (id, { title, description, category }) => {
  try {
    const repo = AppDataSource.getRepository("Document");
    const doc = await repo.findOneBy({ id: +id });
    if (!doc) {
      logger.warn("Documento a editar no encontrado", id);
      throw new Error("Not found");
    }
    if (title) doc.title = title;
    if (description) doc.description = description;
    if (category) doc.category = category;
    const saved = await repo.save(doc);
    logger.success("Documento actualizado", saved.id);
    return saved;
  } catch (e) {
    handleError("Fallo updateDocument", e);
  }
};

const deleteDocument = async (id) => {
  try {
    const repo = AppDataSource.getRepository("Document");
    const doc = await repo.findOneBy({ id: +id });
    if (!doc) {
      logger.warn("Documento a eliminar no encontrado", id);
      throw new Error("Not found");
    }
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: doc.s3_key }));
    await repo.remove(doc);
    logger.success("Documento eliminado", id);
  } catch (e) {
    handleError("Fallo deleteDocument", e);
  }
};

module.exports = {
  uploadDocument,
  listDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  getDownloadUrl,
};
