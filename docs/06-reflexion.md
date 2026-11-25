# 06 · Preguntas de reflexión

### 1. ¿Qué diferencias encontré entre zero-shot, one-shot y few-shot prompting?

- **Zero-shot** (index.html, styles.css, KPI) sirve para pedir algo que la IA ya sabe hacer, siempre que la lista de requisitos sea muy precisa. Sin ejemplos, la IA decide por su cuenta cosas que no se especificaron (nombres de clases, el orden de las media queries, cómo marcar el foco), así que hay que revisar más.
- **One-shot** (tarjeta de libro) fue lo más eficiente para repetir un componente: con un solo ejemplo, la IA copió la misma estructura y las mismas clases en las 8 tarjetas, sin variaciones.
- **Few-shot** (dataset de 30 libros) fue indispensable para los datos. Con cinco ejemplos completos, la IA respetó los nombres de los campos, los tipos (números como números y `true` como booleano, no como texto) y el formato del código `LIBxxx`. Con un solo ejemplo es más fácil que copie también los valores (la misma editorial, precios parecidos). Con varios entiende qué es fijo y qué debe variar.

En resumen: entre más estructura necesita la respuesta, más ejemplos conviene dar.

### 2. ¿Por qué es importante definir la estructura y las reglas del dataset antes de generarlo con IA?

Porque la estructura es el **contrato** que comparten el JSON, el formulario, la validación y la interfaz. Si se genera primero y se define después, los nombres de los campos no coinciden (`año` vs `anioPublicacion`, `precioCOP` vs `precio`), aparecen campos que no deberían estar (como un `estado` que en realidad se calcula) y cada archivo interpreta los datos a su manera. Con las reglas escritas antes, el prompt few-shot las incluyó y la versión generada pasó `validarLibros()` sin errores de formato desde la primera vez. Además, las mismas reglas se convirtieron en código (`REGLAS_CAMPOS`) y se reutilizan en el formulario del modal.

### 3. ¿Qué errores detectó la validación programática que no había identificado manualmente?

La validación programática encontró problemas que a simple vista pasan por correctos: un ISBN de 13 dígitos con el **dígito de control incorrecto**, `"45000"` escrito como texto en lugar de número, `"true"` como texto, un `2.5` en un campo entero y valores duplicados entre registros lejanos. Ninguno se nota leyendo el JSON, y todos aparecen en los casos de prueba (19 de 19 detectados).

También enseñó lo contrario: hay errores que **ninguna regla automática ve**. El ISBN del ejemplo del enunciado tiene formato y dígito de control válidos, pero corresponde a otra edición (Vintage Español 2009, no Sudamericana 1967). Solo se encontró al verificarlo contra una fuente externa. La validación con código y la revisión humana o de la IA se complementan; ninguna reemplaza a la otra.

### 4. ¿Qué ventajas ofrece separar los datos, la lógica JavaScript y la presentación HTML/CSS?

- **Cambiar una parte sin romper las otras:** se pueden reemplazar los 35 libros de `libros.json` sin tocar el código, o cambiar la paleta en `:root` sin tocar el HTML.
- **Reutilizar:** `validacion.js` se usa en el navegador y en Node, y `menu.js` en la landing y en el dashboard.
- **Probar por separado:** el dataset se valida desde la consola, sin abrir la página.
- **Trabajar con la IA por partes:** cada prompt pide un archivo con una sola responsabilidad. Las respuestas son más cortas y más fáciles de revisar.
- **Mantener:** cuando algo falla, se sabe en qué archivo buscar.

### 5. ¿Qué limitaciones tiene localStorage frente a una base de datos real?

- **Solo existe en un navegador y un dispositivo.** Otro administrador, u otro computador, no ve los cambios.
- **Capacidad pequeña** (unos 5 MB) y solo guarda texto, así que todo se serializa con `JSON.stringify`.
- **Sin seguridad ni usuarios:** cualquiera con acceso al navegador puede leer o editar los datos desde las herramientas de desarrollo.
- **Sin integridad:** no hay claves únicas, transacciones ni validación del lado del servidor. Si dos pestañas guardan a la vez, la última sobrescribe a la primera.
- **Sin consultas:** para filtrar hay que cargar todo el arreglo en memoria.
- **Se puede perder** si el usuario borra los datos del navegador.

### 6. ¿Qué cambios haría para convertir el prototipo en una aplicación lista para producción?

1. **Backend y base de datos** (por ejemplo, una API REST con PostgreSQL) que guarde los libros, con validación también del lado del servidor y restricciones `UNIQUE` en código e ISBN.
2. **Autenticación y roles:** el panel administrativo solo para usuarios autorizados.
3. **Datos reales:** ISBN verificados contra una fuente bibliográfica, portadas reales y precios conectados al inventario.
4. **Carrito y pagos** en la tienda, con una pasarela de pago integrada.
5. **Paginación y búsqueda en el servidor** para catálogos de miles de libros.
6. **Pruebas automáticas** (como las 44 de este proyecto) ejecutadas en integración continua en cada cambio.
7. **Despliegue con HTTPS**, imágenes optimizadas y fuentes alojadas en el propio sitio.
8. **Accesibilidad auditada** con lectores de pantalla reales y **analítica** para medir qué buscan los lectores.
