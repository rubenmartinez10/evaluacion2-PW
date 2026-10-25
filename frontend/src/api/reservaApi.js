import { request } from './client'

// Endpoint 1
export const obtenerMenu = () => request('/api/menu')

// Endpoint 2
export const obtenerReserva = () => request('/api/reserva')

// Endpoint 3
export const agregarPlato = (alimentoId, cantidad = 1) =>
  request('/api/reserva/agregar', { method: 'POST', body: { alimentoId, cantidad } })

// Endpoint 4
export const actualizarPorciones = (id, cantidad) =>
  request(`/api/reserva/actualizar-porciones/${id}`, { method: 'PUT', body: { cantidad } })

// Endpoint 5
export const eliminarPlato = (id) => request(`/api/reserva/eliminar/${id}`, { method: 'DELETE' })

// Extras: límite de tiempo y confirmación
export const iniciarReserva = () => request('/api/reserva/iniciar', { method: 'POST' })

export const confirmarReserva = () => request('/api/reserva/confirmar', { method: 'POST' })
