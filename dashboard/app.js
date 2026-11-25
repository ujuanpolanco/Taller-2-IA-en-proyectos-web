/**
 * BookHub - Fase 5: carga de datos, renderizado, busqueda, filtros, CRUD,
 * persistencia en localStorage, KPI y grafico.
 *
 * Depende de validacion.js (CATEGORIAS_VALIDAS, validarCamposLibro, validarLibros)
 * y de ../compartido/menu.js (crearMenuHamburguesa).
 *
 * Nota: libros.json se carga con fetch(), por eso el proyecto debe abrirse desde
 * un servidor local (por ejemplo, Live Server) y no como archivo (file://).
 */

const CLAVE_STORAGE = "bookhub.libros";
const RUTA_DATASET = "libros.json";

let libros = [];          // Conjunto original: los filtros nunca lo modifican.
let grafico = null;       // Instancia de Chart.js.
let idEnEdicion = null;   // null = creando un libro nuevo.
let elementoConFocoPrevio = null;

const elementos = {
  lista: document.getElementById("lista-libros"),
  vistaTabla: document.getElementById("vista-tabla"),
  cuerpoTabla: document.getElementById("cuerpo-tabla"),
  contador: document.getElementById("contador-resultados"),
  mensajeEstado: document.getElementById("mensaje-estado"),
  filtros: document.getElementById("filtros"),
  busqueda: document.getElementById("filtro-busqueda"),
  filtroCategoria: document.getElementById("filtro-categoria"),
  filtroEditorial: document.getElementById("filtro-editorial"),
  filtroEstado: document.getElementById("filtro-estado"),
  kpiRegistrados: document.getElementById("kpi-registrados"),
  kpiBajo: document.getElementById("kpi-bajo"),
  kpiValor: document.getElementById("kpi-valor"),
  modal: document.getElementById("modal-libro"),
  tituloModal: document.getElementById("titulo-modal"),
  formulario: document.getElementById("formulario-libro"),
  campoCategoria: document.getElementById("campo-categoria"),
  listaEditoriales: document.getElementById("lista-editoriales"),
  reporte: document.getElementById("reporte-validacion"),
  avisos: document.getElementById("avisos"),
  graficoError: document.getElementById("grafico-error")
};

/* ==========================================================================
   Utilidades
   ========================================================================== */

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function formatearCOP(valor) {
  return formatoCOP.format(valor);
}

/** Evita que un texto escrito por el usuario se interprete como HTML. */
function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Agotado si stock = 0; Stock bajo si 0 < stock <= stockMinimo; Disponible en otro caso. */
function calcularEstado(libro) {
  if (libro.stock === 0) return "Agotado";
  if (libro.stock <= libro.stockMinimo) return "Stock bajo";
  return "Disponible";
}

const CLASE_ESTADO = {
  "Disponible": "insignia--disponible",
  "Stock bajo": "insignia--bajo",
  "Agotado": "insignia--agotado"
};

function crearInsigniaEstado(libro) {
  const estado = calcularEstado(libro);
  return `<span class="insignia ${CLASE_ESTADO[estado]}">${estado}</span>`;
}

function mostrarAviso(mensaje, tipo = "exito") {
  const aviso = document.createElement("p");
  aviso.className = `aviso aviso--${tipo}`;
  aviso.textContent = mensaje;
  elementos.avisos.append(aviso);
  setTimeout(() => aviso.remove(), 3500);
}

function siguienteId() {
  return libros.reduce((mayor, libro) => Math.max(mayor, libro.id), 0) + 1;
}

function crearCodigo(id) {
  return `LIB${String(id).padStart(3, "0")}`;
}

/* ==========================================================================
   Carga y persistencia
   ========================================================================== */

async function cargarDatasetInicial() {
  const respuesta = await fetch(RUTA_DATASET);
  if (!respuesta.ok) {
    throw new Error(`No se pudo leer ${RUTA_DATASET} (HTTP ${respuesta.status}).`);
  }
  return respuesta.json();
}

/** Usa los datos de localStorage si existen; si no, carga libros.json. */
async function cargarLibros() {
  const guardados = localStorage.getItem(CLAVE_STORAGE);
  if (guardados) {
    try {
      const datos = JSON.parse(guardados);
      if (Array.isArray(datos)) return datos;
    } catch {
      mostrarAviso("Los datos guardados estaban dañados; se cargó el dataset inicial.", "error");
    }
  }
  const datos = await cargarDatasetInicial();
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
  return datos;
}

function guardarLibros() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(libros));
}

