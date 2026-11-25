# 02 · Propuesta de diseño

Esta es la propuesta de diseño obtenida con Chain of Thought (prompt P3 para la landing y P7 para el dashboard, ver [01-registro-de-prompts.md](01-registro-de-prompts.md)). Se revisó y se aprobó antes de pedir cualquier código.

## Landing page

### 1. Secciones y objetivo de cada una

| # | Sección | Objetivo |
|---|---|---|
| 1 | Header con logo, navegación y botón "Explorar catálogo" | Orientar al visitante y dejar la acción principal siempre visible (header fijo) |
| 2 | Hero | Explicar en una frase qué es BookHub y llevar al catálogo |
| 3 | Categorías (6) | Que cada tipo de lector encuentre rápido su área de interés |
| 4 | Libros destacados y novedades | Mostrar producto real: portada, autor y precio en COP |
| 5 | "Tu próxima lectura comienza aquí" | Responder objeciones de compra: envíos, búsqueda, pagos, recomendaciones |
| 6 | Reseñas de lectores | Generar confianza con testimonios (ficticios en el prototipo) |
| 7 | Suscripción | Captar correos para el boletín mensual |
| 8 | Footer | Enlaces secundarios, redes sociales y acceso al panel administrativo |

### 2. Jerarquía visual y orden de lectura

Lectura en "Z" en el hero: título grande arriba a la izquierda, imagen a la derecha y botones debajo del texto. Después, las secciones se apilan de lo general a lo particular (categorías → libros → beneficios → confianza → conversión). Los fondos alternan entre crema y beige para separar las secciones sin usar líneas, y el bloque de suscripción va en verde oscuro para marcar el cierre.

### 3. Paleta de colores

| Rol | Color | Uso | Por qué |
|---|---|---|---|
| Primario | `#1F4D3F` verde biblioteca | Botones, títulos, footer | Conocimiento y confianza (lámparas y tapizados de biblioteca) |
| Primario oscuro | `#163A2F` | Hover, footer, sidebar | Profundidad y contraste |
| Acento | `#B5471B` terracota | Etiquetas, botón de suscripción | Calidez y cercanía, contrasta con el verde |
| Dorado | `#E0B04F` | Foco visible, insignia "Nuevo" | Señal de atención sobre fondos oscuros |
| Fondo | `#FBF7F0` crema papel | Fondo general | Evoca el papel de un libro y cansa menos que el blanco puro |
| Texto | `#1E1B18` / `#5C554C` | Texto principal y secundario | Casi negro, cálido |

**Contraste medido (WCAG 2.1):**

| Combinación | Contraste | Nivel |
|---|---|---|
| Blanco sobre verde `#1F4D3F` | 9,58:1 | AAA |
| Blanco sobre terracota `#B5471B` | 5,41:1 | AA |
| Terracota sobre crema `#FBF7F0` | 5,07:1 | AA |
| Texto secundario `#5C554C` sobre crema | 6,88:1 | AA |
| Dorado `#E0B04F` sobre verde oscuro | 6,24:1 | AA |
| Badge "Stock bajo" `#7A5200` sobre `#FDF0C4` | 6,08:1 | AA |
| Badge "Agotado" `#A3261B` sobre `#FDE0DC` | 5,92:1 | AA |
| Badge "Disponible" `#1E6B3A` sobre `#DCF2E3` | 5,55:1 | AA |

### 4. Tipografía

- **Títulos:** Fraunces (serif editorial), peso 600–700. Da el aire de libro y de editorial.
- **Texto e interfaz:** Inter (sans-serif), 400–600. Muy legible en pantalla y en tamaños pequeños.
- **Tamaños:** base de 16 px. Los títulos usan `clamp()` para crecer con la pantalla: H1 de 32 a 52 px, H2 de 28 a 40 px. Las etiquetas van a 13 px en mayúsculas con espaciado.
- Si Google Fonts no carga, se usan Georgia y la fuente del sistema.

### 5. Componentes visuales

Botón primario, secundario (borde) y de acento; etiqueta de sección; tarjeta de categoría con icono; tarjeta de libro (portada 5:7, categoría, título, autor, precio); insignia "Nuevo"; tarjeta de beneficio con borde lateral; tarjeta de reseña con avatar; formulario con mensajes de error por campo; menú hamburguesa.

### 6. Accesibilidad y responsive

- HTML semántico, `lang="es"`, enlace "Saltar al contenido principal".
- Foco visible con `:focus-visible` (contorno dorado de 3 px).
- Textos alternativos en las imágenes. Las decorativas llevan `alt=""`.
- Áreas táctiles de al menos 44 px.
- Errores del formulario anunciados con `aria-live` y campos marcados con `aria-invalid`.
- `prefers-reduced-motion` desactiva las transiciones.
- **Mobile-first** con puntos de quiebre en 600 px (2 columnas) y 901 px (menú horizontal y grillas de 3 y 4 columnas).

## Dashboard administrativo

### Distribución

```
┌──────────────┬─────────────────────────────────────────────┐
│  SIDEBAR     │  Barra superior: ☰ · título · usuario       │
│  (260 px)    ├─────────────────────────────────────────────┤
│              │  Hola, administrador   [+ Agregar] [Bajo]   │
│  Resumen     │  ┌─KPI─┐ ┌─KPI─┐ ┌─KPI─┐                    │
│  Catálogo    │  └─────┘ └─────┘ └─────┘                    │
│  Estadíst.   │  Catálogo: filtros · Tarjetas / Tabla       │
│  Calidad     │  Gráfico: libros por categoría              │
│  Ver tienda  │  Calidad de datos: reporte validarLibros()  │
│  [Restablecer]                                             │
└──────────────┴─────────────────────────────────────────────┘
```

- **Hasta 900 px:** el sidebar se oculta a la izquierda y se abre con el botón ☰ (transición de 0,3 s) sobre un fondo oscuro.
- **Desde 901 px:** el sidebar queda fijo y el contenido se desplaza 260 px a la derecha.

### Jerarquía

1. Saludo y acciones rápidas: lo que el administrador hace más seguido.
2. KPI: el estado del inventario de un vistazo.
3. Catálogo: el área de trabajo (buscar, filtrar, crear, editar, eliminar).
4. Gráfico y calidad de datos: análisis y control.

### Colores, tipografía e iconografía

- Mismas variables de color y fuentes que la landing, así el panel se reconoce como parte de BookHub.
- Sidebar en verde oscuro `#163A2F`, con la opción activa marcada por una barra dorada.
- Estados del inventario con colores semánticos: verde (Disponible), amarillo (Stock bajo) y rojo (Agotado), siempre acompañados de texto, nunca solo color.
- Iconos con emoji Unicode (📚 ⚠️ 💰 ✏️ 🗑️), sin librerías externas, marcados con `aria-hidden="true"`. Los botones de solo icono llevan `aria-label`.
