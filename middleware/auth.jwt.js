const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Usuario = db.usuario;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.userId);
    
    if (usuario && usuario.esAdmin) { 
      next();
      return;
    }

    res.status(403).send({
      message: "Require Admin Role!"
    });
  } catch (error) {
    console.error("Error en middleware isAdmin:", error); 
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt; 
