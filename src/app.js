require("dotenv").config();

const express = require("express");
const { connectDB } = require("./db");
const usuariosRoutes = require("./usuarios.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend TPI Parte 2 - Plataforma de Streaming",
  });
});

app.use("/usuarios", usuariosRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
  });
});