import { useState } from 'react'
import AdivinaNumero from './components/juego/AdivinaNumero'
import ReservaFoodDei from './components/reserva/ReservaFoodDei'
import Pestanas from './components/ui/Pestanas'

function App() {
  const [ejercicioActivo, setEjercicioActivo] = useState('reserva')

  // Cada ejercicio decide dónde dibuja las pestañas (en el Ejercicio 2 van junto al saldo)
  const renderPestanas = (derecha, conLinea) => (
    <Pestanas activo={ejercicioActivo} onCambiar={setEjercicioActivo} conLinea={conLinea}>
      {derecha}
    </Pestanas>
  )

  return (
    <div className="app">
      {ejercicioActivo === 'juego' ? (
        <AdivinaNumero renderPestanas={renderPestanas} />
      ) : (
        <ReservaFoodDei renderPestanas={renderPestanas} />
      )}
    </div>
  )
}

export default App
