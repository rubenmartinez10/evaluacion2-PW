import { IconoCuadricula, IconoCubiertos } from './Icons'

const EJERCICIOS = [
  { id: 'juego', titulo: 'Ejercicio 1: Adivina el Número', corto: 'Adivina el Número', Icono: IconoCuadricula },
  { id: 'reserva', titulo: 'Ejercicio 2: Food DEI', corto: 'Food DEI', Icono: IconoCubiertos },
]

// Pestañas de navegación. "children" es un espacio a la derecha (el Ejercicio 2
// coloca ahí el saldo del usuario).
function Pestanas({ activo, onCambiar, conLinea = false, children }) {
  return (
    <div className={`pestanas ${conLinea ? 'pestanas--linea' : ''}`}>
      <div className="pestanas-lista" role="tablist" aria-label="Ejercicios">
        {EJERCICIOS.map(({ id, titulo, corto, Icono }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activo === id}
            className={`pestana ${activo === id ? 'pestana--activa' : ''}`}
            onClick={() => onCambiar(id)}
          >
            <span className="pestana-icono">
              <Icono size={18} />
            </span>
            <span className="pestana-texto pestana-texto--largo">{titulo}</span>
            <span className="pestana-texto pestana-texto--corto">{corto}</span>
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}

export default Pestanas
