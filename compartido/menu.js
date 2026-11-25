/**
 * BookHub - Menu hamburguesa reutilizable (sin jQuery).
 *
 * Se usa en la landing (navegacion principal) y en el dashboard (sidebar).
 * El boton debe tener aria-controls con el id del menu que controla.
 *
 * Comportamiento:
 *  1. Clic en el boton: muestra u oculta el menu (la transicion de 0.3 s esta en el CSS).
 *  2. El icono alterna entre ☰ y ×.
 *  3. En pantallas pequenas, un clic fuera del menu lo cierra.
 *  4. Al elegir una opcion del menu, este se cierra.
 *  5. La tecla Escape tambien lo cierra y devuelve el foco al boton.
 *
 * @param {Object} opciones
 * @param {HTMLElement} opciones.boton       Boton que abre y cierra el menu.
 * @param {string} [opciones.claseAbierto]   Clase que se agrega al menu abierto.
 * @param {number} [opciones.anchoMaximo]    Ancho (px) hasta el que el menu se comporta como hamburguesa.
 */
function crearMenuHamburguesa({ boton, claseAbierto = "esta-abierto", anchoMaximo = 900 }) {
  const menu = document.getElementById(boton.getAttribute("aria-controls"));
  if (!menu) return;

  const icono = boton.querySelector("[data-icono]") || boton;
  const consultaMovil = window.matchMedia(`(max-width: ${anchoMaximo}px)`);

  function estaAbierto() {
    return boton.getAttribute("aria-expanded") === "true";
  }

  function cambiarEstado(abrir) {
    boton.setAttribute("aria-expanded", String(abrir));
    boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    icono.textContent = abrir ? "×" : "☰";
    menu.classList.toggle(claseAbierto, abrir);
    document.body.classList.toggle("menu-abierto", abrir);
  }

  boton.addEventListener("click", () => cambiarEstado(!estaAbierto()));

  // Cerrar al seleccionar una opcion del menu.
  menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a") && consultaMovil.matches) {
      cambiarEstado(false);
    }
  });

  // Cerrar al hacer clic fuera del menu (solo en pantallas pequenas).
  document.addEventListener("click", (evento) => {
    const clicDentro = menu.contains(evento.target) || boton.contains(evento.target);
    if (estaAbierto() && !clicDentro && consultaMovil.matches) {
      cambiarEstado(false);
    }
  });

  // Cerrar con Escape.
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && estaAbierto()) {
      cambiarEstado(false);
      boton.focus();
    }
  });

  // Si la pantalla crece, el menu deja de ser hamburguesa: se reinicia el estado.
  consultaMovil.addEventListener("change", () => cambiarEstado(false));
}
