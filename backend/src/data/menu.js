// Inventario en memoria del restaurante Food DEI.
// Es un arreglo de objetos: { id: number, nombre: string, precio: number, stock: number, categoria: string }
// Al reiniciar el servidor el stock vuelve a estos valores.

export const menu = [
  { id: 101, nombre: 'Menú Ejecutivo (Pollo)', precio: 5.5, stock: 12, categoria: 'Fuerte' },
  { id: 102, nombre: 'Pasta Alfredo', precio: 4.75, stock: 8, categoria: 'Fuerte' },
  { id: 103, nombre: 'Carne Asada', precio: 6.25, stock: 5, categoria: 'Fuerte' },
  { id: 104, nombre: 'Ensalada César', precio: 3.5, stock: 10, categoria: 'Entrada' },
  { id: 105, nombre: 'Sopa de Frijoles', precio: 2.75, stock: 6, categoria: 'Entrada' },
  { id: 106, nombre: 'Pupusas Revueltas (3)', precio: 3.0, stock: 15, categoria: 'Típico' },
  { id: 107, nombre: 'Flan de Caramelo', precio: 1.75, stock: 4, categoria: 'Postre' },
  { id: 108, nombre: 'Horchata', precio: 1.25, stock: 20, categoria: 'Bebida' },
  { id: 109, nombre: 'Pastel de Chocolate', precio: 2.25, stock: 0, categoria: 'Postre' },
];

export const buscarPlato = (id) => menu.find((plato) => plato.id === id);