/* ==========================================================================
   Renderizado
   ========================================================================== */

function crearTarjeta(libro) {
  return `
    <li>
      <article class="tarjeta-libro${libro.activo ? "" : " tarjeta-libro--inactivo"}">
        <header class="tarjeta-libro__encabezado">
          <span class="tarjeta-libro__codigo">${escaparHTML(libro.codigo)}</span>
          ${crearInsigniaEstado(libro)}
        </header>
        <h3 class="tarjeta-libro__titulo">${escaparHTML(libro.titulo)}</h3>
        <p class="tarjeta-libro__meta">${escaparHTML(libro.categoria)} · ${libro.anioPublicacion}</p>
        <dl class="tarjeta-libro__datos">
          <div><dt>Autor</dt><dd>${escaparHTML(libro.autor)}</dd></div>
          <div><dt>Editorial</dt><dd>${escaparHTML(libro.editorial)}</dd></div>
          <div><dt>ISBN</dt><dd>${escaparHTML(libro.isbn)}</dd></div>
          <div><dt>Stock</dt><dd>${libro.stock} <small>(mín. ${libro.stockMinimo})</small></dd></div>
        </dl>
        <p class="tarjeta-libro__precio">${formatearCOP(libro.precio)}</p>
        ${libro.activo ? "" : '<p class="tarjeta-libro__inactivo">Inactivo: no se muestra en la tienda</p>'}
        <footer class="tarjeta-libro__acciones">
          <button class="boton boton--secundario boton--pequeno" type="button" data-editar="${libro.id}" aria-label="Editar ${escaparHTML(libro.titulo)}">✏️ Editar</button>
          <button class="boton boton--peligro boton--pequeno" type="button" data-eliminar="${libro.id}" aria-label="Eliminar ${escaparHTML(libro.titulo)}">🗑️ Eliminar</button>
        </footer>
      </article>
    </li>`;
}

function crearFila(libro) {
  return `
    <tr${libro.activo ? "" : ' class="fila--inactiva"'}>
      <td>${escaparHTML(libro.codigo)}</td>
      <td class="tabla__libro">${escaparHTML(libro.titulo)}</td>
      <td>${escaparHTML(libro.categoria)}</td>
      <td class="tabla__numero">${formatearCOP(libro.precio)}</td>
      <td class="tabla__numero">${libro.stock}</td>
      <td>${escaparHTML(libro.autor)}</td>
      <td>${crearInsigniaEstado(libro)}</td>
      <td class="tabla__acciones">
        <button class="boton-icono" type="button" data-editar="${libro.id}" aria-label="Editar ${escaparHTML(libro.titulo)}" title="Editar">✏️</button>
        <button class="boton-icono boton-icono--peligro" type="button" data-eliminar="${libro.id}" aria-label="Eliminar ${escaparHTML(libro.titulo)}" title="Eliminar">🗑️</button>
      </td>
    </tr>`;
}

/** Construye las tarjetas y las filas de la tabla con la lista recibida. */
function renderizarLibros(lista) {
  elementos.lista.innerHTML = lista.map(crearTarjeta).join("");
  elementos.cuerpoTabla.innerHTML = lista.map(crearFila).join("");

  const hayFiltros = elementos.busqueda.value || elementos.filtroCategoria.value ||
    elementos.filtroEditorial.value || elementos.filtroEstado.value;

  elementos.contador.textContent = hayFiltros
    ? `Mostrando ${lista.length} de ${libros.length} libros`
    : `${libros.length} libros en el catálogo`;

  if (lista.length === 0) {
    mostrarMensajeEstado(
      libros.length === 0
        ? "No hay libros registrados. Usa “Agregar libro” para crear el primero."
        : "Ningún libro coincide con la búsqueda y los filtros. Prueba con otros criterios o limpia los filtros."
    );
  } else {
    elementos.mensajeEstado.hidden = true;
  }
}

function mostrarMensajeEstado(texto, tipo = "info") {
  elementos.mensajeEstado.textContent = texto;
  elementos.mensajeEstado.className = `mensaje-estado mensaje-estado--${tipo}`;
  elementos.mensajeEstado.hidden = false;
}

/* ==========================================================================
   Busqueda y filtros (siempre sobre el arreglo original `libros`)
   ========================================================================== */

