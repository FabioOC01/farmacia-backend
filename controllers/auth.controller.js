const db = require("../models");
const config = require("../config/auth.config");
const Usuario = db.usuario;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Guardar Usuario en la Base de datos
    const usuario = await Usuario.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      esAdmin: req.body.esAdmin || false
    });

    res.send({ message: "Usuario registrado exitosamente!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!usuario) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      usuario.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña inválida!"
      });
    }

    const token = jwt.sign({ id: usuario.id }, config.secret, {
      expiresIn: 86400 // 24 horas
    });

    res.status(200).send({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      esAdmin: usuario.esAdmin,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};