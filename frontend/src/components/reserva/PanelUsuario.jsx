import { Alert, Badge } from 'reactstrap'
import { IconoBilletera, IconoCapas } from '../ui/Icons'

const formatear = (valor) => `$${valor.toFixed(2)}`

// Panel superior: saldo disponible (Alert info) y total de la reserva (Badge dark pill)
function PanelUsuario({ reserva }) {
  return (
    <Alert color="info" fade={false} className="saldo">
      <div className="saldo-item">
        <IconoBilletera size={30} />
        <div>
          <div className="saldo-etiqueta">Tu saldo actual</div>
          <div className="saldo-valor saldo-valor--verde">{formatear(reserva.saldoDisponible)}</div>
        </div>
      </div>
      <div className="saldo-separador" />
      <div className="saldo-item">
        <IconoCapas size={30} />
        <div>
          <div className="saldo-etiqueta">Total de tu Reserva</div>
          <Badge color="dark" pill className="saldo-badge">
            {formatear(reserva.total)}
          </Badge>
        </div>
      </div>
    </Alert>
  )
}

export default PanelUsuario
