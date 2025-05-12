const { authJwt } = require("../middleware");
const controller = require("../controllers/especialidad.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Rutas públicas
  app.get("/api/especialidades", controller.findAll);
  app.get("/api/especialidades/:id", controller.findOne);
  
  // Rutas protegidas (requieren token y rol de admin)
  app.post(
    "/api/especialidades",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
  
  app.put(
    "/api/especialidades/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  
  app.delete(
    "/api/especialidades/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};