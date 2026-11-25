# 04 · Reporte de validación del dataset

## 1. Función `validarLibros(lista)`

Archivo: [`dashboard/validacion.js`](../dashboard/validacion.js). La usan el dashboard (formulario y panel "Calidad de datos") y Node.js ([`dataset/validar-dataset.js`](../dataset/validar-dataset.js)).

| Regla | Cómo se comprueba |
|---|---|
| IDs únicos, enteros y > 0 | `Number.isInteger(id) && id >= 1` + `Map` de valores vistos |
| Código `LIB` + 3 dígitos, único | `/^LIB\d{3}$/` + `Map` de valores vistos |
| Título 3–120, autor y editorial 3–80 | Texto (`typeof === "string"`) con `trim()` y longitud |
| Categoría válida | `CATEGORIAS_VALIDAS.includes(categoria)` |
| Precio entero positivo | `Number.isInteger(precio) && precio >= 1` (rechaza `"45000"` como texto) |
| Stock y stockMinimo enteros ≥ 0 | `Number.isInteger(v) && v >= 0` (rechaza `-2` y `2.5`) |
| ISBN-13 válido y único | 13 dígitos + **dígito de control** + `Map` de valores vistos |
| Año entre 1450 y 2026 | Entero dentro del rango |
| `activo` booleano | `typeof activo === "boolean"` (rechaza `"true"` como texto) |
| Estructura | Detecta campos obligatorios faltantes y campos no permitidos (por ejemplo, `estado`) |

Cada error devuelve `{ indice, id, campo, descripcion }`.

**Dígito de control del ISBN-13:** se multiplican los 12 primeros dígitos por 1 y 3 de forma alternada, se suman y el control es `(10 − suma % 10) % 10`. Con `9780307474728`: la suma ponderada es 92 y el control es (10 − 2) % 10 = **8**, que coincide con el último dígito.

## 2. Ejecución de la validación programática

```powershell
node dataset/validar-dataset.js dataset/libros-v1-sin-corregir.json
node dataset/validar-dataset.js dashboard/libros.json
node dataset/validar-dataset.js dataset/casos-prueba-errores.json
```

| Archivo | Registros | Errores | Reporte |
|---|---|---|---|
| `libros-v1-sin-corregir.json` (antes) | 35 | 0 | [reporte-v1-sin-corregir.txt](../dataset/reportes/reporte-v1-sin-corregir.txt) |
| `libros.json` (después) | 35 | 0 | [reporte-libros-final.txt](../dataset/reportes/reporte-libros-final.txt) |
| `casos-prueba-errores.json` | 4 | 19 | [reporte-casos-prueba.txt](../dataset/reportes/reporte-casos-prueba.txt) |

**Interpretación:** el dataset generado cumple todas las reglas de formato desde la primera versión. Ayudaron tres cosas: la estructura y las reglas se definieron antes de generar, el prompt few-shot tenía cinco ejemplos con los tipos correctos, y el dígito de control de los ISBN simulados se calculó en vez de inventarse. El error que sí tenía la primera versión no es de formato sino de **coherencia** (sección 3), y por eso no lo detecta una regla automática.

### Prueba del validador con errores intencionales

Para comprobar que `validarLibros()` sí detecta los problemas, se armó [`casos-prueba-errores.json`](../dataset/casos-prueba-errores.json): un registro correcto de referencia y tres con errores puestos a propósito, uno o más por cada regla.

| # | Registro | Campo | Error detectado |
|---|---|---|---|
| 1 | índice 1 | codigo | `"LIB01"` no sigue el patrón LIB + 3 dígitos |
| 2 | índice 1 | titulo | `"IA"` tiene menos de 3 caracteres |
| 3 | índice 1 | categoria | `"Ciencia"` no es una categoría válida |
| 4 | índice 1 | precio | `"45000"` es texto, no entero |
| 5 | índice 1 | stock | `-2` es negativo |
| 6 | índice 1 | stockMinimo | `2.5` no es entero |
| 7 | índice 1 | autor | Vacío |
| 8 | índice 1 | isbn | `"978958990006"` tiene 12 dígitos |
| 9 | índice 1 | anioPublicacion | `2027` está fuera de rango |
| 10 | índice 1 | activo | `"true"` es texto, no booleano |
| 11 | índice 1 | id | `1` duplicado (índice 0) |
| 12 | índice 2 | estado | Campo no permitido (se calcula en la app) |
| 13 | índice 2 | id | `0` no es mayor que 0 |
| 14 | índice 2 | precio | `0` no es positivo |
| 15 | índice 2 | isbn | `9789589900063`: dígito de control incorrecto (debe ser 2) |
| 16 | índice 2 | anioPublicacion | `1449` está fuera de rango |
| 17 | índice 2 | codigo | `"LIB001"` duplicado |
| 18 | índice 3 | editorial | Falta el campo obligatorio |
| 19 | índice 3 | isbn | `9789589900062` duplicado |

