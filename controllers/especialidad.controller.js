const db = require("../models");
const Especialidad = db.especialidad;


exports.create = async (req, res) => {

  if (!req.body.descripcionEsp) {
    res.status(400).send({
      message: "La descripción no puede estar vacía!"
    });
    return;
  }

  
  const especialidad = {
    descripcionEsp: req.body.descripcionEsp
  };

  
  try {
    const data = await Especialidad.create(especialidad);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ocurrió un error al crear la especialidad."
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Especialidad.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ocurrió un error al recuperar las especialidades."
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Especialidad.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `No se encontró la especialidad con id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error al recuperar la especialidad con id=" + id
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Especialidad.update(req.body, {
      where: { codEspec: id }
    });

    if (num == 1) {
      res.send({
        message: "Especialidad actualizada exitosamente."
      });
    } else {
      res.send({
        message: `No se pudo actualizar la especialidad con id=${id}. Tal vez la especialidad no fue encontrada o req.body está vacío!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error al actualizar la especialidad con id=" + id
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Especialidad.destroy({
      where: { codEspec: id }
    });

    if (num == 1) {
      res.send({
        message: "Especialidad eliminada exitosamente!"
      });
    } else {
      res.send({
        message: `No se pudo eliminar la especialidad con id=${id}. ¡Tal vez la especialidad no fue encontrada!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "No se pudo eliminar la especialidad con id=" + id
    });
  }
};