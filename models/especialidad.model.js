module.exports = (sequelize, Sequelize) => {
  const Especialidad = sequelize.define("especialidad", {
    codEspec: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcionEsp: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false 
  });

  return Especialidad;
};