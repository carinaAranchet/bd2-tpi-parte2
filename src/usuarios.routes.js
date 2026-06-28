const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("./db");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const nuevoUsuario = {
      nombre: req.body.nombre,
      email: req.body.email,
      plan: req.body.plan,
      fechaRegistro: new Date(),
      activo: true,
      fechaBaja: null,
    };

    const resultado = await db.collection("usuarios").insertOne(nuevoUsuario);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      id: resultado.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// READ - solo usuarios activos
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const usuarios = await db
      .collection("usuarios")
      .find({ activo: true })
      .toArray();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();

    const resultado = await db.collection("usuarios").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: req.body,
      }
    );

    res.json({
      mensaje: "Usuario actualizado correctamente",
      modificados: resultado.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// DELETE lógico
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();

    const resultado = await db.collection("usuarios").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          activo: false,
          fechaBaja: new Date(),
        },
      }
    );

    res.json({
      mensaje: "Usuario dado de baja lógicamente",
      modificados: resultado.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al dar de baja usuario" });
  }
});

module.exports = router;