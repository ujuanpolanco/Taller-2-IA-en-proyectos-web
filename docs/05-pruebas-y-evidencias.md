# 05 · Pruebas y evidencias

Las pruebas se hicieron sirviendo el proyecto con un servidor local (`python -m http.server`) y abriéndolo en Google Chrome. Además de revisarlo a mano, se automatizaron **44 comprobaciones** en un navegador real (Chrome controlado con Playwright) en tres anchos de pantalla. **Resultado: 44/44 correctas y sin errores en la consola.**

## Resultados

### Landing page

| Prueba | Resultado |
|---|---|
| Sin desbordamiento horizontal a 360, 768 y 1280 px | ✅ |
| El menú móvil se abre (`aria-expanded="true"`) y el icono cambia de ☰ a × | ✅ |
| El menú se cierra al elegir una opción | ✅ |
| Enviar el formulario vacío o con correo inválido muestra un error por campo | ✅ "Escribe tu nombre." / "Revisa el correo: debe tener el formato nombre@dominio.com." |
| Enviar el formulario válido muestra la confirmación | ✅ "¡Gracias, Laura! Te enviaremos las novedades de BookHub a tu correo." |

### Dashboard: carga, KPI y gráfico

| Prueba | Resultado |
|---|---|
| Sin localStorage, carga los 35 libros de `libros.json` y los guarda en localStorage | ✅ |
| KPI calculados con los datos reales | ✅ 34 libros activos · 11 con inventario bajo · $25.698.000 |
| La tabla tiene las 7 columnas de datos más las acciones | ✅ |
| El gráfico de Chart.js muestra los libros activos por categoría | ✅ 7 · 6 · 5 · 5 · 6 · 5 |
| El panel de calidad muestra 0 errores | ✅ |
| Sin desbordamiento a 375, 768 y 1366 px | ✅ |

### Búsqueda y filtros

| Prueba | Resultado |
|---|---|
| Buscar "garcia" (sin tilde) encuentra "Gabriel García Márquez" | ✅ 1 resultado |
| Filtros combinados: Literatura → + Disponible → + Alfaguara | ✅ 7 → 5 → 2 |
| Cambiar un criterio no borra registros del conjunto original | ✅ siguen 35 en localStorage |
| Búsqueda sin coincidencias muestra un mensaje de estado vacío | ✅ |
| "Limpiar filtros" restaura los 35 libros | ✅ |

### CRUD y persistencia

| Prueba | Resultado |
|---|---|
| "Agregar libro" abre el modal con el código automático LIB036 | ✅ |
| Guardar con campos vacíos, ISBN repetido y año 2030 muestra los errores | ✅ 9 errores; "Ya existe otro libro con este ISBN." |
| Crear un libro válido: aparece en el catálogo sin recargar | ✅ 36 libros |
| Al crear, se actualizan los KPI (35 activos) y el gráfico (Educación 5 → 6) | ✅ |
| Al recargar la página, el libro creado sigue ahí (localStorage) | ✅ |
| "Editar" precarga los datos del libro | ✅ |
| Editar el stock a 0 cambia el badge a "Agotado" | ✅ |
| "Eliminar" pide confirmación y Cancelar no borra | ✅ |
| Aceptar borra el libro y el cambio se mantiene al recargar | ✅ 35 libros |

### Menú hamburguesa del dashboard

| Prueba | Resultado |
|---|---|
| A 375 y 768 px el sidebar empieza oculto | ✅ |
| El botón ☰ lo abre con una transición de 0,3 s | ✅ |
| Un clic fuera del sidebar lo cierra | ✅ |
| Elegir una opción del menú lo cierra | ✅ |

## Capturas de pantalla

| # | Captura | Qué muestra |
|---|---|---|
| 01 | [Landing escritorio 1280 px](../evidencias/01-landing-escritorio-1280px.png) | Página completa |
| 02 | [Landing tablet 768 px](../evidencias/02-landing-tablet-768px.png) | Página completa |
| 03 | [Landing móvil 360 px](../evidencias/03-landing-movil-360px.png) | Página completa |
| 04 | [Menú móvil abierto](../evidencias/04-landing-menu-movil-360px.png) | Icono ×, enlaces y CTA |
| 05 | [Formulario con errores](../evidencias/05-landing-formulario-errores-360px.png) | Validación con mensajes por campo |
| 06 | [Dashboard: resumen y KPI](../evidencias/06-dashboard-resumen-kpi.png) | Sidebar, bienvenida, acciones rápidas, KPI |
| 07 | [Tabla de inventario](../evidencias/07-dashboard-tabla-inventario.png) | 7 columnas, badges, filas alternadas, acciones |
| 08 | [Menú hamburguesa 375 px](../evidencias/08-dashboard-menu-hamburguesa-375px.png) | Sidebar abierto en móvil |
| 09 | [Menú hamburguesa 768 px](../evidencias/09-dashboard-menu-hamburguesa-768px.png) | Sidebar abierto en tablet |
| 10 | [Dashboard móvil](../evidencias/10-dashboard-movil-375px.png) | Filtros apilados y tabla con scroll horizontal |
| 11 | [Catálogo en tarjetas](../evidencias/11-catalogo-tarjetas.png) | Grid de tarjetas con estado calculado |
| 12 | [Filtros combinados](../evidencias/12-filtros-combinados.png) | Literatura + Alfaguara + Disponible → 2 de 35 |
| 13 | [Sin resultados](../evidencias/13-estado-sin-resultados.png) | Mensaje de estado vacío |
| 14 | [Modal: agregar libro](../evidencias/14-modal-agregar-libro.png) | Formulario completo |
| 15 | [Modal: validación](../evidencias/15-modal-validacion-errores.png) | Errores por campo e ISBN duplicado |
| 16 | [Modal: editar libro](../evidencias/16-modal-editar-libro.png) | Datos precargados |
| 17 | [Gráfico por categoría](../evidencias/17-grafico-libros-por-categoria.png) | Chart.js con datos actualizados |
| 18 | [Calidad de datos](../evidencias/18-calidad-datos-sin-errores.png) | `validarLibros()` en vivo: 0 errores |
| 19 | [Calidad con casos de prueba](../evidencias/19-calidad-datos-casos-prueba.png) | Los 19 errores intencionales detectados |

## Accesibilidad revisada

- Navegación completa con teclado: Tab, Shift+Tab y Escape cierran el menú y el modal. El foco no sale del modal mientras está abierto.
- Foco visible en todos los elementos interactivos (contorno dorado).
- Contraste AA o superior en todas las combinaciones de texto (ver [02-propuesta-de-diseno.md](02-propuesta-de-diseno.md#3-paleta-de-colores)).
- Botones de solo icono con `aria-label` ("Editar Clean Code", "Eliminar Clean Code").
- Mensajes dinámicos anunciados con `aria-live` (contador de resultados, avisos, errores del formulario).
- `prefers-reduced-motion` respetado en las dos páginas.
