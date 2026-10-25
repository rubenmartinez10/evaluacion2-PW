// Ejercicio 1: "Adivina el Número"
// El número secreto vive en memoria del servidor; se genera al iniciar.

const MINIMO = 1;
const MAXIMO = 100;

const generarNumero = () => Math.floor(Math.random() * (MAXIMO - MINIMO + 1)) + MINIMO;

let numeroSecreto = generarNumero();
console.log(`[Juego] Número secreto: ${numeroSecreto}`);

// POST /guess  body: { numero: 50 }
export const adivinar = (req, res) => {
  const numero = Number(req.body.numero);

  // Validación: debe ser un entero dentro del rango
  if (!Number.isInteger(numero) || numero < MINIMO || numero > MAXIMO) {
    return res.status(400).json({ mensaje: `Envía un número entero entre ${MINIMO} y ${MAXIMO}` });
  }

  let resultado;
  if (numero === numeroSecreto) {
    resultado = 'correcto';
  } else if (numeroSecreto > numero) {
    resultado = 'mayor'; // el número oculto es MAYOR que el intento
  } else {
    resultado = 'menor'; // el número oculto es MENOR que el intento
  }

  const mensajes = {
    correcto: `¡Correcto! El número era ${numero}`,
    mayor: `El número oculto es mayor que ${numero}`,
    menor: `El número oculto es menor que ${numero}`,
  };

  res.json({ resultado, mensaje: mensajes[resultado] });
};

// POST /reset
export const reiniciar = (req, res) => {
  numeroSecreto = generarNumero();
  console.log(`[Juego] Nuevo número secreto: ${numeroSecreto}`);
  res.json({ mensaje: 'Nuevo número generado. ¡Empieza a adivinar!' });
};
