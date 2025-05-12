const db = require("../models");
const Usuario = db.usuario;

checkDuplicateEmail = async (req, res, next) => {
  try {
    // Email
    const usuario = await Usuario.findOne({
      where: {
        email: req.body.email
      }
    });

    if (usuario) {
      return res.status(400).send({
        message: "Error: Email ya está en uso!"
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      message: "Error al verificar email"
    });
  }
};

const verifySignUp = {
  checkDuplicateEmail
};

module.exports = verifySignUp;