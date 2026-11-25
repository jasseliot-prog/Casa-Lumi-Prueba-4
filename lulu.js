/* ===== INICIO PARTE 1 ===== */

(() => {
  "use strict";

  const CLAVE = "casaLumi.lulu.v2";
  const ARCHIVO = "lulu.svg";

  const limitar = n => Math.max(0, Math.min(100, n));

  let datos = {
    agua: 85,
    luz: 90,
    carino: 85,
    ultima: Date.now()
  };

  try {
    const anterior = JSON.parse(localStorage.getItem(CLAVE));
    if (anterior) datos = { ...datos, ...anterior };
  } catch {}

  let reaccion = "";
  let finReaccion = 0;
  let panel;

  function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  }

  function actualizar() {
    const ahora = Date.now();
    const horas = Math.max(0, ahora - datos.ultima) / 3600000;
    const hora = new Date().getHours();

    datos.agua = limitar(datos.agua - horas * 2);
    datos.carino = limitar(datos.carino - horas);
    datos.luz = hora >= 7 && hora < 20 ? 90 : 25;
    datos.ultima = ahora;

    guardar();
  }

/* ===== FIN PARTE 1 ===== */
/* ===== INICIO PARTE 2 ===== */

  const mensajes = {
    normal: "¡Hoy mi magia está despierta!",
    sedienta: "Mis hojitas necesitan agüita...",
    dormida: "Soñando con lunas y estrellas...",
    triste: "Hoy necesito un poquito de cariño.",
    feliz: "¡Mis hojitas están felices!",
    regada: "¡Agüita mágica!",
    traviesa: "¡Buuu! Jejeje...",
    floreciendo: "¡Estoy floreciendo!"
  };

  function estado() {
    const hora = new Date().getHours();

    if (Date.now() < finReaccion) return reaccion;
    if (datos.agua < 30) return "sedienta";
    if (hora >= 22 || hora < 7) return "dormida";
    if (datos.carino < 30) return "triste";

    if (datos.agua > 90 && datos.carino > 90) {
      return "floreciendo";
    }

    return "normal";
  }

  function mostrar() {
    actualizar();

    if (!panel) return;

    const e = estado();

    panel.dataset.estado = e;
    panel.querySelector(".lulu-mensaje").textContent =
      mensajes[e];

    panel.querySelector(".lulu-agua").textContent =
      Math.round(datos.agua) + "%";

    panel.querySelector(".lulu-luz").textContent =
      Math.round(datos.luz) + "%";

    panel.querySelector(".lulu-carino").textContent =
      Math.round(datos.carino) + "%";
  }

  function reaccionar(tipo) {
    reaccion = tipo;
    finReaccion = Date.now() + 15000;
    mostrar();
  }

  window.Lulu = {
    regar() {
      actualizar();
      datos.agua = limitar(datos.agua + 25);
      reaccionar("regada");
    },

    acariciar() {
      actualizar();
      datos.carino = limitar(datos.carino + 15);
      reaccionar("feliz");
    },

    jugar() {
      actualizar();
      datos.carino = limitar(datos.carino + 10);
      reaccionar("traviesa");
    }
  };

/* ===== FIN PARTE 2 ===== */ 
 /* ===== INICIO PARTE 3 ===== */

  const estilos = document.createElement("style");

  estilos.textContent = `
    #lulu-magica {
      position: relative;
      text-align: center;
      color: #f5ddff;
      background: radial-gradient(
        ellipse at center,
        #39134f,
        #160b25 75%
      );
      border: 1px solid #a85de8;
      border-radius: 25px;
      padding: 18px;
      overflow: hidden;
    }

    .lulu-dibujo {
      position: relative;
      width: min(100%, 320px);
      margin: auto;
    }

    .lulu-dibujo svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
      filter: drop-shadow(0 0 12px #a343ed);
    }

    .lulu-dibujo svg g {
      transform-box: fill-box;
      transform-origin: center;
    }

    .lulu-dibujo #cuerpo {
      animation: luluRespirar 4s ease-in-out infinite;
    }

    .lulu-dibujo #flor {
      transform-origin: center bottom;
      animation: luluFlor 3s ease-in-out infinite;
    }

    .lulu-dibujo #ojos {
      animation: luluParpadeo 6s infinite;
    }

    @keyframes luluRespirar {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.015, 1.025); }
    }

    @keyframes luluFlor {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }

    @keyframes luluParpadeo {
      0%, 44%, 48%, 100% {
        transform: scaleY(1);
      }
      46% {
        transform: scaleY(.08);
      }
    }

    #lulu-magica[data-estado="dormida"] #ojos {
      animation: none;
      transform: scaleY(.08);
    }

    #lulu-magica[data-estado="sedienta"] #flor {
      animation: none;
      transform: rotate(15deg);
    }

    #lulu-magica[data-estado="triste"] svg {
      filter: brightness(.75);
    }

    #lulu-magica[data-estado="feliz"] svg,
    #lulu-magica[data-estado="traviesa"] svg {
      animation: luluSaltar .7s ease-in-out 3;
    }

    #lulu-magica[data-estado="floreciendo"] svg {
      filter: drop-shadow(0 0 25px #e087ff);
    }

    @keyframes luluSaltar {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .lulu-mensaje {
      color: #edbaff;
      font-style: italic;
      margin: 12px 0;
    }

    .lulu-niveles {
      display: flex;
      justify-content: space-around;
      gap: 8px;
      font-size: 13px;
      margin: 15px 0;
    }

    .lulu-botones {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }

    .lulu-botones button {
      background: #35134e;
      color: #f5ddff;
      border: 1px solid #b96aff;
      border-radius: 15px;
      padding: 10px 14px;
      cursor: pointer;
    }

    .lulu-botones button:active {
      transform: scale(.95);
    }

    @media (prefers-reduced-motion: reduce) {
      #lulu-magica * {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(estilos);

/* ===== FIN PARTE 3 ===== */
 /* ===== INICIO PARTE 4 ===== */

  async function iniciar() {
    const espacio = document.getElementById("lulu");

    if (!espacio) return;
    if (document.getElementById("lulu-magica")) return;

    panel = document.createElement("section");
    panel.id = "lulu-magica";

    panel.innerHTML = `
      <h2>✦ Lulú ✦</h2>
      <small>Mi pequeña mandrágora encantada</small>

      <div class="lulu-dibujo"></div>

      <p class="lulu-mensaje">
        Despertando mi magia...
      </p>

      <div class="lulu-niveles">
        <div>💧 Agua<br>
          <strong class="lulu-agua">--</strong>
        </div>

        <div>☀️ Luz<br>
          <strong class="lulu-luz">--</strong>
        </div>

        <div>💜 Cariño<br>
          <strong class="lulu-carino">--</strong>
        </div>
      </div>

      <div class="lulu-botones">
        <button data-accion="regar">💧 Regar</button>
        <button data-accion="acariciar">💜 Acariciar</button>
        <button data-accion="jugar">✨ Jugar</button>
      </div>
    `;

    espacio.appendChild(panel);

    panel.querySelectorAll("[data-accion]").forEach(boton => {
      boton.addEventListener("click", () => {
        window.Lulu[boton.dataset.accion]();
      });
    });

    try {
      const respuesta = await fetch(ARCHIVO);

      if (!respuesta.ok) {
        throw new Error("No se encontró lulu.svg");
      }

      const dibujo = await respuesta.text();

      const documento = new DOMParser().parseFromString(
        dibujo,
        "image/svg+xml"
      );

      const svg = documento.documentElement;

      if (svg.localName !== "svg") {
        throw new Error("SVG inválido");
      }

      panel.querySelector(".lulu-dibujo").appendChild(
        document.importNode(svg, true)
      );

    } catch (error) {
      panel.querySelector(".lulu-dibujo").textContent =
        "🌱 Lulú aún no encuentra su forma mágica.";

      console.error(error);
    }

    mostrar();

    setInterval(mostrar, 10000);

    setInterval(() => {
      if (estado() === "normal" && Math.random() < .3) {
        reaccionar("traviesa");
      }
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

})();

/* ===== FIN PARTE 4 ===== */
