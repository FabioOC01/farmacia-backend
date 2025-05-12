module.exports = (sequelize, Sequelize) => {
  const Medicamento = sequelize.define("medicamento", {
    codMedicamento: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcionMed: {
      type: Sequelize.STRING
    },
    fechaFabricacion: {
      type: Sequelize.DATEONLY
    },
    fechaVencimiento: {
      type: Sequelize.DATEONLY
    },
    presentacion: {
      type: Sequelize.STRING
    },
    stock: {
      type: Sequelize.INTEGER
    },
    precioVentaUni: {
      type: Sequelize.DECIMAL(10, 2)
    },
    precioVentaPres: {
      type: Sequelize.DECIMAL(10, 2)
    },
    marca: {
      type: Sequelize.STRING
    },
   
    codEspec: {
      type: Sequelize.INTEGER,
      references: {
        model: 'especialidads', 
        key: 'codEspec'
      }
    }
  }, {
    timestamps: false 
  });

  return Medicamento;
};