// Cliente HTTP basado en fetch (promesas).
// Si el backend responde con un error (400, 404...), se lanza un Error con el
// mensaje que envió Express para poder mostrarlo en el catch del componente.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const request = (ruta, { method = 'GET', body } = {}) =>
  fetch(`${API_URL}${ruta}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (respuesta) => {
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      throw new Error(datos.mensaje ?? 'Error inesperado en el servidor')
    }
    return datos
  })
