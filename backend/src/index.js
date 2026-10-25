import express from 'express';
import cors from 'cors';
import juegoRoutes from './routes/juego.routes.js';
import menuRoutes from './routes/menu.routes.js';
import reservaRoutes from './routes/reserva.routes.js';

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares globales
app.use(cors()); // Permite que el frontend (otro puerto) consuma la API
app.use(express.json()); // Convierte el body JSON en req.body

// Rutas
app.use('/', juegoRoutes); // Ejercicio 1: POST /guess y POST /reset
app.use('/api/menu', menuRoutes); // Ejercicio 2
app.use('/api/reserva', reservaRoutes); // Ejercicio 2

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta ${req.method} ${req.url} no encontrada` });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
