# Evaluación II — Programación Web (Ciclo 02, 2026)

Monorepo con dos proyectos:

```
evaluacion2/
├── backend/   → API REST con Node.js + Express (puerto 3000)
└── frontend/  → Vite + React + Reactstrap (puerto 5173)
```

## Cómo ejecutar (desde un equipo recién clonado)

Necesitas Node.js 20 o superior. Abre **dos terminales**:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev        # http://localhost:3000
```

```bash
# Terminal 2 - Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Opcional: el frontend usa `http://localhost:3000` por defecto. Para cambiarlo, copia
`frontend/.env.example` a `frontend/.env` y edita `VITE_API_URL`.

Para probar rápido el límite de tiempo de la reserva (por defecto 5 minutos):

```bash
RESERVA_MINUTOS=0.5 npm run dev                    # Linux / Mac / Git Bash
$env:RESERVA_MINUTOS=0.5; npm run dev              # PowerShell
```

## Ejercicio 1: Adivina el Número

| Método | Ruta     | Body              | Respuesta                                       |
| ------ | -------- | ----------------- | ----------------------------------------------- |
| POST   | `/guess` | `{ "numero": 50 }` | `{ resultado: "mayor" \| "menor" \| "correcto", mensaje }` |
| POST   | `/reset` | —                 | `{ mensaje }`                                   |

`"mayor"` significa que el número **oculto** es mayor que el intento.

## Ejercicio 2: Food DEI S.A. de R.L.

| # | Método | Ruta                                   | Body                               | Validaciones |
| - | ------ | -------------------------------------- | ---------------------------------- | ------------ |
| 1 | GET    | `/api/menu`                            | —                                  | — |
| 2 | GET    | `/api/reserva`                         | —                                  | — |
| 3 | POST   | `/api/reserva/agregar`                 | `{ "alimentoId": 101, "cantidad": 1 }` | 400 `Stock insuficiente` |
| 4 | PUT    | `/api/reserva/actualizar-porciones/:id` | `{ "cantidad": 3 }`               | 400 `Saldo insuficiente para esta cantidad` |
| 5 | DELETE | `/api/reserva/eliminar/:id`            | —                                  | Devuelve las unidades al stock |
| + | POST   | `/api/reserva/iniciar`                 | —                                  | Inicia el temporizador (también se inicia solo al agregar el primer plato) |
| + | POST   | `/api/reserva/confirmar`               | —                                  | Cobra el total y bloquea el stock |

### Reglas de negocio

- Al **agregar** un plato, el stock se descuenta del menú (queda apartado para el usuario).
- Al **quitar** un plato o bajar porciones, las unidades regresan al stock.
- El total nunca puede superar el saldo (`saldoDisponible = saldo - total`).
- La reserva dura un tiempo límite. Si vence sin confirmarse, el backend la cancela,
  devuelve el stock y el frontend invita a iniciar una nueva.
- Al **confirmar**, se descuenta el total del saldo y el stock queda bloqueado definitivamente.
- Los datos viven en memoria: al reiniciar el backend todo vuelve al estado inicial.

## Estructura

```
backend/src/
├── index.js                      # Configura Express, CORS, JSON y monta las rutas
├── data/menu.js                  # Inventario (arreglo de objetos)
├── routes/                       # Define URL + método HTTP → controlador
│   ├── juego.routes.js
│   ├── menu.routes.js
│   └── reserva.routes.js
└── controllers/                  # Lógica de negocio
    ├── juego.controller.js
    └── reserva.controller.js

frontend/src/
├── main.jsx                      # Punto de entrada, importa Bootstrap
├── App.jsx                       # Pestañas para cambiar de ejercicio
├── api/                          # Comunicación con el backend (fetch + promesas)
│   ├── client.js
│   ├── juegoApi.js
│   └── reservaApi.js
└── components/
    ├── juego/AdivinaNumero.jsx
    └── reserva/
        ├── ReservaFoodDei.jsx    # Estado principal (useState/useEffect) y manejo de errores
        ├── PanelUsuario.jsx      # Saldo, total, temporizador, confirmar
        ├── Temporizador.jsx      # Cuenta regresiva con setInterval
        ├── MenuDelDia.jsx        # Cuadrícula de Cards (Endpoints 1 y 3)
        └── BandejaReserva.jsx    # ListGroup con +/- y Quitar (Endpoints 2, 4 y 5)
```
