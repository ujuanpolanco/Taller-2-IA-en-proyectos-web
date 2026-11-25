# 01 · Registro de prompts

Este documento recoge los prompts de cada fase del taller BookHub, la técnica de Prompt Engineering que aplica cada uno, lo que se esperaba obtener y los ajustes y verificaciones que se aplicaron a la respuesta antes de aceptarla.

**Herramienta:** asistente de IA conversacional (modelo de lenguaje).
**Regla de trabajo:** no pedir la aplicación completa en un solo prompt. Cada fase y cada archivo se pidió por separado, y cada fragmento se revisó y se probó en el navegador antes de continuar.

## Resumen de técnicas

| # | Fase | Técnica | Resultado |
|---|---|---|---|
| P1 | Landing | Priming (rol + contexto) | La IA confirma su rol y hace preguntas antes de generar código |
| P2 | Landing | Meta-prompting | Lista de información faltante: público, propuesta de valor, identidad visual, restricciones |
| P3 | Landing | Chain of Thought | Propuesta de diseño razonada en 6 puntos, sin código ([02-propuesta-de-diseno.md](02-propuesta-de-diseno.md)) |
| P4 | Landing | Zero-shot | `landing/index.html` |
| P5 | Landing | Zero-shot + restricciones | `landing/styles.css` |
| P6 | Landing | One-shot | Tarjeta de libro tomada como ejemplo para repetir el patrón en destacados y novedades |
| P7 | Dashboard | Role prompting | Descripción de la distribución, jerarquía, colores e iconografía del panel |
| P8 | Dashboard | Zero-shot con especificación | Tres tarjetas KPI |
| P9 | Dashboard | Few-shot (filas de ejemplo) | Tabla de libros con badges y acciones |
| P10 | Dashboard | Zero-shot con lista de comportamientos | `compartido/menu.js` (menú hamburguesa reutilizable) |
| P11 | Dataset | Few-shot (5 registros manuales) | 30 libros generados (`dashboard/libros.json`) |
| P12 | Validación | Zero-shot con reglas verificables | `dashboard/validacion.js` |
| P13 | Validación | Meta-validación (IA como auditora) | Informe de hallazgos ([04-reporte-de-validacion.md](04-reporte-de-validacion.md)) |
| P14 | Aplicación | Descomposición por funciones | `dashboard/app.js` (CRUD, filtros, localStorage, KPI, gráfico) |
| P15 | Revisión | Chain of Thought para depurar | Corrección de errores visuales y de accesibilidad encontrados en pruebas |

---

## Fase 1 · Landing page

### P1 · Priming inicial

**Técnica:** Priming. Se le da a la IA un rol, el contexto del negocio y una restricción explícita (no generar código todavía).

```text
Actúa como un desarrollador frontend senior especializado en comercio electrónico, librerías
digitales y diseño UX/UI. Vas a participar en el desarrollo de BookHub, una librería digital
colombiana que ofrece libros impresos de diferentes géneros y áreas del conocimiento.

Tu responsabilidad es ayudarme a diseñar y construir una landing page accesible, responsive y
visualmente coherente. Antes de comenzar, confirma que comprendes tu rol y el contexto. Luego
pregúntame qué información adicional necesitas para realizar el trabajo de la mejor manera posible.

No generes código todavía.
```

**Objetivo:** que la IA confirme su rol y pregunte antes de suponer.

**Ajuste:** las preguntas iniciales no cubrían todos los temas del proyecto (categorías, restricciones técnicas, formulario), así que se aplicó meta-prompting (P2) para obtener una lista completa.

### P2 · Meta-prompting

**Técnica:** Meta-prompting. Se le pide a la IA que evalúe qué información le falta antes de trabajar.

```text
Antes de continuar, evalúa qué información te hace falta para realizar correctamente este proyecto.
Formula preguntas concretas sobre público objetivo, propuesta de valor, categorías de libros,
contenido, identidad visual, funcionalidades y restricciones técnicas. No supongas información que
no haya sido definida.
```

**Resultado esperado:** preguntas agrupadas por tema (público, propuesta de valor, categorías, contenido de cada sección, colores y tipografía, formulario y tecnologías permitidas).

**Respuestas dadas (contexto entregado):**

