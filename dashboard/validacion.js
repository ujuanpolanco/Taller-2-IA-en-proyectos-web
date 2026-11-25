/**
 * BookHub - Fase 4: validacion programatica del dataset de libros.
 *
 * Funciona en el navegador (el dashboard la usa para validar el formulario y
 * mostrar el reporte de calidad) y en Node.js (dataset/validar-dataset.js).
 */

const CATEGORIAS_VALIDAS = [
  "Literatura",
  "Ciencia y tecnología",
  "Educación",
  "Historia",
  "Infantil y juvenil",
  "Desarrollo personal"
];

const CAMPOS_LIBRO = [
  "id", "codigo", "titulo", "categoria", "precio", "stock",
  "stockMinimo", "autor", "editorial", "isbn", "anioPublicacion", "activo"
];

const ANIO_MINIMO = 1450;
const ANIO_MAXIMO = 2026;
const PATRON_CODIGO = /^LIB\d{3}$/;

function esEnteroEnRango(valor, minimo, maximo = Infinity) {
  return Number.isInteger(valor) && valor >= minimo && valor <= maximo;
}

function esTextoConLongitud(valor, minimo, maximo) {
  return typeof valor === "string" && valor.trim().length >= minimo && valor.trim().length <= maximo;
}

/**
 * Un ISBN-13 es valido si tiene 13 digitos y su ultimo digito (digito de control)
 * coincide con el calculado: se multiplican los 12 primeros digitos por 1 y 3
 * alternadamente, se suman y el control es (10 - suma % 10) % 10.
 */
function esIsbn13Valido(isbn) {
  if (typeof isbn !== "string" || !/^\d{13}$/.test(isbn)) return false;
  const suma = [...isbn.slice(0, 12)].reduce(
    (total, digito, posicion) => total + Number(digito) * (posicion % 2 === 0 ? 1 : 3),
    0
  );
  return (10 - (suma % 10)) % 10 === Number(isbn[12]);
}

function estaVacio(valor) {
  return valor === null || valor === undefined || (typeof valor === "string" && valor.trim() === "");
}

/** Una regla por campo: como se valida y que mensaje se muestra si falla. */
const REGLAS_CAMPOS = [
  { campo: "id", esValido: (v) => esEnteroEnRango(v, 1), mensaje: "Debe ser un entero mayor que 0" },
  { campo: "codigo", esValido: (v) => typeof v === "string" && PATRON_CODIGO.test(v), mensaje: "Debe seguir el patrón LIB + tres dígitos" },
  { campo: "titulo", esValido: (v) => esTextoConLongitud(v, 3, 120), mensaje: "Debe ser un texto de 3 a 120 caracteres" },
  { campo: "categoria", esValido: (v) => CATEGORIAS_VALIDAS.includes(v), mensaje: "No es una categoría válida" },
  { campo: "precio", esValido: (v) => esEnteroEnRango(v, 1), mensaje: "Debe ser un entero positivo en COP" },
  { campo: "stock", esValido: (v) => esEnteroEnRango(v, 0), mensaje: "Debe ser un entero mayor o igual a 0" },
  { campo: "stockMinimo", esValido: (v) => esEnteroEnRango(v, 0), mensaje: "Debe ser un entero mayor o igual a 0" },
  { campo: "autor", esValido: (v) => esTextoConLongitud(v, 3, 80), mensaje: "Debe ser un texto de 3 a 80 caracteres" },
  { campo: "editorial", esValido: (v) => esTextoConLongitud(v, 3, 80), mensaje: "Debe ser un texto de 3 a 80 caracteres" },
  { campo: "isbn", esValido: esIsbn13Valido, mensaje: "ISBN-13 inválido: debe tener 13 dígitos y un dígito de control correcto" },
  { campo: "anioPublicacion", esValido: (v) => esEnteroEnRango(v, ANIO_MINIMO, ANIO_MAXIMO), mensaje: `Debe ser un entero entre ${ANIO_MINIMO} y ${ANIO_MAXIMO}` },
  { campo: "activo", esValido: (v) => typeof v === "boolean", mensaje: "Debe ser booleano (true o false), no texto ni número" }
];

/**
 * Revisa las reglas de un solo libro (sin comparar con los demas).
 * Devuelve una lista de { campo, descripcion }.
 */
function validarCamposLibro(libro) {
  const errores = [];
  const agregar = (campo, descripcion) => errores.push({ campo, descripcion });

  if (libro === null || typeof libro !== "object" || Array.isArray(libro)) {
    agregar("registro", "El registro no es un objeto.");
    return errores;
  }

  CAMPOS_LIBRO
    .filter((campo) => !(campo in libro))
    .forEach((campo) => agregar(campo, "El campo obligatorio no existe."));

  Object.keys(libro)
    .filter((campo) => !CAMPOS_LIBRO.includes(campo))
    .forEach((campo) => agregar(campo, "Campo no permitido por la estructura del dataset."));

  REGLAS_CAMPOS.forEach(({ campo, esValido, mensaje }) => {
    if (!(campo in libro)) return;
    const valor = libro[campo];
    if (estaVacio(valor)) {
      agregar(campo, "Campo obligatorio: no puede estar vacío.");
    } else if (!esValido(valor)) {
      agregar(campo, `${mensaje} (valor recibido: ${JSON.stringify(valor)}).`);
    }
  });

  return errores;
}

/**
 * Valida el dataset completo: reglas por registro + unicidad de id, codigo e isbn.
 * Devuelve un arreglo de errores { indice, id, campo, descripcion }.
 */
function validarLibros(lista) {
  if (!Array.isArray(lista)) {
    return [{ indice: null, id: null, campo: "dataset", descripcion: "El dataset debe ser un arreglo de libros." }];
  }

  const errores = [];
  const vistos = { id: new Map(), codigo: new Map(), isbn: new Map() };

  lista.forEach((libro, indice) => {
    const id = libro && typeof libro === "object" ? libro.id ?? null : null;

    validarCamposLibro(libro).forEach(({ campo, descripcion }) => {
      errores.push({ indice, id, campo, descripcion });
    });

    Object.keys(vistos).forEach((campo) => {
      if (!libro || libro[campo] === undefined) return;
      const valor = libro[campo];
      if (vistos[campo].has(valor)) {
        errores.push({
          indice,
          id,
          campo,
          descripcion: `Valor duplicado ${JSON.stringify(valor)}: ya lo usa el registro en el índice ${vistos[campo].get(valor)}.`
        });
      } else {
        vistos[campo].set(valor, indice);
      }
    });
  });

  return errores;
}

/** Convierte la lista de errores en un texto legible para la consola o un archivo. */
function formatearReporte(errores, totalRegistros) {
  const encabezado = `Registros revisados: ${totalRegistros} | Errores encontrados: ${errores.length}`;
  if (errores.length === 0) {
    return `${encabezado}\nEl dataset cumple todas las reglas de negocio.`;
  }
  const lineas = errores.map(
    (e, n) => `${String(n + 1).padStart(2, "0")}. [índice ${e.indice} | id ${e.id}] ${e.campo}: ${e.descripcion}`
  );
  return [encabezado, ...lineas].join("\n");
}

if (typeof module !== "undefined") {
  module.exports = {
    CATEGORIAS_VALIDAS,
    CAMPOS_LIBRO,
    esIsbn13Valido,
    validarCamposLibro,
    validarLibros,
    formatearReporte
  };
}
