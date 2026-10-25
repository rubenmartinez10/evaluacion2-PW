import { Badge, Button, Card, CardBody, CardTitle, Col, Row } from 'reactstrap'
import { IconoMas } from '../ui/Icons'
import { imagenDePlato } from '../../data/platoImagenes'

// Clase de color de la "píldora" según la categoría que manda el backend
const CLASE_CATEGORIA = {
  Fuerte: 'fuerte',
  Entrada: 'entrada',
  Típico: 'tipico',
  Postre: 'postre',
  Bebida: 'bebida',
}

function MenuDelDia({ menu, cargando, onAgregar }) {
  return (
    <section>
      <h2 className="seccion-titulo">Menú del Día</h2>
      <Row className="menu-grid">
        {menu.map((plato) => {
          const agotado = plato.stock === 0
          const claseCategoria = CLASE_CATEGORIA[plato.categoria] ?? 'otra'

          return (
            <Col xs="12" md="4" key={plato.id} className="d-flex">
              <Card className={`plato mb-3 w-100 ${agotado ? 'plato--agotado' : ''}`}>
                <div className="plato-foto">
                  <img src={imagenDePlato(plato.id)} alt={plato.nombre} loading="lazy" />
                </div>

                <CardBody className="plato-info">
                  <CardTitle tag="h3" className="plato-nombre">
                    {plato.nombre}
                  </CardTitle>
                  <span className={`pildora pildora--${claseCategoria}`}>{plato.categoria}</span>

                  <div className="plato-precio-fila">
                    <Badge color="success" className="plato-precio">
                      ${plato.precio.toFixed(2)}
                    </Badge>
                    <span className="plato-stock">Stock: {plato.stock}</span>
                  </div>

                  {agotado ? (
                    <Button color="secondary" className="btn-verde" disabled>
                      Agotado
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      className="btn-verde"
                      disabled={cargando}
                      onClick={() => onAgregar(plato.id)}
                    >
                      <IconoMas size={16} strokeWidth={2.6} />
                      Añadir a la Reserva
                    </Button>
                  )}
                </CardBody>
              </Card>
            </Col>
          )
        })}
      </Row>
    </section>
  )
}

export default MenuDelDia
