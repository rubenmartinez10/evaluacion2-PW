// Ejercicio 2: Reservas de Food DEI S.A. de R.L.
// Reglas de negocio:
//  - Al agregar un plato a la reserva, el stock se descuenta del menú (queda apartado).
//  - Al quitar un plato, las porciones regresan al stock.
//  - El total de la reserva nunca puede superar el saldo del usuario.
//  - La reserva se inicia sola al agregar el primer plato y tiene un límite de tiempo; si vence sin confirmarse se cancela
//    automáticamente y el stock apartado regresa al menú.

import { buscarPlato } from '../data/menu.js';

const SALDO_INICIAL = 25.0;
const DURACION_RESERVA_MS = Number(process.env.RESERVA_MINUTOS ?? 5) * 60 * 1000; // 5 minutos por defecto

// Estado de la reserva del usuario (en memoria)
const reserva = {
  saldo: SALDO_INICIAL,
  itemsReservados: [], // [{ id: 101, cantidad: 2 }]
  activa: false,
  expiraEn: null, // timestamp (ms) en que vence la reserva
  expirada: false, // true si la última reserva se cerró por tiempo
};

let temporizador = null;

// ---------- Funciones auxiliares ----------

const redondear = (valor) => Math.round(valor * 100) / 100;

const calcularTotal = (items) =>
  redondear(items.reduce((suma, item) => suma + buscarPlato(item.id).precio * item.cantidad, 0));

const buscarItem = (id) => reserva.itemsReservados.find((item) => item.id === id);

// Devuelve todas las porciones apartadas al stock y vacía la reserva
const liberarStock = () => {
  reserva.itemsReservados.forEach((item) => {
    buscarPlato(item.id).stock += item.cantidad;
  });
  reserva.itemsReservados = [];
};

const cerrarReserva = () => {
  clearTimeout(temporizador);
  temporizador = null;
  reserva.activa = false;
  reserva.expiraEn = null;
};

const cancelarPorTiempo = () => {
  liberarStock();
  cerrarReserva();
  reserva.expirada = true;
  console.log('Reserva cancelada por tiempo agotado');
};

// Respuesta estándar con el estado de la reserva
const construirRespuesta = () => {
  const total = calcularTotal(reserva.itemsReservados);
  return {
    saldo: reserva.saldo,
    saldoDisponible: redondear(reserva.saldo - total),
    total,
    itemsReservados: reserva.itemsReservados.map((item) => {
      const plato = buscarPlato(item.id);
      return {
        id: item.id,
        nombre: plato.nombre,
        precio: plato.precio,
        cantidad: item.cantidad,
        subtotal: redondear(plato.precio * item.cantidad),
      };
    }),
    activa: reserva.activa,
    expirada: reserva.expirada,
    expiraEn: reserva.expiraEn,
  };
};

const error = (res, status, mensaje) => res.status(status).json({ mensaje });

// ---------- Middleware ----------

// Se ejecuta antes de cada ruta de reserva: si el tiempo ya venció pero el
// setTimeout aún no se disparó (diferencia de milisegundos), se cancela aquí.
export const verificarExpiracion = (req, res, next) => {
  if (reserva.activa && Date.now() >= reserva.expiraEn) {
    cancelarPorTiempo();
  }
  next();
};

// ---------- Controladores ----------

// GET /api/reserva
export const obtenerReserva = (req, res) => {
  res.json(construirRespuesta());
};

// Abre la reserva y arranca el temporizador de cierre automático
const abrirReserva = () => {
  reserva.activa = true;
  reserva.expirada = false;
  reserva.expiraEn = Date.now() + DURACION_RESERVA_MS;
  temporizador = setTimeout(cancelarPorTiempo, DURACION_RESERVA_MS);
};