function normalizar(texto) {
  return String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function filtrarLibros() {
  const termino = normalizar(elementos.busqueda.value.trim());
  const categoria = elementos.filtroCategoria.value;
  const editorial = elementos.filtroEditorial.value;
  const estado = elementos.filtroEstado.value;

  const resultado = libros.filter((libro) => {
    const coincideTexto = termino === "" ||
      [libro.titulo, libro.autor, libro.editorial, libro.isbn].some((valor) => normalizar(valor).includes(termino));
    const coincideCategoria = categoria === "" || libro.categoria === categoria;
    const coincideEditorial = editorial === "" || libro.editorial === editorial;
    const coincideEstado = estado === "" || calcularEstado(libro) === estado;
    return coincideTexto && coincideCategoria && coincideEditorial && coincideEstado;
  });

  renderizarLibros(resultado);
  return resultado;
}

function llenarOpciones(select, valores, textoTodos) {
  const seleccionActual = select.value;
  select.innerHTML = `<option value="">${textoTodos}</option>` +
    valores.map((valor) => `<option value="${escaparHTML(valor)}">${escaparHTML(valor)}</option>`).join("");
  if (valores.includes(seleccionActual)) select.value = seleccionActual;
}

/** Las editoriales salen de los datos, por eso se recalculan tras cada cambio. */
function actualizarOpcionesEditorial() {
  const editoriales = [...new Set(libros.map((libro) => libro.editorial))].sort((a, b) => a.localeCompare(b, "es"));
  llenarOpciones(elementos.filtroEditorial, editoriales, "Todas");
  elementos.listaEditoriales.innerHTML = editoriales.map((e) => `<option value="${escaparHTML(e)}"></option>`).join("");
}

/* ==========================================================================
   KPI, grafico y reporte de calidad
   ========================================================================== */

function actualizarKPIs() {
  const activos = libros.filter((libro) => libro.activo);
  const inventarioBajo = activos.filter((libro) => libro.stock <= libro.stockMinimo).length;
  const valorInventario = activos.reduce((total, libro) => total + libro.precio * libro.stock, 0);

  elementos.kpiRegistrados.textContent = activos.length;
  elementos.kpiBajo.textContent = inventarioBajo;
  elementos.kpiValor.textContent = formatearCOP(valorInventario);
}

function contarPorCategoria() {
  return CATEGORIAS_VALIDAS.map(
    (categoria) => libros.filter((libro) => libro.activo && libro.categoria === categoria).length
  );
}

function actualizarGrafico() {
  if (typeof Chart === "undefined") {
    elementos.graficoError.hidden = false;
    return;
  }

  const datos = contarPorCategoria();
  if (grafico) {
    grafico.data.datasets[0].data = datos;
    grafico.update();
    return;
  }

  grafico = new Chart(document.getElementById("grafico-categorias"), {
    type: "bar",
    data: {
      labels: CATEGORIAS_VALIDAS,
      datasets: [{
        label: "Libros activos",
        data: datos,
        backgroundColor: ["#1f4d3f", "#2b4c7e", "#b5471b", "#8a5a2b", "#d49a2a", "#4f7a5e"],
        borderRadius: 6,
        maxBarThickness: 56
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: "Cantidad de libros" } },
        x: { ticks: { autoSkip: false } }
      }
    }
  });
}

