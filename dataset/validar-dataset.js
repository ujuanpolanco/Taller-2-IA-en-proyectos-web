/**
 * BookHub - Ejecuta validarLibros() sobre un archivo JSON y muestra el reporte.
 *
 * Uso (desde la raiz del repositorio):
 *   node dataset/validar-dataset.js dashboard/libros.json
 *   node dataset/validar-dataset.js dataset/libros-v1-sin-corregir.json
 *   node dataset/validar-dataset.js dataset/casos-prueba-errores.json
 */
const fs = require("fs");
const path = require("path");
const { validarLibros, formatearReporte } = require("../dashboard/validacion.js");

const ruta = process.argv[2];
if (!ruta) {
  console.error("Indica el archivo a validar. Ejemplo: node dataset/validar-dataset.js dashboard/libros.json");
  process.exit(1);
}

let libros;
try {
  // JSON.parse falla si hay comentarios, comas finales o texto adicional.
  libros = JSON.parse(fs.readFileSync(path.resolve(ruta), "utf8"));
} catch (error) {
  console.error(`No se pudo leer ${ruta} como JSON valido: ${error.message}`);
  process.exit(1);
}

const errores = validarLibros(libros);
console.log(`Archivo: ${ruta}`);
console.log(formatearReporte(errores, Array.isArray(libros) ? libros.length : 0));
process.exitCode = errores.length === 0 ? 0 : 2;
