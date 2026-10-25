import { useEffect, useState } from 'react'
import { Alert, Input } from 'reactstrap'
import { enviarIntento, reiniciarJuego } from '../../api/juegoApi'
import {
  IconoBarras,
  IconoBombilla,
  IconoCirculoX,
  IconoDiana,
  IconoEnviar,
  IconoEstrella,
  IconoNumeral,
  IconoReiniciar,
  IconoReloj,
  IconoTeclado,
  IconoTrofeo,
} from '../ui/Icons'

const COLORES = { mayor: 'warning', menor: 'info', correcto: 'success' }

function AdivinaNumero({ renderPestanas }) {
  const [numero, setNumero] = useState('')
  const [intentos, setIntentos] = useState([]) // historial: [{ numero, resultado }]
  const [mensaje, setMensaje] = useState('')
  const [color, setColor] = useState('secondary')
  const [gano, setGano] = useState(false)

  // Al abrir el juego se pide un número nuevo, así el historial vacío del
  // frontend coincide con una partida nueva en el backend
  useEffect(() => {
    reiniciarJuego().catch((error) => {
      setMensaje(error.message)
      setColor('danger')
    })
  }, [])

  const intentosFallidos = intentos.filter((intento) => intento.resultado !== 'correcto').length

  const manejarEnvio = async (e) => {
    e.preventDefault()
    try {
      const respuesta = await enviarIntento(Number(numero))
      setIntentos([...intentos, { numero: Number(numero), resultado: respuesta.resultado }])
      setMensaje(respuesta.mensaje)
      setColor(COLORES[respuesta.resultado])
      setGano(respuesta.resultado === 'correcto')
      setNumero('')
    } catch (error) {
      setMensaje(error.message)
      setColor('danger')
    }
  }

  const manejarReinicio = () => {
    // Ejemplo de promesa con .then / .catch
    reiniciarJuego()
      .then((respuesta) => {
        setIntentos([])
        setGano(false)
        setMensaje(respuesta.mensaje)
        setColor('secondary')
      })
      .catch((error) => {
        setMensaje(error.message)
        setColor('danger')
      })
  }

  return (
    <div className="juego-pagina">
      {renderPestanas(null, true)}

      <div className="juego">
        <section className="panel juego-principal">
          <header className="juego-cabecera">
            <span className="juego-logo">
              <IconoNumeral size={34} strokeWidth={2.4} />
            </span>
            <div>
              <h1>Adivina el Número</h1>
              <p>Encuentra el número secreto entre 1 y 100.</p>
            </div>
          </header>

          <div className="juego-cuerpo">
            <div className="juego-izquierda">
              <img
                className="juego-ilustracion"
                src="/img/adivina-ilustracion.jpg"
                alt="Esfera de cristal con signo de interrogación y números flotando"
              />
              <button type="button" className="btn-contorno" onClick={manejarReinicio}>
                <IconoReiniciar size={22} />
                {gano ? 'Jugar de nuevo' : 'Reiniciar juego'}
              </button>
            </div>

            <div className="juego-derecha">
              <form className="intento" onSubmit={manejarEnvio}>
                <div className="intento-cabecera">
                  <IconoDiana size={38} />
                  <div>
                    <h2>Tu intento</h2>
                    <p>Escribe un número del 1 al 100</p>
                  </div>
                </div>

                <div className="intento-campo">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Ej. 42"
                    aria-label="Número a adivinar"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    disabled={gano}
                    required
                  />
                  <IconoTeclado size={24} />
                </div>

                <button type="submit" className="btn-degradado" disabled={gano}>
                  <IconoEnviar size={22} />
                  Enviar intento
                </button>

                {mensaje && (
                  <Alert color={color} className="intento-mensaje">
                    {mensaje}
                  </Alert>
                )}
              </form>

              <div className="juego-stats">
                <div className="stat stat--fallidos">
                  <span className="stat-icono">
                    <IconoCirculoX size={28} />
                  </span>
                  <div>
                    <div className="stat-titulo">Intentos fallidos</div>
                    <div className="stat-numero">{intentosFallidos}</div>
                  </div>
                </div>

                <div className="stat stat--historial">
                  <span className="stat-icono">
                    <IconoReloj size={28} />
                  </span>
                  <div>
                    <div className="stat-titulo">Historial</div>
                    {intentos.length === 0 ? (
                      <p className="stat-texto">Aún no has intentado ningún número.</p>
                    ) : (
                      <ul className="historial">
                        {intentos.map((intento, index) => (
                          <li key={`${index}-${intento.numero}`} className={`historial-item historial-item--${intento.resultado}`}>
                            {intento.numero}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <svg className="juego-ola" viewBox="0 0 500 110" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="ola-degradado" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#dbeefc" />
                <stop offset="1" stopColor="#8fe0b8" />
              </linearGradient>
            </defs>
            <path d="M0 110 C 150 104, 300 70, 500 0 L500 110 Z" fill="url(#ola-degradado)" opacity=".75" />
          </svg>
        </section>

        <aside className="panel juego-lateral">
          <section className="lateral-seccion">
            <span className="lateral-icono lateral-icono--verde">
              <IconoBombilla size={34} />
            </span>
            <div>
              <h2>Cómo funciona</h2>
              <p>Escribe un número del 1 al 100 y te diremos si es mayor o menor que el número secreto.</p>
            </div>
          </section>

          <section className="lateral-seccion lateral-seccion--linea">
            <span className="lateral-icono lateral-icono--azul">
              <IconoEstrella size={34} />
            </span>
            <div>
              <h2>Consejos</h2>
              <ul className="consejos">
                <li>Empieza con un número aproximado.</li>
                <li>Luego ajusta según las pistas.</li>
                <li>¡Piensa y adivina!</li>
              </ul>
            </div>
          </section>

          <section className="racha">
            <span className="racha-icono">
              <IconoBarras size={28} />
            </span>
            <div className="racha-texto">
              <h2>Racha actual</h2>
              {intentos.length === 0 ? (
                <p>
                  Aún no tienes una racha.
                  <br />
                  ¡Intenta varios números seguidos!
                </p>
              ) : (
                <p>
                  {gano
                    ? `¡Lo lograste en ${intentos.length} ${intentos.length === 1 ? 'intento' : 'intentos'}!`
                    : `Llevas ${intentos.length} ${intentos.length === 1 ? 'intento seguido' : 'intentos seguidos'}.`}
                </p>
              )}
            </div>
            <div className="racha-trofeo">
              <IconoTrofeo size={30} />
              <strong>{intentos.length === 0 ? '-' : intentos.length}</strong>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default AdivinaNumero