function renderizarReporteValidacion() {
  const errores = validarLibros(libros);
  if (errores.length === 0) {
    elementos.reporte.innerHTML = `
      <p class="mensaje-estado mensaje-estado--exito">
        ✅ ${libros.length} registros revisados: el catálogo cumple todas las reglas de negocio.
      </p>`;
    return;
  }

  elementos.reporte.innerHTML = `
    <p class="mensaje-estado mensaje-estado--error">⚠️ ${errores.length} problema(s) en ${libros.length} registros.</p>
    <div class="tabla-contenedor" tabindex="0" role="region" aria-label="Errores de validación">
      <table class="tabla">
        <thead><tr><th scope="col">Índice</th><th scope="col">ID</th><th scope="col">Campo</th><th scope="col">Descripción</th></tr></thead>
        <tbody>
          ${errores.map((e) => `<tr><td>${e.indice}</td><td>${escaparHTML(e.id)}</td><td>${escaparHTML(e.campo)}</td><td>${escaparHTML(e.descripcion)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

/** Tras cualquier cambio en los datos: guardar y refrescar toda la interfaz. */
function actualizarInterfaz() {
  actualizarOpcionesEditorial();
  filtrarLibros();
  actualizarKPIs();
  actualizarGrafico();
  renderizarReporteValidacion();
}

/* ==========================================================================
   Modal y CRUD
   ========================================================================== */

function limpiarErroresFormulario() {
  elementos.formulario.querySelectorAll("[data-error]").forEach((p) => (p.textContent = ""));
  elementos.formulario.querySelectorAll("[aria-invalid]").forEach((campo) => campo.removeAttribute("aria-invalid"));
}

/** Abre el formulario; si recibe un id, precarga ese libro para editarlo. */
function abrirModal(id = null) {
  const formulario = elementos.formulario;
  formulario.reset();
  limpiarErroresFormulario();
  idEnEdicion = id;

  if (id === null) {
    elementos.tituloModal.textContent = "Agregar libro";
    formulario.codigo.value = crearCodigo(siguienteId());
    formulario.activo.checked = true;
  } else {
    const libro = libros.find((item) => item.id === id);
    if (!libro) return;
    elementos.tituloModal.textContent = `Editar ${libro.codigo}`;
    ["codigo", "titulo", "autor", "editorial", "categoria", "isbn", "precio", "anioPublicacion", "stock", "stockMinimo"]
      .forEach((campo) => (formulario[campo].value = libro[campo]));
    formulario.activo.checked = libro.activo;
  }

  elementoConFocoPrevio = document.activeElement;
  elementos.modal.hidden = false;
  document.body.classList.add("modal-abierto");
  formulario.titulo.focus();
}

function cerrarModal() {
  elementos.modal.hidden = true;
  document.body.classList.remove("modal-abierto");
  idEnEdicion = null;
  if (elementoConFocoPrevio) elementoConFocoPrevio.focus();
}

function leerNumero(valor) {
  return valor.trim() === "" ? null : Number(valor);
}

function leerFormulario() {
  const f = elementos.formulario;
  const id = idEnEdicion ?? siguienteId();
  return {
    id,
    codigo: crearCodigo(id),
    titulo: f.titulo.value.trim(),
    categoria: f.categoria.value,
    precio: leerNumero(f.precio.value),
    stock: leerNumero(f.stock.value),
    stockMinimo: leerNumero(f.stockMinimo.value),
    autor: f.autor.value.trim(),
    editorial: f.editorial.value.trim(),
    isbn: f.isbn.value.trim(),
    anioPublicacion: leerNumero(f.anioPublicacion.value),
    activo: f.activo.checked
  };
}

/** Reutiliza las reglas de validacion.js y agrega la unicidad del ISBN. */
function validarFormulario(libro) {
  const errores = validarCamposLibro(libro);
  const isbnRepetido = libros.some((otro) => otro.isbn === libro.isbn && otro.id !== libro.id);
  if (isbnRepetido) {
    errores.push({ campo: "isbn", descripcion: "Ya existe otro libro con este ISBN." });
  }
  return errores;
}

function mostrarErroresFormulario(errores) {
  errores.forEach(({ campo, descripcion }) => {
    const contenedor = elementos.formulario.querySelector(`[data-error="${campo}"]`);
    const entrada = elementos.formulario.elements[campo];
    if (contenedor && !contenedor.textContent) contenedor.textContent = descripcion;
    if (entrada) entrada.setAttribute("aria-invalid", "true");
  });
  const primerCampo = elementos.formulario.querySelector('[aria-invalid="true"]');
  if (primerCampo) primerCampo.focus();
}

/** Valida el formulario, agrega o actualiza el libro y persiste los cambios. */
function guardarLibro() {
  limpiarErroresFormulario();
  const libro = leerFormulario();
  const errores = validarFormulario(libro);

  if (errores.length > 0) {
    mostrarErroresFormulario(errores);
    mostrarAviso("Revisa los campos marcados en el formulario.", "error");
    return;
  }

  const editando = idEnEdicion !== null;
  if (editando) {
    libros = libros.map((item) => (item.id === libro.id ? libro : item));
  } else {
    libros.push(libro);
  }

  guardarLibros();
  cerrarModal();
  actualizarInterfaz();
  mostrarAviso(editando ? `Se actualizó “${libro.titulo}”.` : `Se agregó “${libro.titulo}” al catálogo.`);
}

function eliminarLibro(id) {
  const libro = libros.find((item) => item.id === id);
  if (!libro) return;

  const confirmado = window.confirm(`¿Eliminar “${libro.titulo}” (${libro.codigo})?\nEsta acción no se puede deshacer.`);
  if (!confirmado) return;

  libros = libros.filter((item) => item.id !== id);
  guardarLibros();
  actualizarInterfaz();
  mostrarAviso(`Se eliminó “${libro.titulo}”.`);
}

async function restablecerDatos() {
  const confirmado = window.confirm("¿Restablecer el catálogo? Se borrarán los cambios guardados y se cargará libros.json.");
  if (!confirmado) return;
  try {
    localStorage.removeItem(CLAVE_STORAGE);
    libros = await cargarLibros();
    actualizarInterfaz();
    mostrarAviso(`Catálogo restablecido con los ${libros.length} libros iniciales.`);
  } catch (error) {
    mostrarAviso(error.message, "error");
  }
}

/* ==========================================================================
   Eventos
   ========================================================================== */

function cambiarVista(vista) {
  const esTabla = vista === "tabla";
  elementos.lista.hidden = esTabla;
  elementos.vistaTabla.hidden = !esTabla;
  document.querySelectorAll("[data-vista]").forEach((boton) => {
    boton.setAttribute("aria-pressed", String(boton.dataset.vista === vista));
  });
}

function registrarEventos() {
  // Busqueda en tiempo real y filtros combinados.
  elementos.filtros.addEventListener("input", filtrarLibros);
  elementos.filtros.addEventListener("submit", (evento) => evento.preventDefault());
  elementos.filtros.addEventListener("reset", () => setTimeout(filtrarLibros));

  // Botones "Agregar libro".
  document.querySelectorAll('[data-accion="agregar"]').forEach((boton) => {
    boton.addEventListener("click", () => abrirModal());
  });

  // Editar y eliminar (delegacion de eventos en tarjetas y tabla).
  document.getElementById("catalogo").addEventListener("click", (evento) => {
    const botonEditar = evento.target.closest("[data-editar]");
    const botonEliminar = evento.target.closest("[data-eliminar]");
    if (botonEditar) abrirModal(Number(botonEditar.dataset.editar));
    if (botonEliminar) eliminarLibro(Number(botonEliminar.dataset.eliminar));
  });

  document.querySelectorAll("[data-vista]").forEach((boton) => {
    boton.addEventListener("click", () => cambiarVista(boton.dataset.vista));
  });

  document.getElementById("boton-ver-bajo").addEventListener("click", () => {
    elementos.filtros.reset();
    elementos.filtroEstado.value = "Stock bajo";
    filtrarLibros();
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("boton-restablecer").addEventListener("click", restablecerDatos);

  // Modal: guardar, cerrar con botones, con clic en el fondo o con Escape.
  elementos.formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    guardarLibro();
  });
  elementos.modal.addEventListener("click", (evento) => {
    if (evento.target === elementos.modal || evento.target.closest("[data-cerrar-modal]")) cerrarModal();
  });
  document.addEventListener("keydown", (evento) => {
    if (elementos.modal.hidden) return;
    if (evento.key === "Escape") cerrarModal();
    if (evento.key === "Tab") mantenerFocoEnModal(evento);
  });

  marcarSeccionVisible();
}

/** Resalta en el sidebar la seccion que se esta viendo al hacer scroll. */
function marcarSeccionVisible() {
  const enlaces = [...document.querySelectorAll(".sidebar__enlace[href^='#']")];
  const observador = new IntersectionObserver((entradas) => {
    entradas.filter((entrada) => entrada.isIntersecting).forEach((entrada) => {
      enlaces.forEach((enlace) => {
        if (enlace.getAttribute("href") === `#${entrada.target.id}`) {
          enlace.setAttribute("aria-current", "true");
        } else {
          enlace.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  enlaces.forEach((enlace) => observador.observe(document.querySelector(enlace.getAttribute("href"))));
}

/** Mientras el modal esta abierto, Tab y Shift+Tab no salen de el. */
function mantenerFocoEnModal(evento) {
  const enfocables = [...elementos.modal.querySelectorAll("button, input:not([readonly]), select")];
  const primero = enfocables[0];
  const ultimo = enfocables[enfocables.length - 1];
  if (evento.shiftKey && document.activeElement === primero) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primero.focus();
  }
}

/* ==========================================================================
   Inicio
   ========================================================================== */

async function iniciar() {
  crearMenuHamburguesa({ boton: document.querySelector(".boton-menu") });
  llenarOpciones(elementos.filtroCategoria, CATEGORIAS_VALIDAS, "Todas");
  llenarOpciones(elementos.campoCategoria, CATEGORIAS_VALIDAS, "Selecciona una categoría");
  registrarEventos();

  try {
    libros = await cargarLibros();
    actualizarInterfaz();
  } catch (error) {
    elementos.contador.textContent = "No se pudieron cargar los libros.";
    mostrarMensajeEstado(
      `${error.message} Abre el proyecto con un servidor local (por ejemplo, Live Server en VS Code); ` +
      "fetch() no funciona si el archivo se abre directamente con file://.",
      "error"
    );
  }
}

iniciar();