- Público: jóvenes y adultos, estudiantes, docentes, profesionales y lectores de distintos géneros. Mercado inicial: Colombia.
- Propuesta de valor: catálogo organizado de libros impresos, envíos nacionales y recomendaciones de lectores.
- Categorías: Literatura, Ciencia y tecnología, Educación, Historia, Infantil y juvenil, Desarrollo personal.
- Estilo: moderno, editorial, acogedor, organizado y confiable, sin saturación visual.
- Contenido: novedades, destacados, categorías, beneficios, reseñas, suscripción.
- Restricciones: HTML5, CSS3 y JavaScript vanilla. Sin frameworks (no Bootstrap ni Tailwind). Chart.js permitido solo para el gráfico.

**Ajuste:** se le indicó que no inventara cifras de negocio (ventas, número de clientes). Por eso las reseñas del prototipo se marcan como datos ficticios.

### P3 · Propuesta de diseño (Chain of Thought, sin código)

**Técnica:** Chain of Thought. El análisis se pide en pasos numerados antes de llegar a la propuesta.

```text
Actúa como diseñador UX/UI. Analiza el contexto de BookHub y presenta una propuesta de diseño para
su landing page.

Organiza tu respuesta en estos puntos:
1. ¿Qué secciones debe tener la página y cuál es el objetivo de cada una?
2. ¿Qué jerarquía visual y orden de lectura propones?
3. ¿Qué paleta de colores comunica conocimiento, lectura, confianza y cercanía?
4. ¿Qué tipografías y tamaños recomiendas?
5. ¿Qué componentes visuales se requieren?
6. ¿Qué recursos de accesibilidad y diseño responsive deben considerarse?

Explica brevemente las decisiones de diseño. No generes código.

Contexto: [nombre, propósito, público objetivo, mercado, estilo visual y contenido de BookHub]
```

**Respuesta de la IA (resumen):** propuso 8 secciones, una paleta verde biblioteca + crema + terracota y tipografía serif editorial para títulos con sans-serif para el texto. La propuesta completa está en [02-propuesta-de-diseno.md](02-propuesta-de-diseno.md).

**Validación antes de pedir código:**

- Cada sección responde a un objetivo de negocio (descubrir, explorar, confiar, suscribirse).
- Hay una llamada a la acción clara y repetida: "Explorar catálogo" en el header y en el hero.
- Contraste revisado: para que el texto blanco de los botones cumpla AA con holgura, el acento terracota se fijó en `#B5471B` (contraste 5,41:1).

### P4 · index.html (Zero-shot)

**Técnica:** Zero-shot. Se pide el archivo directamente, con una lista de requisitos y sin ejemplos.

```text
Genera el archivo index.html completo para la landing page de BookHub, siguiendo exactamente la
propuesta de diseño aprobada.

Requisitos técnicos:
- HTML5 semántico: header, nav, main, section y footer.
- Idioma español y atributo lang="es".
- Enlaces de navegación a las secciones de la página.
- IDs descriptivos y clases en kebab-case.
- Imágenes de ejemplo con URLs de placeholder que puedan reemplazarse.
- Formulario de suscripción con nombre y correo.
- Botones y enlaces con textos descriptivos.
- Atributos alt en imágenes y etiquetas asociadas a los campos.
- No incluyas CSS ni JavaScript dentro del HTML.

Devuelve únicamente el contenido del archivo index.html.
```

**Ajustes y verificaciones sobre la respuesta:**

1. Las tarjetas de categorías, libros, beneficios y reseñas son colecciones, así que se marcaron como listas (`ul > li`) y los libros como `<article>`.
2. Cada campo del formulario tiene un contenedor de error enlazado con `aria-describedby` y `aria-live="polite"`, para que el mensaje se anuncie.
3. Se agregó el enlace "Saltar al contenido principal" y un `aria-label` a cada `<nav>`.
4. Los avatares de las reseñas llevan `alt=""` (imagen decorativa), porque el nombre ya aparece al lado y el lector de pantalla no debe repetirlo.
5. Los enlaces a redes sociales abren en otra pestaña con `rel="noopener noreferrer"` y un texto oculto que avisa que se abren en una pestaña nueva.

