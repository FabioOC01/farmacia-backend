const { authJwt } = require("../middleware");
const controller = require("../controllers/medicamento.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Rutas públicas
  app.get("/api/medicamentos", controller.findAll);
  app.get("/api/medicamentos/:id", controller.findOne);
  
  // Rutas protegidas (requieren token y rol de admin)
  app.post(
    "/api/medicamentos",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );
  
  app.put(
    "/api/medicamentos/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  
  app.delete(
    "/api/medicamentos/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};