const db = require("../models");
const Medicamento = db.medicamento;
const Especialidad = db.especialidad;

// Crear y guardar un nuevo Medicamento
exports.create = async (req, res) => {
  // Validar solicitud
  if (!req.body.descripcionMed) {
    res.status(400).send({
      message: "La descripción no puede estar vacía!"
    });
    return;
  }

  // Crear un Medicamento
  const medicamento = {
    descripcionMed: req.body.descripcionMed,
    fechaFabricacion: req.body.fechaFabricacion,
    fechaVencimiento: req.body.fechaVencimiento,
    presentacion: req.body.presentacion,
    stock: req.body.stock,
    precioVentaUni: req.body.precioVentaUni,
    precioVentaPres: req.body.precioVentaPres,
    marca: req.body.marca,
    codEspec: req.body.codEspec
  };

  // Guardar Medicamento en la base de datos
  try {
    const data = await Medicamento.create(medicamento);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ocurrió un error al crear el medicamento."
    });
  }
};

// Obtener todos los Medicamentos de la base de datos
exports.findAll = async (req, res) => {
  try {
    const data = await Medicamento.findAll({
      include: [{
        model: Especialidad,
        attributes: ['codEspec', 'descripcionEsp']
      }]
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ocurrió un error al recuperar los medicamentos."
    });
  }
};

// Encontrar un único Medicamento con un id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Medicamento.findByPk(id, {
      include: [{
        model: Especialidad,
        attributes: ['codEspec', 'descripcionEsp']
      }]
    });
    
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `No se encontró el medicamento con id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error al recuperar el medicamento con id=" + id
    });
  }
};

// Actualizar un Medicamento por el id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Medicamento.update(req.body, {
      where: { codMedicamento: id }
    });

    if (num == 1) {
      res.send({
        message: "Medicamento actualizado exitosamente."
      });
    } else {
      res.send({
        message: `No se pudo actualizar el medicamento con id=${id}. Tal vez el medicamento no fue encontrado o req.body está vacío!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error al actualizar el medicamento con id=" + id
    });
  }
};

// Eliminar un Medicamento con el id especificado
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Medicamento.destroy({
      where: { codMedicamento: id }
    });

    if (num == 1) {
      res.send({
        message: "Medicamento eliminado exitosamente!"
      });
    } else {
      res.send({
        message: `No se pudo eliminar el medicamento con id=${id}. ¡Tal vez el medicamento no fue encontrado!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "No se pudo eliminar el medicamento con id=" + id
    });
  }
};