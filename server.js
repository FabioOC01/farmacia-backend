const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === "http://localhost:8085" || origin === null) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");

async function sincronizarDB() {
  try {
    await db.sequelize.sync();
    console.log("Base de datos sincronizada correctamente.");
    await initial();
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
}

sincronizarDB();

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de Farmacia." });
});

require('./routes/auth.routes')(app);
require('./routes/especialidad.routes')(app);
require('./routes/medicamento.routes')(app);

const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}.`);
});

async function initial() {
  try {
    const especialidadCount = await db.especialidad.count();
    const usuarioCount = await db.usuario.count();

    if (usuarioCount === 0) {
      await db.usuario.create({
        nombre: "Fabio",
        email: "fabio@mail.com",
        password: bcrypt.hashSync("Hola123", 8),
        esAdmin: true
      });
      console.log("Usuario administrador creado!");
    }

    if (especialidadCount === 0) {
      await db.especialidad.bulkCreate([
        { descripcionEsp: "Cardiología" },
        { descripcionEsp: "Dermatología" },
        { descripcionEsp: "Pediatría" },
        { descripcionEsp: "Gastroenterología" }
      ]);
      console.log("Especialidades creadas!");

      const cardiologia = await db.especialidad.findOne({ where: { descripcionEsp: "Cardiología" } });
      const dermatologia = await db.especialidad.findOne({ where: { descripcionEsp: "Dermatología" } });
      const pediatria = await db.especialidad.findOne({ where: { descripcionEsp: "Pediatría" } });
      const gastroenterologia = await db.especialidad.findOne({ where: { descripcionEsp: "Gastroenterología" } });

      if (cardiologia && dermatologia && pediatria && gastroenterologia) {
        await db.medicamento.bulkCreate([
          {
            descripcionMed: "Paracetamol 500mg",
            fechaFabricacion: "2024-01-15",
            fechaVencimiento: "2026-01-15",
            presentacion: "Tabletas",
            stock: 100,
            precioVentaUni: 0.5,
            precioVentaPres: 15.0,
            marca: "Genérico",
            codEspec: pediatria.id
          },
          {
            descripcionMed: "Omeprazol 20mg",
            fechaFabricacion: "2024-02-10",
            fechaVencimiento: "2026-02-10",
            presentacion: "Cápsulas",
            stock: 80,
            precioVentaUni: 0.8,
            precioVentaPres: 24.0,
            marca: "Medipharma",
            codEspec: gastroenterologia.id
          },
          {
            descripcionMed: "Loratadina 10mg",
            fechaFabricacion: "2024-03-05",
            fechaVencimiento: "2026-03-05",
            presentacion: "Tabletas",
            stock: 120,
            precioVentaUni: 0.6,
            precioVentaPres: 18.0,
            marca: "Alerfix",
            codEspec: dermatologia.id
          },
          {
            descripcionMed: "Enalapril 10mg",
            fechaFabricacion: "2024-01-20",
            fechaVencimiento: "2026-01-20",
            presentacion: "Tabletas",
            stock: 90,
            precioVentaUni: 0.7,
            precioVentaPres: 21.0,
            marca: "CardioMed",
            codEspec: cardiologia.id
          }
        ]);
        console.log("Medicamentos creados!");
      } else {
        console.log("No se pudieron encontrar todas las especialidades para crear medicamentos iniciales.");
      }
    }
  } catch (error) {
    console.log("Error al crear datos iniciales:", error);
    console.log(error.stack);
  }
}
