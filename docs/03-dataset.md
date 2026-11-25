# 03 · Dataset de libros

**Archivo final:** [`dashboard/libros.json`](../dashboard/libros.json): 35 libros (5 manuales + 30 generados con IA).

## 1. Estructura definida antes de generar

| Campo | Tipo | Obligatorio | Restricciones | Ejemplo |
|---|---|---|---|---|
| `id` | Entero | Sí | Único y mayor que 0 | `1` |
| `codigo` | Texto | Sí | `LIB` + tres dígitos; único | `"LIB001"` |
| `titulo` | Texto | Sí | 3 a 120 caracteres | `"Cien años de soledad"` |
| `categoria` | Categórico | Sí | Una de las 6 categorías válidas | `"Literatura"` |
| `precio` | Entero | Sí | Positivo, en COP | `55000` |
| `stock` | Entero | Sí | ≥ 0 | `18` |
| `stockMinimo` | Entero | Sí | ≥ 0 | `5` |
| `autor` | Texto | Sí | 3 a 80 caracteres | `"Gabriel García Márquez"` |
| `editorial` | Texto | Sí | 3 a 80 caracteres | `"Vintage Español"` |
| `isbn` | Texto | Sí | ISBN-13 válido (dígito de control) y único | `"9780307474728"` |
| `anioPublicacion` | Entero | Sí | Entre 1450 y 2026 | `2009` |
| `activo` | Booleano | Sí | `true` / `false` reales, no texto | `true` |

**Categorías válidas:** Literatura, Ciencia y tecnología, Educación, Historia, Infantil y juvenil y Desarrollo personal.

**Campo calculado (no se guarda):** `estado`, que la aplicación calcula con `calcularEstado()`:

- `Agotado` si `stock === 0`
- `Stock bajo` si `0 < stock <= stockMinimo`
- `Disponible` si `stock > stockMinimo`

## 2. Cinco registros manuales

Archivo: [`dataset/libros-ejemplo.js`](../dataset/libros-ejemplo.js). Son los mismos cinco libros de la tabla del enunciado. Como son **libros reales**, cada ISBN se verificó en Open Library (`openlibrary.org/isbn/<isbn>`). La editorial y el año corresponden a **esa edición**, porque un ISBN identifica una edición concreta y no la obra en general.

| Código | Título | ISBN verificado | Edición (editorial, año) |
|---|---|---|---|
| LIB001 | Cien años de soledad | 9780307474728 | Vintage Español, 2009 |
| LIB002 | Clean Code | 9780132350884 | Prentice Hall, 2008 |
| LIB003 | El principito | 9788478880065 | Salamandra, 1990 |
| LIB004 | Sapiens | 9788499926223 | Debate, 2015 |
| LIB005 | Hábitos atómicos | 9788418118036 | Diana, 2020 |

> **Corrección al ejemplo del enunciado:** el enunciado asocia el ISBN `9780307474728` con *Editorial Sudamericana, 1967*. Al verificarlo, ese ISBN corresponde a la edición de **Vintage Español de 2009**. 1967 es el año de la primera edición, que tiene otro identificador. Se registró la edición que corresponde al ISBN (ver [04-reporte-de-validacion.md](04-reporte-de-validacion.md)).

Precio, stock y estado son los de la tabla del enunciado: LIB002 queda en *Stock bajo* (4 ≤ 5) y LIB004 en *Agotado* (0).

## 3. Treinta registros generados con IA (few-shot)

El prompt completo está en [01-registro-de-prompts.md](01-registro-de-prompts.md#p11--generación-de-30-libros-few-shot).

### Datos simulados

Los registros **LIB006 a LIB035 son ficticios**: títulos, autores e ISBN de prueba creados para el prototipo. No describen publicaciones reales y no deben usarse como referencia bibliográfica.

- **Títulos y autores:** inventados pero plausibles y con contexto colombiano (*Lluvia sobre Mompox*, *Los caminos del café*, *El misterio del faro de Cartagena*).
- **Editoriales:** tomadas de la lista de ejemplo del enunciado (Planeta, Penguin Random House, Alfaguara, Anagrama, Norma, Editorial Sudamericana y McGraw-Hill). Asignarlas a libros ficticios es parte de la simulación.
- **ISBN simulados:** patrón `978958990` + id de 3 dígitos + dígito de control calculado. Ejemplo: id 6 → `978958990006` + `2` = `9789589900062`. Tienen formato y dígito de control válidos, pero **no son ISBN asignados verificados**. El prefijo hace fácil reconocerlos: ningún libro real del dataset lo usa.

### Distribución

| Categoría | Manuales | Generados | Total |
|---|---|---|---|
| Literatura | 1 | 6 | 7 |
| Ciencia y tecnología | 1 | 5 | 6 |
| Educación | 0 | 5 | 5 |
| Historia | 1 | 4 | 5 |
| Infantil y juvenil | 1 | 5 | 6 |
| Desarrollo personal | 1 | 5 | 6 |
| **Total** | **5** | **30** | **35** |

| Estado calculado | Libros |
|---|---|
| Disponible | 24 |
| Stock bajo | 7 (LIB002, LIB007, LIB013, LIB019, LIB024, LIB030, LIB034) |
| Agotado | 4 (LIB004, LIB009, LIB016, LIB028) |

Otros datos del dataset:

- Precios entre $29.000 (infantil) y $132.000 (técnico), coherentes con cada categoría.
- Años de publicación entre 1990 y 2024.
- **Casos límite incluidos a propósito:** LIB019 tiene `stock` igual a `stockMinimo` (5 = 5 → Stock bajo), y LIB035 está inactivo (`activo: false`) con stock 18, para probar que los KPI y el gráfico solo cuentan los activos.

## 4. Archivos del dataset

| Archivo | Contenido |
|---|---|
| [`dataset/libros-ejemplo.js`](../dataset/libros-ejemplo.js) | Los 5 registros manuales (`const librosEjemplo`) |
| [`dataset/libros-v1-sin-corregir.json`](../dataset/libros-v1-sin-corregir.json) | Versión **antes** de corregir (evidencia) |
| [`dashboard/libros.json`](../dashboard/libros.json) | Versión **después** de corregir: la que carga la aplicación |
| [`dataset/casos-prueba-errores.json`](../dataset/casos-prueba-errores.json) | 4 registros con errores **intencionales** para probar el validador |
| [`dataset/validar-dataset.js`](../dataset/validar-dataset.js) | Ejecuta `validarLibros()` sobre cualquier JSON desde Node.js |
| [`dataset/reportes/`](../dataset/reportes) | Salida de la validación de cada archivo |

## 5. Verificación de JSON válido

```powershell
node dataset/validar-dataset.js dashboard/libros.json
```

El script lee el archivo con `JSON.parse()`, que falla si hay comentarios, comas finales o texto adicional, y después ejecuta `validarLibros()`. Resultado:

```text
Archivo: dashboard/libros.json
Registros revisados: 35 | Errores encontrados: 0
El dataset cumple todas las reglas de negocio.
```
