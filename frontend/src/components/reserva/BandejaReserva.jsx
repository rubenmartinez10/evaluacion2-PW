import { Button, ButtonGroup, ListGroup, ListGroupItem, Spinner } from 'reactstrap'
import Temporizador from './Temporizador'
import { imagenDePlato } from '../../data/platoImagenes'
import {
  IconoCalendario,
  IconoCarrito,
  IconoCubiertos,
  IconoMas,
  IconoMenos,
  IconoPin,
  IconoX,
} from '../ui/Icons'

const formatear = (valor) => `$${valor.toFixed(2)}`

function BandejaReserva({ reserva, cargando, onActualizar, onEliminar, onIniciar, onConfirmar, onExpirar }) {
  const { itemsReservados, total, activa } = reserva
  const porciones = itemsReservados.reduce((suma, item) => suma + item.cantidad, 0)

  return (
    <aside className="bandeja" id="bandeja">
      <header className="bandeja-cabecera">
        <IconoCarrito size={26} />
        <h2>Tu Bandeja de Reserva</h2>
        <div className="bandeja-extra">
          {cargando && <Spinner size="sm" color="success" />}
          {activa && <Temporizador expiraEn={reserva.expiraEn} onExpirar={onExpirar} />}
        </div>
      </header>

      {/* Sin reserva activa */}
      {!activa && (
        <>
          <div className="bandeja-cuerpo bandeja-cuerpo--centro">
            <div className="vacio">
              <div className="vacio-circulo">
                <IconoCubiertos size={54} strokeWidth={1.6} />
              </div>
              <p className="vacio-texto">No tienes una reserva activa</p>
              <p className="vacio-ayuda">Añade un plato del menú o inicia una reserva.</p>
              <Button color="success" className="btn-verde btn-verde--grande" disabled={cargando} onClick={onIniciar}>
                <IconoMas size={18} strokeWidth={2.6} />
                Iniciar nueva reserva
              </Button>
            </div>
          </div>
          <footer className="bandeja-pie bandeja-pie--simple">
            <span>Total:</span>
            <strong>{formatear(total)}</strong>
          </footer>
        </>
      )}

      {/* Reserva activa */}
      {activa && (
        <>
          <div className="bandeja-cuerpo">
            {itemsReservados.length === 0 ? (
              <div className="vacio vacio--compacto">
                <div className="vacio-circulo vacio-circulo--chico">
                  <IconoCubiertos size={34} strokeWidth={1.6} />
                </div>
                <p className="vacio-texto">Aún no has agregado platos</p>
                <p className="vacio-ayuda">Elige un plato del menú y aparecerá aquí.</p>
              </div>
            ) : (
              <ListGroup flush className="items">
                {itemsReservados.map((item) => (
                  <ListGroupItem className="item" key={item.id}>
                    <img className="item-foto" src={imagenDePlato(item.id)} alt="" />

                    <div className="item-datos">
                      <span className="item-nombre">{item.nombre}</span>
                      <ButtonGroup size="sm" className="paso" aria-label={`Porciones de ${item.nombre}`}>
                        <Button
                          outline
                          color="secondary"
                          aria-label="Quitar una porción"
                          disabled={cargando || item.cantidad === 1}
                          onClick={() => onActualizar(item.id, item.cantidad - 1)}
                        >
                          <IconoMenos size={14} />
                        </Button>
                        <Button tag="span" outline color="secondary" className="paso-cantidad">
                          {item.cantidad}
                        </Button>
                        <Button
                          outline
                          color="secondary"
                          aria-label="Agregar una porción"
                          disabled={cargando}
                          onClick={() => onActualizar(item.id, item.cantidad + 1)}
                        >
                          <IconoMas size={14} />
                        </Button>
                      </ButtonGroup>
                    </div>

                    <span className="item-precio">{formatear(item.subtotal)}</span>

                    <Button
                      color="danger"
                      outline
                      size="sm"
                      className="item-quitar"
                      title="Quitar"
                      aria-label={`Quitar ${item.nombre} de la reserva`}
                      disabled={cargando}
                      onClick={() => onEliminar(item.id)}
                    >
                      <IconoX size={16} />
                    </Button>
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </div>

          <footer className="bandeja-pie">
            <div className="resumen">
              <span className="resumen-icono">
                <IconoPin size={22} />
              </span>
              <div className="resumen-texto">
                <span>Total de la reserva</span>
                <small>
                  {porciones} {porciones === 1 ? 'porción' : 'porciones'}
                </small>
              </div>
              <strong className="resumen-total">{formatear(total)}</strong>
            </div>

            <Button
              color="success"
              className="btn-verde btn-verde--grande"
              disabled={cargando || itemsReservados.length === 0}
              onClick={onConfirmar}
            >
              <IconoCalendario size={18} />
              Confirmar reserva
            </Button>
          </footer>
        </>
      )}
    </aside>
  )
}

export default BandejaReserva
