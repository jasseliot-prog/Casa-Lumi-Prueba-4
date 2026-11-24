/* ==========================================
   CASA-LUMI 4
   CONTROLADOR CENTRAL DE AUTONOMÍA
   ========================================== */

(() => {
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
      "Tomar once",
      "Ver película",
      "Escuchar música",
      "Tejer",
      "Escribir en escritorio",
      "Dibujar en escritorio",
      "Organizar sus cosas"
    ],

    cocina: [
      "Preparar desayuno",
      "Preparar almuerzo",
      "Preparar comida",
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

  function recuperarEstado() {
    try {
      return JSON.parse(
        localStorage.getItem(CLAVE)
      );
    } catch {
      return null;
    }
  }

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

  function elegir(lista) {
    return lista[
      Math.floor(Math.random() * lista.length)
    ];
  }

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

  function crearActividad() {
    const hora = new Date().getHours();

    let habitacion;
    let actividad;
    let emocion;

    if (hora >= 23 || hora < 7) {
      habitacion = "dormitorio";
      actividad = "Dormir";
      emocion = "Soñolienta";

    } else if (hora >= 7 && hora < 8) {
      habitacion = "bano";
      actividad = elegir(habitaciones.bano);
      emocion = "Tranquila";

    } else if (hora >= 8 && hora < 9) {
      habitacion = "cocina";
      actividad = "Preparar desayuno";
      emocion = "Feliz";

    } else if (hora >= 12 && hora < 14) {
      habitacion = "cocina";
      actividad = "Preparar almuerzo";
      emocion = "Feliz";

    } else if (hora >= 21) {
      habitacion = elegir([
        "dormitorio",
        "sala",
        "bano"
      ]);

      actividad = elegir(
        habitaciones[habitacion].filter(
          a => a !== "Dormir"
        )
      );

      emocion = "Relajada";

    } else {
      habitacion = elegir([
        "sala",
        "cocina",
        "lavanderia",
        "patio",
        "escritorio"
      ]);

      actividad = elegir(
        habitaciones[habitacion]
      );

      emocion = elegir([
        "Feliz",
        "Tranquila",
        "Pensativa",
        "Emocionada"
      ]);
    }

    const ropa =
      window.CasaLumiVestuario?.obtener();

    return {
      habitacion,
      actividad,
      emocion,
      ambiente: obtenerAmbiente(),
      vestuario: ropa?.traje || "primavera",
      nombreVestuario: ropa?.nombre || "Primavera",
      diario: `Ahora estoy disfrutando de mi actividad: ${actividad.toLowerCase()}. 💜`,
      actualizado: Date.now(),
      siguienteCambio:
        Date.now() + 15 * 60 * 1000
    };
  }

  function actualizar() {
    const guardado = recuperarEstado();
    const hora = new Date().getHours();
    const dormir = hora >= 23 || hora < 7;

    estado = guardado || estado;

    if (
      !estado ||
      !habitaciones[estado.habitacion] ||
      !Number.isFinite(estado.siguienteCambio) ||
      Date.now() >= estado.siguienteCambio ||
      (dormir && estado.actividad !== "Dormir") ||
      (!dormir && estado.actividad === "Dormir")
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

  function publicarEstado() {
    if (!estado) return;

    window.dispatchEvent(
      new CustomEvent("casaLumi:estado", {
        detail: { ...estado }
      })
    );
  }

  window.CasaLumi = {
    obtenerEstado() {
      return actualizar();
    },

    estaEn(habitacion) {
      return actualizar().habitacion === habitacion;
    },

    obtenerAmbiente,

    obtenerActividades(habitacion) {
      return [...(habitaciones[habitacion] || [])];
    }
  };

  actualizar();

  setInterval(actualizar, 30000);

  window.addEventListener(
    "casaLumi:vestuario",
    actualizar
  );

  window.addEventListener("storage", (evento) => {
    if (evento.key === CLAVE) {
      estado = recuperarEstado();
      publicarEstado();
    }
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) {
        actualizar();
      }
    }
  );

})();
