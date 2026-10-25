import { Router } from 'express';
import {
  obtenerReserva,
  iniciarReserva,
  agregarPlato,
  actualizarPorciones,
  eliminarPlato,
  confirmarReserva,
  verificarExpiracion,
} from '../controllers/reserva.controller.js';

const router = Router();

router.use(verificarExpiracion);

// 4 endpoints obligatorios de la reserva (+ GET /api/menu en menu.routes.js)
router.get('/', obtenerReserva);
router.post('/agregar', agregarPlato);
router.put('/actualizar-porciones/:id', actualizarPorciones);
router.delete('/eliminar/:id', eliminarPlato);

// Endpoints extra que pide el caso de negocio (límite de tiempo y confirmación)
router.post('/iniciar', iniciarReserva);
router.post('/confirmar', confirmarReserva);

export default router;
