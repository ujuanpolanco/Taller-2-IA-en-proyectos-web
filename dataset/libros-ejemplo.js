/**
 * BookHub - Fase 3, paso 2: cinco registros creados manualmente.
 *
 * Son libros reales. Cada ISBN se verifico en Open Library (openlibrary.org/isbn/<isbn>)
 * y la editorial y el anio corresponden a esa edicion concreta, porque el ISBN
 * identifica una edicion y no la obra en general.
 *
 * Ajuste frente al ejemplo del enunciado: el ISBN 9780307474728 corresponde a la
 * edicion de Vintage Espanol de 2009, no a la primera edicion de Editorial
 * Sudamericana de 1967. Por eso se registra Vintage Espanol y 2009.
 *
 * Estos cinco objetos se usaron como ejemplos en el prompt few-shot (Fase 3, paso 3).
 */
const librosEjemplo = [
  {
    id: 1,
    codigo: "LIB001",
    titulo: "Cien años de soledad",
    categoria: "Literatura",
    precio: 55000,
    stock: 18,
    stockMinimo: 5,
    autor: "Gabriel García Márquez",
    editorial: "Vintage Español",
    isbn: "9780307474728",
    anioPublicacion: 2009,
    activo: true
  },
  {
    id: 2,
    codigo: "LIB002",
    titulo: "Clean Code",
    categoria: "Ciencia y tecnología",
    precio: 120000,
    stock: 4,
    stockMinimo: 5,
    autor: "Robert C. Martin",
    editorial: "Prentice Hall",
    isbn: "9780132350884",
    anioPublicacion: 2008,
    activo: true
  },
  {
    id: 3,
    codigo: "LIB003",
    titulo: "El principito",
    categoria: "Infantil y juvenil",
    precio: 32000,
    stock: 24,
    stockMinimo: 5,
    autor: "Antoine de Saint-Exupéry",
    editorial: "Salamandra",
    isbn: "9788478880065",
    anioPublicacion: 1990,
    activo: true
  },
  {
    id: 4,
    codigo: "LIB004",
    titulo: "Sapiens",
    categoria: "Historia",
    precio: 89000,
    stock: 0,
    stockMinimo: 3,
    autor: "Yuval Noah Harari",
    editorial: "Debate",
    isbn: "9788499926223",
    anioPublicacion: 2015,
    activo: true
  },
  {
    id: 5,
    codigo: "LIB005",
    titulo: "Hábitos atómicos",
    categoria: "Desarrollo personal",
    precio: 75000,
    stock: 40,
    stockMinimo: 8,
    autor: "James Clear",
    editorial: "Diana",
    isbn: "9788418118036",
    anioPublicacion: 2020,
    activo: true
  }
];

if (typeof module !== "undefined") {
  module.exports = { librosEjemplo };
}
