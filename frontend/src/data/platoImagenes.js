// Foto de cada plato del menú, por id (los ids vienen del backend: backend/src/data/menu.js).
// Para cambiar una foto: copia el archivo a public/img y actualiza la ruta aquí.
const IMAGENES = {
  101: '/img/pollo.jpg', // Menú Ejecutivo (Pollo)
  102: '/img/pasta-pesto.jpg', // Pasta Alfredo
  103: '/img/carne.jpg', // Carne Asada
  104: '/img/ensalada-cesar.jpg', // Ensalada César
  105: '/img/sopa.jpg', // Sopa de Frijoles
  106: '/img/pupusas.jpg', // Pupusas Revueltas
  107: '/img/flan.jpg', // Flan de Caramelo
  108: '/img/horchata.jpg', // Horchata
  // 108 (Horchata) y 109 (Pastel de Chocolate) usan la imagen por defecto
}

export const IMAGEN_POR_DEFECTO = '/img/plato-default.svg'

export const imagenDePlato = (id) => IMAGENES[id] ?? IMAGEN_POR_DEFECTO