Los 19 errores esperados se detectaron. La captura [19-calidad-datos-casos-prueba.png](../evidencias/19-calidad-datos-casos-prueba.png) muestra el mismo reporte en el panel "Calidad de datos" del dashboard.

## 3. Meta-validación con IA (auditoría)

Con el prompt P13 ([01-registro-de-prompts.md](01-registro-de-prompts.md#p13--meta-validación-con-ia)) la IA revisó `libros-v1-sin-corregir.json` junto con el reporte de `validarLibros()`. Primero se explicaron los hallazgos y después se decidió qué corregir.

| Error encontrado | Registro afectado | Causa probable | Corrección sugerida |
|---|---|---|---|
| El ISBN no corresponde a la editorial ni al año escritos: `9780307474728` es la edición de Vintage Español de 2009, pero el registro dice Editorial Sudamericana, 1967 | LIB001 | El ejemplo mezcla los datos de la primera edición (1967) con el ISBN de una edición posterior | Usar la editorial y el año de la edición que identifica el ISBN, verificados en Open Library |
| Los ISBN simulados son consecutivos y usan el prefijo `978-958`, asignado a Colombia | LIB006–LIB035 | Se generaron con un patrón fijo para poder reconocerlos | Mantenerlos y documentarlos como simulados. No presentarlos como ISBN reales |
| `stock` igual a `stockMinimo` (5 = 5) | LIB019 | Caso límite incluido a propósito | No es un error: según la regla es *Stock bajo*. Se mantiene para probar el límite |
| Libro inactivo con existencias (stock 18) | LIB035 | Caso de prueba: título descatalogado que todavía tiene inventario | No es un error. Los KPI y el gráfico deben excluirlo (verificado: 34 activos) |
| Editoriales que no están en la lista de ejemplo (Vintage Español, Prentice Hall, Salamandra, Debate, Diana) | LIB001–LIB005 | Son las editoriales reales de las ediciones verificadas | No es un error: la lista del enunciado es de ejemplo, no cerrada. Se mantienen para que sean coherentes con el ISBN |
| Títulos, autores o ISBN repetidos | — | — | No se encontraron: los 35 títulos, autores e ISBN son únicos |
| Tipos de datos incorrectos | — | — | No se encontraron (lo confirma `validarLibros()`) |

## 4. Errores documentados y corrección aplicada

| Error encontrado | Registro(s) afectado(s) | Causa probable | Corrección aplicada |
|---|---|---|---|
| ISBN incoherente con la editorial y el año | LIB001 | Datos de la primera edición mezclados con el ISBN de otra edición | `editorial`: "Editorial Sudamericana" → **"Vintage Español"**; `anioPublicacion`: 1967 → **2009** |
| ISBN simulados con un prefijo real de país | LIB006–LIB035 | Patrón de generación | Sin cambios en los datos. Se documentan como simulados en [03-dataset.md](03-dataset.md) |

**Evidencia antes y después:**

```text
dataset/libros-v1-sin-corregir.json  →  dashboard/libros.json
LIB001  editorial:        "Editorial Sudamericana"  →  "Vintage Español"
LIB001  anioPublicacion:  1967                      →  2009
```

Después de corregir se ejecutó `validarLibros()` de nuevo: **35 registros, 0 errores** ([reporte-libros-final.txt](../dataset/reportes/reporte-libros-final.txt)). El panel "Calidad de datos" del dashboard ejecuta la misma validación en vivo después de cada operación CRUD ([18-calidad-datos-sin-errores.png](../evidencias/18-calidad-datos-sin-errores.png)).
