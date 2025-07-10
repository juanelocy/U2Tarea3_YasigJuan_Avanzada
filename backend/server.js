const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta POST
app.post('/registro', (req, res) => {
  const {
    nombre,
    correo,
    edad,
    descripcion,
    password,
    confirm_password,
    producto,
    categoria
  } = req.body;

  const errores = [];

  // Validaciones backend
  if (!nombre || nombre.length < 3) errores.push("Nombre inválido");
  if (!/\S+@\S+\.\S+/.test(correo)) errores.push("Correo inválido");
  if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) errores.push("Contraseña insegura");
  if (password !== confirm_password) errores.push("Las contraseñas no coinciden");
  if (edad < 18 || edad > 99) errores.push("Edad fuera de rango");
  if (descripcion.length > 200) errores.push("Descripción muy larga");

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  const query = 'INSERT INTO usuarios (nombre, correo, edad, descripcion, password, producto, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [nombre, correo, edad, descripcion, password, producto, categoria], (err) => {
    if (err) return res.status(500).json({ error: 'Error al guardar en base de datos' });
    res.status(200).json({ mensaje: 'Registro exitoso' });
  });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