// POST /api/reserva/iniciar (opcional: agregar un plato también inicia la reserva)
export const iniciarReserva = (req, res) => {
  if (reserva.activa) {
    return error(res, 400, 'Ya tienes una reserva en curso');
  }
  abrirReserva();

  res.status(201).json(construirRespuesta());
};

// POST /api/reserva/agregar  body: { alimentoId: 101, cantidad: 1 }
export const agregarPlato = (req, res) => {
  const alimentoId = Number(req.body.alimentoId);
  const cantidad = Number(req.body.cantidad ?? 1);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return error(res, 400, 'La cantidad debe ser un entero mayor a 0');
  }

  const plato = buscarPlato(alimentoId);
  if (!plato) {
    return error(res, 404, 'El alimento no existe');
  }
  if (plato.stock < cantidad) {
    return error(res, 400, 'Stock insuficiente');
  }

  const totalNuevo = calcularTotal(reserva.itemsReservados) + plato.precio * cantidad;
  if (totalNuevo > reserva.saldo) {
    return error(res, 400, 'Saldo insuficiente para esta cantidad');
  }

  // Si no hay reserva en curso, el primer plato válido la inicia (y arranca el tiempo)
  if (!reserva.activa) {
    abrirReserva();
  }

  // Si el plato ya estaba en la reserva solo se suma la cantidad
  const item = buscarItem(alimentoId);
  if (item) {
    item.cantidad += cantidad;
  } else {
    reserva.itemsReservados.push({ id: alimentoId, cantidad });
  }
  plato.stock -= cantidad;

  res.status(201).json(construirRespuesta());
};

// PUT /api/reserva/actualizar-porciones/:id  body: { cantidad: 3 }
export const actualizarPorciones = (req, res) => {
  const id = Number(req.params.id);
  const nuevaCantidad = Number(req.body.cantidad);

  if (!reserva.activa) {
    return error(res, 400, 'No tienes una reserva activa. Inicia una nueva reserva.');
  }

  const item = buscarItem(id);
  if (!item) {
    return error(res, 404, 'Ese plato no está en tu reserva');
  }
  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 1) {
    return error(res, 400, 'La cantidad mínima es 1. Usa "Quitar" para eliminar el plato.');
  }

  const plato = buscarPlato(id);
  const diferencia = nuevaCantidad - item.cantidad; // positivo = sube, negativo = baja

  if (diferencia > plato.stock) {
    return error(res, 400, 'Stock insuficiente');
  }

  const totalNuevo = calcularTotal(reserva.itemsReservados) + plato.precio * diferencia;
  if (totalNuevo > reserva.saldo) {
    return error(res, 400, 'Saldo insuficiente para esta cantidad');
  }

  item.cantidad = nuevaCantidad;
  plato.stock -= diferencia; // si diferencia es negativa, el stock aumenta

  res.json(construirRespuesta());
};

// DELETE /api/reserva/eliminar/:id
export const eliminarPlato = (req, res) => {
  const id = Number(req.params.id);
  const item = buscarItem(id);

  if (!item) {
    return error(res, 404, 'Ese plato no está en tu reserva');
  }

  buscarPlato(id).stock += item.cantidad; // devolver unidades al menú
  reserva.itemsReservados = reserva.itemsReservados.filter((i) => i.id !== id);

  res.json(construirRespuesta());
};

// POST /api/reserva/confirmar
export const confirmarReserva = (req, res) => {
  if (!reserva.activa) {
    return error(res, 400, 'No tienes una reserva activa');
  }
  if (reserva.itemsReservados.length === 0) {
    return error(res, 400, 'Agrega al menos un plato antes de confirmar');
  }

  const total = calcularTotal(reserva.itemsReservados);
  reserva.saldo = redondear(reserva.saldo - total); // se cobra la reserva
  reserva.itemsReservados = []; // el stock queda bloqueado definitivamente
  cerrarReserva();

  res.json({ ...construirRespuesta(), mensaje: `Reserva confirmada por $${total.toFixed(2)}` });
};
