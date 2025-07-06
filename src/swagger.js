const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentos",
    version: "1.0.0",
    description:
      "Gestión de documentos PDF (upload, list, download, edit, delete) usando Node/Express, PostgreSQL y S3 (OBS/MinIO).",
  },
  servers: [{ url: "http://localhost:4000" }],
};

const options = {
  swaggerDefinition,
  apis: ["./src/controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
