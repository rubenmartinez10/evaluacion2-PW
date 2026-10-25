import { request } from './client'

export const enviarIntento = (numero) => request('/guess', { method: 'POST', body: { numero } })

export const reiniciarJuego = () => request('/reset', { method: 'POST' })