### P5 · styles.css (Zero-shot con restricciones)

```text
Ahora genera el archivo styles.css para el HTML anterior.

Requisitos:
- Define variables de color, tipografía, espaciados y radios en :root.
- Usa Flexbox y/o CSS Grid; no uses floats.
- Implementa diseño mobile-first y media queries.
- Incluye estados hover y focus visibles.
- Mantén contraste adecuado y tamaños legibles.
- Usa transiciones moderadas, sin efectos excesivos.
- No utilices Bootstrap, Tailwind ni otros frameworks.

Devuelve únicamente el contenido del archivo styles.css.
```

**Ajustes y verificaciones sobre la respuesta:**

1. Se revisó que las media queries fueran mobile-first (`min-width: 600px` y `min-width: 901px`) y no desktop-first.
2. El foco visible se define con `:focus-visible` y un contorno dorado de 3 px, sin quitar el `outline` del navegador sin reemplazarlo.
3. Se agregó `@media (prefers-reduced-motion: reduce)` para desactivar las transiciones.
4. Se agregó `scroll-padding-top` para que el header fijo no tape el título de la sección al navegar con los enlaces.

### P6 · Tarjeta de libro (One-shot)

**Técnica:** One-shot. Se muestra un ejemplo de tarjeta y se pide repetir el mismo patrón.

```text
Este es el ejemplo de una tarjeta de libro destacado:

<article class="libro">
  <img class="libro__portada" src="..." alt="Portada de ejemplo de Cien años de soledad">
  <div class="libro__info">
    <p class="libro__categoria">Literatura</p>
    <h3 class="libro__titulo">Cien años de soledad</h3>
    <p class="libro__autor">Gabriel García Márquez</p>
    <p class="libro__precio">$55.000</p>
  </div>
</article>

Siguiendo exactamente esta estructura, genera 3 tarjetas más para destacados y 4 para la sección
Novedades, agregando una insignia "Nuevo". Usa los títulos del dataset de BookHub.
```

**Ajuste:** las novedades se tomaron de los libros con año de publicación más reciente del dataset, para que landing y catálogo sean coherentes.

---

## Fase 2 · Dashboard administrativo

### P7 · Role prompting para el dashboard

```text
Eres un diseñador UX/UI con experiencia en dashboards administrativos de comercio electrónico y
gestión de inventarios de librerías. Diseña la estructura visual de un panel de administración para
BookHub.

El dashboard debe incluir:
- Sidebar a la izquierda con logotipo y navegación.
- Área principal con título, bienvenida y acciones rápidas.
- Diseño responsive: en pantallas pequeñas el menú debe convertirse en menú hamburguesa.
- Estilo coherente con la landing page de BookHub.

Primero describe la distribución, jerarquía, colores, tipografía e iconografía. No generes código todavía.
```

