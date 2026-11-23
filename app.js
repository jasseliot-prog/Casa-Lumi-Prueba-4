
"use strict";

/* ==========================================
   CASA-LUMI · INICIO
   Reloj y estado de bienvenida
   ========================================== */

(() => {
  const $ = (id) => document.getElementById(id);

  const hora = $("hora");
  const fecha = $("fecha");
  const emocion = $("emocion");
  const vestuario = $("vestuario");
  const actividad = $("actividad");
  const mensaje = $("mensaje-lumi");

  const dias = [
    "domingo", "lunes", "martes", "miércoles",
    "jueves", "viernes", "sábado"
  ];

  const meses = [
    "enero", "febrero", "marzo", "abril",
    "mayo", "junio", "julio", "agosto",
    "septiembre", "octubre", "noviembre",
    "diciembre"
  ];

  function actualizarReloj() {
    const ahora = new Date();

    if (hora) {
      hora.textContent = ahora.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }

    if (fecha) {
      fecha.textContent =
        `${dias[ahora.getDay()]} ${ahora.getDate()} ` +
        `de ${meses[ahora.getMonth()]}`;
    }
  }

  function actualizarBienvenida() {
    const horas = new Date().getHours();

    if (horas >= 6 && horas < 12) {
      if (emocion) emocion.textContent = "Feliz";
      if (actividad) actividad.textContent = "Comenzando mi día";
      if (mensaje) {
        mensaje.textContent =
          "¡Buenos días! ☀️ Hoy quiero llenar mi hogar de magia.";
      }
    } else if (horas >= 12 && horas < 20) {
      if (emocion) emocion.textContent = "Tranquila";
      if (actividad) actividad.textContent = "Disfrutando mi tarde";
      if (mensaje) {
        mensaje.textContent =
          "¡Qué bonita tarde! 💜 Hay muchas cosas por descubrir.";
      }
    } else {
      if (emocion) emocion.textContent = "Relajada";
      if (actividad) actividad.textContent = "Disfrutando la noche";
      if (mensaje) {
        mensaje.textContent =
          "La noche llegó a Casa-Lumi. 🌙 ¡Mira cuántas estrellas!";
      }
    }

    if (vestuario) {
      vestuario.textContent = "Pendiente de conectar al clóset";
    }
  }

  function actualizarTodo() {
    actualizarReloj();
    actualizarBienvenida();
  }

  actualizarTodo();
  setInterval(actualizarTodo, 60000);
})();
