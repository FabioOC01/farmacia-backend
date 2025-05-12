const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8085"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./models");



async function sincronizarDB() {
  try {
    await db.usuario.sync();
    console.log("Tabla usuario sincronizada");
    
    await db.especialidad.sync();
    console.log("Tabla especialidad sincronizada");
    
    await db.medicamento.sync();
    console.log("Tabla medicamento sincronizada");
    
    console.log("Base de datos sincronizada correctamente");
    
   
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
  const bcrypt = require("bcryptjs");
  
  try {
    
    const especialidadCount = await db.especialidad.count();
    const usuarioCount = await db.usuario.count();
    
    
    if (usuarioCount === 0) {
      await db.usuario.create({
        nombre: "Admin",
        email: "admin@farmacia.com",
        password: bcrypt.hashSync("Admin123", 8),
        esAdmin: true
      });
      console.log("Usuario administrador creado!");
    }
    
    
    if (especialidadCount === 0) {
      
      const especialidades = await db.especialidad.bulkCreate([
        { descripcionEsp: "Cardiología" },
        { descripcionEsp: "Dermatología" },
        { descripcionEsp: "Pediatría" },
        { descripcionEsp: "Gastroenterología" }
      ]);
      console.log("Especialidades creadas!");
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
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
          codEspec: 3 
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
          codEspec: 4 
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
          codEspec: 2 
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
          codEspec: 1 
        }
      ]);
      console.log("Medicamentos creados!");
    }
  } catch (error) {
    console.log("Error al crear datos iniciales:", error);
    console.log(error.stack);
  }
}