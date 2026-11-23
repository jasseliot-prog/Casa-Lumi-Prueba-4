
"use strict";

/* ==========================================
   CASA-LUMI 4 💜
   INICIO + VESTUARIO AUTOMÁTICO
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

  const trajes = {
    "ano-nuevo": "✨ Año Nuevo",
    "cocinera": "👩‍🍳 Cocinera",
    "fiestas-patrias": "🇨🇱 Fiestas Patrias",
    "halloween": "🎃 Halloween",
    "invierno": "❄️ Invierno",
    "navidad": "🎄 Navidad",
    "otono": "🍂 Otoño",
    "pijama-invierno": "🌙 Pijama invierno",
    "pijama-verano": "🌙 Pijama verano",
    "primavera": "🌸 Primavera",
    "san-valentin": "💕 San Valentín",
    "verano": "☀️ Verano"
  };

  const CLAVE_ROPA = "casaLumi4.vestuario";
  const CLAVE_CLIMA = "casaLumi4.temperatura";

  let temperaturaActual = null;

  try {
    const guardada = JSON.parse(
      localStorage.getItem(CLAVE_CLIMA)
    );

    if (
      guardada &&
      Number.isFinite(guardada.grados) &&
      Date.now() - guardada.fecha < 3600000
    ) {
      temperaturaActual = guardada.grados;
    }
  } catch (error) {
    console.warn("Clima guardado no disponible");
  }

  function actualizarReloj() {
    const ahora = new Date();

    if (hora) {
      hora.textContent = ahora.toLocaleTimeString(
        "es-CL",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }
      );
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
      if (actividad) {
        actividad.textContent = "Comenzando mi día";
      }
      if (mensaje) {
        mensaje.textContent =
          "¡Buenos días! ☀️ Hoy quiero llenar mi hogar de magia.";
      }
    } else if (horas >= 12 && horas < 20) {
      if (emocion) emocion.textContent = "Tranquila";
      if (actividad) {
        actividad.textContent = "Disfrutando mi tarde";
      }
      if (mensaje) {
        mensaje.textContent =
          "¡Qué bonita tarde! 💜 Hay muchas cosas por descubrir.";
      }
    } else {
      if (emocion) emocion.textContent = "Relajada";
      if (actividad) {
        actividad.textContent = "Disfrutando la noche";
      }
      if (mensaje) {
        mensaje.textContent =
          "La noche llegó a Casa-Lumi. 🌙 ¡Mira cuántas estrellas!";
      }
    }
  }

  /* ==========================================
     SELECCIÓN AUTÓNOMA DE ROPA
     ========================================== */

  function elegirRopa(grados, ahora = new Date()) {
    const mes = ahora.getMonth() + 1;
    const dia = ahora.getDate();
    const horas = ahora.getHours();

    // Celebraciones especiales
    if (mes === 12 && (dia === 24 || dia === 25)) {
      return "navidad";
    }

    if (
      (mes === 12 && dia === 31) ||
      (mes === 1 && dia === 1)
    ) {
      return "ano-nuevo";
    }

    if (mes === 2 && dia === 14) {
      return "san-valentin";
    }

    if (mes === 9 && (dia === 18 || dia === 19)) {
      return "fiestas-patrias";
    }

    if (mes === 10 && dia === 31) {
      return "halloween";
    }

    // Pijamas nocturnos
    if (horas >= 21 || horas < 7) {
      return grados === null
        ? (mes >= 4 && mes <= 9
            ? "pijama-invierno"
            : "pijama-verano")
        : (grados < 18
            ? "pijama-invierno"
            : "pijama-verano");
    }

    // Temperatura real
    if (grados !== null) {
      if (grados <= 14) return "invierno";
      if (grados >= 27) return "verano";
    }

    // Estaciones de Chile
    if (mes >= 3 && mes <= 5) return "otono";
    if (mes >= 6 && mes <= 8) return "invierno";
    if (mes >= 9 && mes <= 11) return "primavera";

    return "verano";
  }

  function actualizarVestuario() {
    const ropa = elegirRopa(temperaturaActual);

    const estado = {
      traje: ropa,
      nombre: trajes[ropa],
      imagen: "assets/ropa/" + ropa + ".png",
      temperatura: temperaturaActual,
      actualizado: Date.now()
    };

    try {
      localStorage.setItem(
        CLAVE_ROPA,
        JSON.stringify(estado)
      );
    } catch (error) {
      console.warn("No se pudo guardar vestuario");
    }

    if (vestuario) {
      vestuario.textContent = estado.nombre;
    }

    // Permite que otras funciones reaccionen.
    window.dispatchEvent(
      new CustomEvent(
        "casaLumi:vestuario",
        { detail: estado }
      )
    );

    return estado;
  }

  /* ==========================================
     CONSULTAR CLIMA REAL
     ========================================== */

  async function consultarClima() {
    if (
      !navigator.geolocation ||
      !navigator.geolocation.getCurrentPosition
    ) {
      actualizarVestuario();
      return;
    }

    try {
      const posicion = await new Promise(
        (resolver, rechazar) => {
          navigator.geolocation.getCurrentPosition(
            resolver,
            rechazar,
            {
              timeout: 12000,
              enableHighAccuracy: false
            }
          );
        }
      );

      const lat = posicion.coords.latitude;
      const lon = posicion.coords.longitude;

      const url = new URL(
        "https://api.open-meteo.com/v1/forecast"
      );

      url.search = new URLSearchParams({
        latitude: lat.toFixed(2),
        longitude: lon.toFixed(2),
        current: "temperature_2m",
        temperature_unit: "celsius"
      });

      const controlador = new AbortController();
      const limite = setTimeout(
        () => controlador.abort(),
        10000
      );

      let respuesta;

      try {
        respuesta = await fetch(url, {
          signal: controlador.signal
        });
      } finally {
        clearTimeout(limite);
      }

      if (!respuesta.ok) {
        throw new Error("Clima no disponible");
      }

      const datos = await respuesta.json();
      const grados = datos.current?.temperature_2m;

      if (!Number.isFinite(grados)) {
        throw new Error("Temperatura inválida");
      }

      temperaturaActual = grados;

      try {
        localStorage.setItem(
          CLAVE_CLIMA,
          JSON.stringify({
            grados,
            fecha: Date.now()
          })
        );
      } catch (error) {
        console.warn("No se pudo guardar clima");
      }

      actualizarVestuario();

    } catch (error) {
      console.warn(
        "Usando estación o temperatura guardada:",
        error.message
      );
      actualizarVestuario();
    }
  }

  /* ==========================================
     INICIO Y ACTUALIZACIONES
     ========================================== */

  function actualizarTodo() {
    actualizarReloj();
    actualizarBienvenida();
    actualizarVestuario();
  }

  actualizarTodo();
  consultarClima();

  // Reloj y cambios de horario
  setInterval(actualizarTodo, 60000);

  // Actualización meteorológica cada 30 minutos
  // mientras la página permanezca abierta.
  setInterval(consultarClima, 1800000);

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "visible") {
        actualizarTodo();
      }
    }
  );

  // Acceso compartido para futuras habitaciones
  window.CasaLumiVestuario = {
    elegir: elegirRopa,
    actualizar: actualizarVestuario,
    obtener: () => {
      try {
        return JSON.parse(
          localStorage.getItem(CLAVE_ROPA)
        );
      } catch {
        return null;
      }
    }
  };
})();