**Propuesta resultante:** sidebar verde oscuro con 5 opciones, barra superior con el usuario, saludo con acciones rápidas, KPI en una fila, y debajo catálogo, gráfico y reporte de calidad. Ver [02-propuesta-de-diseno.md](02-propuesta-de-diseno.md#dashboard-administrativo).

**Decisión:** el enunciado describe un dashboard (Fase 2) y una aplicación CRUD (Fase 5) con los mismos datos. Se unieron en un solo panel para no duplicar la tabla, los KPI ni los estilos. La tabla de la Fase 2 quedó como la vista "Tabla" del catálogo.

### P8 · Tarjetas KPI

```text
Genera el HTML y CSS de tres tarjetas KPI para el dashboard de BookHub:
1. Libros registrados: cantidad total de títulos activos en el catálogo.
2. Inventario bajo: cantidad de títulos cuya existencia sea igual o inferior al stock mínimo.
3. Valor del inventario: suma de precio por cantidad disponible, expresada en pesos colombianos (COP).

Cada tarjeta debe tener icono, título, valor destacado y una breve descripción. Usa CSS Grid o
Flexbox, diseño responsive y variables CSS. No uses frameworks.
```

**Ajustes realizados:**

1. Los valores no se escriben a mano en el HTML: cada valor tiene un `id` y `actualizarKPIs()` lo calcula con los datos reales.
2. En las pruebas a 1024 px, "$ 25.698.000" desbordaba la tarjeta y creaba scroll horizontal. Se corrigió con `min-width: 0` en los hijos de la grilla, un tamaño de fuente con `clamp()` y `white-space: nowrap`.

### P9 · Tabla de libros (Few-shot)

**Técnica:** Few-shot. Se entregan las 5 filas del enunciado como ejemplo del formato esperado.

```text
Agrega una tabla responsive con las columnas: Código, Libro, Categoría, Precio COP, Stock, Autor, Estado.
Usa estas filas como ejemplo:
LIB001 | Cien años de soledad | Literatura | $55.000 | 18 | Gabriel García Márquez | Disponible
LIB002 | Clean Code | Ciencia y tecnología | $120.000 | 4 | Robert C. Martin | Stock bajo
LIB003 | El principito | Infantil y juvenil | $32.000 | 24 | Antoine de Saint-Exupéry | Disponible
LIB004 | Sapiens | Historia | $89.000 | 0 | Yuval Noah Harari | Agotado
LIB005 | Hábitos atómicos | Desarrollo personal | $75.000 | 40 | James Clear | Disponible

- Estado con badges: Disponible (verde), Stock bajo (amarillo), Agotado (rojo).
- Filas alternadas con fondo claro.
- En móvil, desplazamiento horizontal.
- Botones de acción para editar y eliminar cada libro.
```

**Ajustes realizados:**

1. Las filas de ejemplo solo definen el formato: en la aplicación se generan desde `libros.json` con `crearFila()`.
2. El estado no se guarda en los datos. Se calcula con `calcularEstado()` (regla 12 del dataset).
3. El contenedor con scroll horizontal recibió `tabindex="0"`, `role="region"` y `aria-label` para que se pueda desplazar con el teclado.
4. Los botones de solo icono (✏️ y 🗑️) recibieron un `aria-label` con el título del libro, por ejemplo "Eliminar Clean Code".
5. Un texto amarillo sobre fondo amarillo no tiene contraste suficiente, así que el badge "Stock bajo" usa texto marrón oscuro (`#7A5200`) sobre fondo amarillo claro.

### P10 · Menú hamburguesa con JavaScript

```text
Escribe el JavaScript para controlar el menú hamburguesa del dashboard de BookHub.

Comportamiento:
1. Al hacer clic en el botón, el sidebar debe mostrarse u ocultarse con una transición CSS de 0.3 segundos.
2. El botón debe alternar entre los iconos ☰ y ×.
3. En pantallas pequeñas, al hacer clic fuera del sidebar, este debe cerrarse.
4. Debe poder cerrarse también al seleccionar una opción del menú.
5. La solución debe ser reutilizable y no utilizar jQuery.

Incluye el CSS necesario para la transición y considera accesibilidad con aria-expanded y aria-controls.
```

**Ajustes realizados:**

1. Para que fuera reutilizable de verdad y no dependiera de selectores fijos del dashboard, el código quedó en la función `crearMenuHamburguesa({ boton })`, que lee el menú desde `aria-controls`. Se movió a `compartido/menu.js` y ahora la usan la landing y el dashboard.
2. Se agregó el cierre con la tecla Escape, que devuelve el foco al botón.
3. Al probarlo, con el sidebar cerrado en móvil sus enlaces seguían recibiendo foco con Tab aunque no se veían. Se agregó `visibility: hidden` a la transición.
4. Se agregó un fondo oscuro detrás del sidebar abierto (`body.menu-abierto::before`) para indicar que el resto de la página está inactivo.

---

## Fase 3 · Dataset de libros

### P11 · Generación de 30 libros (Few-shot)

**Técnica:** Few-shot. Los 5 registros creados a mano ([`dataset/libros-ejemplo.js`](../dataset/libros-ejemplo.js)) sirven de ejemplo.

```text
Actúa como especialista en generación de datos de prueba para una librería digital. Genera 30 objetos
adicionales para el catálogo de BookHub, respetando exactamente la estructura de los cinco ejemplos
que te proporcionaré.

Reglas:
1. Los IDs deben ser únicos y consecutivos del 6 al 35.
2. Los códigos deben ser únicos y seguir el patrón LIB006 a LIB035.
3. Los títulos deben ser variados y corresponder a libros plausibles.
4. La categoría debe pertenecer exclusivamente a la lista válida.
5. El precio debe ser un número entero positivo en pesos colombianos.
6. El stock y stockMinimo deben ser enteros mayores o iguales a cero.
7. Autor y editorial deben ser textos válidos.
8. El ISBN debe tener 13 dígitos y ser único. No atribuyas un ISBN real a una obra si no puedes
   verificarlo; puedes usar identificadores ficticios de prueba y marcarlos como simulados en la documentación.
9. El año de publicación debe ser un entero entre 1450 y 2026.
10. activo debe ser un booleano real, no texto.
11. Distribuye los libros entre las categorías de forma realista.
12. No inventes un campo estado, pues se calculará en la aplicación.

Devuelve únicamente un arreglo JSON válido, sin explicaciones ni bloques Markdown.

Ejemplos de estructura:
[los 5 registros de dataset/libros-ejemplo.js]
```

**Resultado:** 30 libros ficticios con autores ficticios, repartidos entre las 6 categorías e ISBN simulados con dígito de control válido.

**Ajustes y decisiones:**

1. **Libros ficticios en vez de reales.** Para no atribuir ISBN sin verificar a obras reales, los 30 libros generados son títulos y autores ficticios pero plausibles. Los únicos libros reales son los 5 manuales, cuyos ISBN se verificaron.
2. **ISBN simulados identificables.** Todos usan el prefijo `978958990` + 3 dígitos del id + dígito de control (por ejemplo, `9789589900062` para el id 6).
3. **Escenarios de prueba.** Se pidió incluir a propósito libros agotados (stock 0), con stock bajo, uno con stock exactamente igual al mínimo (LIB019) y uno inactivo (LIB035), para probar los badges, los filtros y los KPI.
4. Se comprobó que el archivo funciona con `JSON.parse()` (sin comentarios, comas finales ni texto adicional), ejecutando `node dataset/validar-dataset.js`.

Detalle completo: [03-dataset.md](03-dataset.md).

---

## Fase 4 · Validación

### P12 · Función `validarLibros()`

```text
Crea un archivo validacion.js con una función validarLibros(lista) que revise: IDs únicos, enteros y
mayores que cero; códigos únicos con el patrón LIB + tres dígitos; título, autor y editorial no vacíos
y dentro de la longitud permitida; categoría válida; precio entero positivo; stock y stockMinimo
enteros >= 0; ISBN de 13 dígitos sin duplicados; anioPublicacion entero entre 1450 y 2026; activo
booleano. Debe devolver un arreglo de errores con el índice o ID del libro, el campo afectado y la
descripción del problema.
```

**Ajustes realizados:**

1. **Dígito de control del ISBN.** Revisar solo `/^\d{13}$/` no basta para un "ISBN-13 válido". Se agregó `esIsbn13Valido()`, que calcula el dígito de control (pesos 1 y 3).
2. **Campos faltantes y sobrantes.** Se detectan los campos obligatorios ausentes y los campos no permitidos, como un `estado` inventado.
3. **Reutilización.** La misma función valida el formulario del modal (`validarCamposLibro`), así las reglas no se escriben dos veces.
4. **Mensajes comprensibles.** Al principio el formulario mostraba "Debe ser un entero positivo (valor: null)" cuando un campo estaba vacío. Se agregó un caso "Campo obligatorio: no puede estar vacío." y las reglas quedaron en una tabla `REGLAS_CAMPOS` (una regla y un mensaje por campo).
5. **Funciona en Node y en el navegador** (`module.exports` condicional), para generar el reporte por consola.

### P13 · Meta-validación con IA

```text
Actúa como auditor de calidad de datos para BookHub. Revisa el siguiente dataset JSON y detecta:
1. Valores inconsistentes o fuera de las restricciones.
2. IDs o códigos repetidos o no válidos.
3. Títulos, autores o editoriales vacíos, poco realistas o repetitivos.
4. Categorías que no pertenezcan a la lista permitida.
5. Precios, stock o stock mínimo incoherentes.
6. ISBN con formato incorrecto o duplicados.
7. Años de publicación fuera del rango.
8. Tipos de datos incorrectos.

Presenta un informe en una tabla con: error encontrado, registro afectado, causa probable y
corrección sugerida.

No modifiques el dataset automáticamente. Primero explica los hallazgos.

[dataset/libros-v1-sin-corregir.json + reporte de validarLibros()]
```

**Resultado:** `validarLibros()` reportó 0 errores de formato. La auditoría encontró problemas de coherencia que una regla automática no puede ver. El principal: el ISBN del ejemplo LIB001 no corresponde a la editorial ni al año escritos. Ver [04-reporte-de-validacion.md](04-reporte-de-validacion.md).

---

## Fase 5 · Aplicación CRUD

### P14 · app.js por funciones

**Técnica:** descomposición. En lugar de pedir "toda la aplicación", se pidió una función a la vez, con la firma y la responsabilidad de la tabla del enunciado:

```text
Con el index.html del dashboard, validacion.js y libros.json, escribe en app.js la función
cargarLibros(): debe consultar localStorage con la clave "bookhub.libros"; si existe un arreglo
válido, devolverlo; si no, cargar libros.json con fetch(), guardarlo en localStorage y devolverlo.
Maneja el error si el JSON guardado está dañado o si fetch falla.
```

Se repitió el mismo formato para `guardarLibros()`, `renderizarLibros(lista)`, `filtrarLibros()`, `abrirModal(id)`, `guardarLibro()`, `eliminarLibro(id)`, `actualizarKPIs()` y `actualizarGrafico()`.

**Ajustes realizados:**

1. **Filtros sobre el arreglo original.** Se verificó que `filtrarLibros()` nunca reasigne `libros = libros.filter(...)`, porque al cambiar de criterio se perderían registros. El filtro devuelve una lista nueva y `libros` no se modifica.
2. **Búsqueda sin tildes.** Para que "garcia" encuentre "García", se normaliza el texto con `normalize("NFD")`.
3. **Seguridad.** Las tarjetas se construyen con plantillas de texto. Se agregó `escaparHTML()` para que un título escrito en el formulario no se interprete como HTML.
4. **Gráfico.** Se crea una sola vez y en cada cambio se actualiza con `grafico.update()`, en vez de destruirlo y volver a crearlo.
5. **Mensajes de estado.** Se agregaron un mensaje para búsquedas sin resultados, otro para catálogo vacío y otro para cuando `fetch()` falla porque el HTML se abrió con `file://` (indica usar Live Server).
6. **Modal accesible.** El foco va al primer campo al abrir y vuelve al botón que lo abrió al cerrar. Se cierra con Escape o con un clic en el fondo, y Tab no sale del modal.
7. **Código automático.** El código `LIBxxx` se genera a partir del id siguiente y el campo es de solo lectura, para evitar códigos repetidos o mal escritos.

### P15 · Depuración con pruebas

**Técnica:** Chain of Thought aplicado a depurar. Ante cada error se describió el síntoma y se pidió "explica la causa paso a paso antes de proponer la corrección".

| Síntoma encontrado en las pruebas | Causa | Corrección |
|---|---|---|
| Scroll horizontal en el dashboard a 1024 px | El valor del KPI ensanchaba la columna de la grilla | `min-width: 0` en los hijos de la grilla y `clamp()` en la fuente |
| Filtros apretados ("Toda:") entre 901 y 1199 px | Grilla de 5 columnas en un ancho insuficiente | Las 5 columnas se aplican desde 1200 px; antes se usan 2 |
| Enlaces del sidebar cerrado reciben foco con Tab | `transform` oculta el sidebar a la vista pero no al teclado | `visibility: hidden` en la transición |
| Error 404 en la consola | El navegador pide `favicon.ico` | Favicon SVG en línea |
| Mensajes técnicos en el formulario ("valor: null") | La regla no distinguía un campo vacío de un valor inválido | Mensaje "Campo obligatorio" para campos vacíos |
| El sidebar siempre marcaba "Resumen" | `aria-current` solo cambiaba al hacer clic | `IntersectionObserver` marca la sección visible |

Las 44 pruebas automáticas que se ejecutaron al final están en [05-pruebas-y-evidencias.md](05-pruebas-y-evidencias.md).
