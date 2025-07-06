require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { AppDataSource } = require("./db");
const documentRoutes = require("./routes/document.routes");
const setupSwagger = require("./swagger");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
setupSwagger(app);

app.use("/", documentRoutes);

// Inicializar DB y arrancar server
AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Servidor escuchando en puerto ${process.env.PORT || 4000}`)
    );
  })
  .catch((err) => {
    console.error("Error DB: ", err);
  });
