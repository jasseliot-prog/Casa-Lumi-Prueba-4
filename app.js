
/* ==========================================
   CASA-LUMI 4
   CONTROLADOR CENTRAL DE AUTONOMÍA
   Rutina diaria y nocturna
   ========================================== */

(() => {
  "use strict";

  const CLAVE = "casaLumi4.autonomia";

  const habitaciones = {
    dormitorio: [
      "Dormir",
      "Descansar",
      "Cambiarse de ropa"
    ],

    sala: [
      "Leer un libro",
      "Usar notebook",
      "Descansar en sillón",
      "Ver película",
      "Escuchar música",
      "Tejer",
      "Organizar sus cosas"
    ],

    cocina: [
      "Preparar desayuno",
      "Preparar almuerzo",
      "Preparar comida",
      "Preparar once",
      "Tomar once",
      "Ordenar la cocina"
    ],

    bano: [
      "Lavarse la cara",
      "Cepillarse los dientes",
      "Peinarse"
    ],

    lavanderia: [
      "Lavar ropa",
      "Doblar ropa",
      "Ordenar ropa"
    ],

    patio: [
      "Regar las plantas",
      "Cuidar a Lulú",
      "Disfrutar del jardín"
    ],

    escritorio: [
      "Escribir",
      "Dibujar",
      "Organizar tareas",
      "Usar notebook"
    ]
  };

  let estado = null;

  /* RECUPERAR ESTADO */

  function recuperarEstado() {
    try {
      return JSON.parse(
        localStorage.getItem(CLAVE)
      );
    } catch {
      return null;
    }
  }

  /* GUARDAR ESTADO */

  function guardarEstado() {
    try {
      localStorage.setItem(
        CLAVE,
        JSON.stringify(estado)
      );
    } catch {
      console.warn("No se pudo guardar el estado");
    }
  }

  /* ELECCIÓN AUTÓNOMA */

  function elegir(lista) {
    return lista[
      Math.floor(Math.random() * lista.length)
    ];
  }

  /* AMBIENTE DE LA CASA */

  function obtenerAmbiente() {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 12) {
      return "dia";
    }

    if (hora >= 12 && hora < 20) {
      return "tarde";
    }

    return "noche";
  }

  /* HORARIOS DE LA RUTINA */

  function obtenerRutina(ahora = new Date()) {
    const minutos =
      ahora.getHours() * 60 + ahora.getMinutes();

    if (minutos >= 1380 || minutos < 420) {
      return "dormir";
    }

    if (minutos < 480) {
      return "aseo";
    }

    if (minutos < 540) {
      return "desayuno";
    }

    if (minutos >= 720 && minutos < 840) {
      return "almuerzo";
    }

    if (minutos >= 1140 && minutos < 1170) {
      return "preparar-once";
    }

    if (minutos >= 1170 && minutos < 1200) {
      return "tomar-once";
    }

    if (minutos >= 1200 && minutos < 1215) {
      return "ordenar-cocina";
    }

    if (minutos >= 1350 && minutos < 1365) {
      return "aseo-nocturno";
    }

    if (minutos >= 1365 && minutos < 1380) {
      return "descanso-nocturno";
    }

    if (minutos >= 1215) {
      return "noche-libre";
    }

    return "dia-libre";
  }

  /* CREAR ACTIVIDAD AUTÓNOMA */

  function crearActividad() {
    const ahora = new Date();
    const rutina = obtenerRutina(ahora);

    let habitacion;
    let actividad;
    let emocion;

    switch (rutina) {

      case "dormir":
        habitacion = "dormitorio";
        actividad = "Dormir";
        emocion = "Soñolienta";
        break;

      case "aseo":
        habitacion = "bano";
        actividad = elegir(habitaciones.bano);
        emocion = "Tranquila";
        break;

      case "desayuno":
        habitacion = "cocina";
        actividad = "Preparar desayuno";
        emocion = "Feliz";
        break;

      case "almuerzo":
        habitacion = "cocina";
        actividad = "Preparar almuerzo";
        emocion = "Feliz";
        break;

      case "preparar-once":
        habitacion = "cocina";
        actividad = "Preparar once";
        emocion = "Feliz";
        break;

      case "tomar-once":
        habitacion = "cocina";
        actividad = "Tomar once";
        emocion = "Tranquila";
        break;

      case "ordenar-cocina":
        habitacion = "cocina";
        actividad = "Ordenar la cocina";
        emocion = "Tranquila";
        break;

      case "aseo-nocturno":
        habitacion = "bano";
        actividad = "Cepillarse los dientes";
        emocion = "Relajada";
        break;

      case "descanso-nocturno":
        habitacion = "dormitorio";
        actividad = "Descansar";
        emocion = "Soñolienta";
        break;

      case "noche-libre": {

        const actividadesNoche = {
          dormitorio: [
            "Descansar",
            "Cambiarse de ropa"
          ],

          sala: habitaciones.sala,

          cocina: [
            "Ordenar la cocina"
          ],

          bano: habitaciones.bano,

          escritorio: habitaciones.escritorio,

          patio: [
            "Disfrutar del jardín",
            "Cuidar a Lulú"
          ],

          lavanderia: [
            "Doblar ropa",
            "Ordenar ropa"
          ]
        };

        habitacion = elegir(
          Object.keys(actividadesNoche)
        );

        actividad = elegir(
          actividadesNoche[habitacion]
        );

        emocion = elegir([
          "Relajada",
          "Tranquila",
          "Pensativa"
        ]);

        break;
      }

      default: {

        const actividadesDia = {
          dormitorio: [
            "Descansar",
            "Cambiarse de ropa"
          ],

          sala: habitaciones.sala,

          cocina: [
            "Preparar comida",
            "Ordenar la cocina"
          ],

          lavanderia: habitaciones.lavanderia,

          patio: habitaciones.patio,

          escritorio: habitaciones.escritorio
        };

        habitacion = elegir(
          Object.keys(actividadesDia)
        );

        actividad = elegir(
          actividadesDia[habitacion]
        );

        emocion = elegir([
          "Feliz",
          "Tranquila",
          "Pensativa",
          "Emocionada"
        ]);

        break;
      }
    }

    /* VESTUARIO AUTOMÁTICO */

    const ropa =
      window.CasaLumiVestuario?.obtener();

    /* CAMBIO CADA 15 MINUTOS */

    const siguiente = new Date(ahora);

    siguiente.setMinutes(
      Math.floor(ahora.getMinutes() / 15) * 15 + 15,
      0,
      0
    );

    return {
      habitacion,
      actividad,
      emocion,
      rutina,

      ambiente: obtenerAmbiente(),

      vestuario:
        ropa?.traje || "primavera",

      nombreVestuario:
        ropa?.nombre || "Primavera",

      diario:
        `Ahora estoy disfrutando de mi actividad: ${actividad.toLowerCase()}. 💜`,

      actualizado: Date.now(),

      siguienteCambio:
        siguiente.getTime()
    };
  }

  /* ACTUALIZAR ESTADO GLOBAL */

  function actualizar() {
    const guardado = recuperarEstado();
    const rutina = obtenerRutina();

    estado = guardado || estado;

    if (
      !estado ||
      !habitaciones[estado.habitacion] ||
      !habitaciones[estado.habitacion]?.includes(
        estado.actividad
      ) ||
      estado.rutina !== rutina ||
      !Number.isFinite(estado.siguienteCambio) ||
      Date.now() >= estado.siguienteCambio
    ) {
      estado = crearActividad();
    }

    estado.ambiente = obtenerAmbiente();

    const ropa =
      window.CasaLumiVestuario?.obtener();

    if (ropa) {
      estado.vestuario = ropa.traje;
      estado.nombreVestuario = ropa.nombre;
    }

    guardarEstado();
    publicarEstado();

    return { ...estado };
  }

  /* ACTUALIZAR PANTALLA PRINCIPAL */

  function actualizarInicio() {
    if (!estado) return;

    const emocion =
      document.getElementById("emocion");

    const vestuario =
      document.getElementById("vestuario");

    const actividad =
      document.getElementById("actividad");

    const diario =
      document.getElementById("mensaje-lumi");

    if (emocion) {
      emocion.textContent = estado.emocion;
    }

    if (vestuario) {
      vestuario.textContent =
        estado.nombreVestuario;
    }

    if (actividad) {
      actividad.textContent =
        estado.actividad;
    }

    if (diario) {
      diario.textContent =
        estado.diario;
    }
  }

  /* RELOJ PRINCIPAL */

  function actualizarReloj() {
    const ahora = new Date();

    const hora =
      document.getElementById("hora");

    const fecha =
      document.getElementById("fecha");

    if (hora) {
      hora.textContent =
        ahora.toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
    }

    if (fecha) {
      fecha.textContent =
        ahora.toLocaleDateString("es-CL", {
          weekday: "long",
          day: "numeric",
          month: "long"
        });
    }
  }

  /* PUBLICAR ESTADO EN TODA LA CASA */

  function publicarEstado() {
    if (!estado) return;

    actualizarInicio();

    window.dispatchEvent(
      new CustomEvent("casaLumi:estado", {
        detail: { ...estado }
      })
    );
  }

  /* CONEXIÓN CON LAS HABITACIONES */

  window.CasaLumi = {

    obtenerEstado() {
      return actualizar();
    },

    estaEn(habitacion) {
      return actualizar().habitacion === habitacion;
    },

    obtenerAmbiente,

    obtenerActividades(habitacion) {
      return [
        ...(habitaciones[habitacion] || [])
      ];
    }
  };

  /* INICIAR CASA-LUMI */

  actualizar();
  actualizarReloj();

  setInterval(actualizar, 30000);
  setInterval(actualizarReloj, 1000);

  /* CONEXIÓN CON EL CLÓSET */

  window.addEventListener(
    "casaLumi:vestuario",
    actualizar
  );

  /* SINCRONIZACIÓN ENTRE PESTAÑAS */

  window.addEventListener(
    "storage",
    (evento) => {
      if (evento.key === CLAVE) {
        estado = recuperarEstado();
        publicarEstado();
      }
    }
  );

  /* ACTUALIZAR AL VOLVER A LA CASA */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) {
        actualizar();
        actualizarReloj();
      }
    }
  );

})();
