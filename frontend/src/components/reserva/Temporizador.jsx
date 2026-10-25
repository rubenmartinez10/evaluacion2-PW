import { useEffect, useState } from 'react'
import { IconoReloj } from '../ui/Icons'

const calcularRestante = (expiraEn) => Math.max(0, Math.floor((expiraEn - Date.now()) / 1000))

// Cuenta regresiva hasta que la reserva expire (la hora límite la define el backend)
function Temporizador({ expiraEn, onExpirar }) {
  const [segundos, setSegundos] = useState(calcularRestante(expiraEn))

  useEffect(() => {
    const intervalo = setInterval(() => {
      const restante = calcularRestante(expiraEn)
      setSegundos(restante)
      if (restante === 0) {
        clearInterval(intervalo)
        onExpirar()
      }
    }, 1000)

    // Limpieza: se detiene el intervalo si el componente se desmonta
    return () => clearInterval(intervalo)
  }, [expiraEn, onExpirar])

  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0')
  const resto = String(segundos % 60).padStart(2, '0')

  return (
    <span className={`temporizador ${segundos <= 60 ? 'temporizador--urgente' : ''}`} title="Tiempo restante">
      <IconoReloj size={14} />
      {minutos}:{resto}
    </span>
  )
}

export default Temporizador
