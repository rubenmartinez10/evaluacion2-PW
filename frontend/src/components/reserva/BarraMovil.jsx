import { IconoCarrito } from '../ui/Icons'

// Barra fija inferior (solo en celular): muestra el total y lleva a la bandeja
function BarraMovil({ reserva }) {
  const porciones = reserva.itemsReservados.reduce((suma, item) => suma + item.cantidad, 0)

  const irABandeja = () =>
    document.getElementById('bandeja')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="barra-movil">
      <span className="barra-movil-icono">
        <IconoCarrito size={22} />
        {porciones > 0 && <span className="barra-movil-cuenta">{porciones}</span>}
      </span>
      <div className="barra-movil-texto">
        <small>{reserva.activa ? 'Tu reserva' : 'Sin reserva activa'}</small>
        <strong>${reserva.total.toFixed(2)}</strong>
      </div>
      <button type="button" onClick={irABandeja}>
        Ver bandeja
      </button>
    </div>
  )
}

export default BarraMovil
