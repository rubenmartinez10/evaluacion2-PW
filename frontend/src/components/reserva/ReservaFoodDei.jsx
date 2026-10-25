import { useEffect, useState } from 'react'
import { Alert, Spinner, UncontrolledAlert } from 'reactstrap'
import * as api from '../../api/reservaApi'
import PanelUsuario from './PanelUsuario'
import MenuDelDia from './MenuDelDia'
import BandejaReserva from './BandejaReserva'
import BarraMovil from './BarraMovil'

function ReservaFoodDei({ renderPestanas }) {
  const [menu, setMenu] = useState([])
  const [reserva, setReserva] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null) // { id, texto }
  const [exito, setExito] = useState('')

  // Pide menú y reserva al mismo tiempo (Promise.all)
  const cargarDatos = () =>
    Promise.all([api.obtenerMenu(), api.obtenerReserva()]).then(([datosMenu, datosReserva]) => {
      setMenu(datosMenu)
      setReserva(datosReserva)
    })

  useEffect(() => {
    cargarDatos().catch((e) => setError({ id: Date.now(), texto: e.message }))
  }, [])

  // Ejecuta cualquier acción contra la API mostrando "Cargando..." y capturando errores
  const ejecutar = async (accion) => {
    setCargando(true)
    setError(null)
    setExito('')
    try {
      const respuesta = await accion()
      if (respuesta.mensaje) setExito(respuesta.mensaje)
      await cargarDatos() // refresca stock del menú y totales
    } catch (e) {
      // El backend rechazó la petición (regla de negocio rota)
      setError({ id: Date.now(), texto: e.message })
      await cargarDatos().catch(() => {})
    } finally {
      setCargando(false)
    }
  }

  if (!reserva) {
    return (
      <div className="reserva-carga">
        {renderPestanas()}
        {error ? (
          <Alert color="danger" className="mt-4">
            No se pudo conectar con el backend: {error.texto}
          </Alert>
        ) : (
          <div className="text-center py-5">
            <Spinner color="success" /> Cargando...
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="reserva">
      <div className="reserva-main">
        {renderPestanas(<PanelUsuario reserva={reserva} />)}

        <h1 className="reserva-titulo">Food DEI S.A. de R.L. — Reserva de almuerzo</h1>

        {error && (
          <UncontrolledAlert key={error.id} color="warning">
            {error.texto}
          </UncontrolledAlert>
        )}
        {exito && <Alert color="success">{exito}</Alert>}
        {reserva.expirada && !reserva.activa && (
          <Alert color="danger">
            Se acabó el tiempo y tu reserva fue cancelada. Añade un plato o inicia una nueva reserva para continuar.
          </Alert>
        )}

        <MenuDelDia
          menu={menu}
          cargando={cargando}
          onAgregar={(id) => ejecutar(() => api.agregarPlato(id, 1))}
        />
      </div>

      <BandejaReserva
        reserva={reserva}
        cargando={cargando}
        onIniciar={() => ejecutar(api.iniciarReserva)}
        onConfirmar={() => ejecutar(api.confirmarReserva)}
        onExpirar={() => cargarDatos()}
        onActualizar={(id, cantidad) => ejecutar(() => api.actualizarPorciones(id, cantidad))}
        onEliminar={(id) => ejecutar(() => api.eliminarPlato(id))}
      />

      <BarraMovil reserva={reserva} />
    </div>
  )
}

export default ReservaFoodDei
