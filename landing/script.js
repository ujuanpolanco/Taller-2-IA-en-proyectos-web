/**
 * BookHub - Landing page: menu movil y validacion del formulario de suscripcion.
 * El formulario no envia datos a ningun servidor; solo valida y muestra un mensaje.
 */

crearMenuHamburguesa({ boton: document.querySelector(".boton-menu") });

const formulario = document.getElementById("formulario-suscripcion");
const mensajeFormulario = document.getElementById("mensaje-suscripcion");
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const reglas = {
  nombre(valor) {
    if (valor === "") return "Escribe tu nombre.";
    if (valor.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    return "";
  },
  correo(valor) {
    if (valor === "") return "Escribe tu correo electrónico.";
    if (!PATRON_CORREO.test(valor)) return "Revisa el correo: debe tener el formato nombre@dominio.com.";
    return "";
  }
};

function validarCampo(campo) {
  const mensaje = reglas[campo.name](campo.value.trim());
  const contenedorError = document.getElementById(campo.getAttribute("aria-describedby"));
  contenedorError.textContent = mensaje;
  campo.setAttribute("aria-invalid", String(mensaje !== ""));
  return mensaje === "";
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const campos = [...formulario.querySelectorAll("input")];
  const camposValidos = campos.map(validarCampo);

  if (camposValidos.includes(false)) {
    mensajeFormulario.textContent = "";
    campos[camposValidos.indexOf(false)].focus();
    return;
  }

  const nombre = formulario.nombre.value.trim().split(" ")[0];
  mensajeFormulario.textContent = `¡Gracias, ${nombre}! Te enviaremos las novedades de BookHub a tu correo.`;
  formulario.reset();
  campos.forEach((campo) => campo.removeAttribute("aria-invalid"));
});

// Al corregir un campo con error, se vuelve a validar mientras se escribe.
formulario.addEventListener("input", (evento) => {
  if (evento.target.getAttribute("aria-invalid") === "true") {
    validarCampo(evento.target);
  }
});
