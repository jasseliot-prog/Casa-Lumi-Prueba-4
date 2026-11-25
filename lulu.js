/* ===== INICIO PARTE 1 ===== */

(() => {
  "use strict";

  const archivoJS = document.currentScript.src;
  const ARCHIVO = new URL("lulu.svg", archivoJS).href;

  let criatura;
  let temporizador;

  const estilos = document.createElement("style");

  estilos.textContent = `
    #lulu-vectorial {
      position: relative;
      width: min(100%, 310px);
      margin: 15px auto;
      isolation: isolate;
    }

    #lulu-vectorial svg {
      display: block;
      width: 100%;
      height: auto;
      overflow: visible;
      filter: drop-shadow(0 0 16px #b96aff88);
    }

    #lulu-vectorial svg g {
      transform-box: fill-box;
      transform-origin: center;
    }

    #lulu-vectorial #cuerpo {
      animation: luluRespirar 4s ease-in-out infinite;
    }

    #lulu-vectorial #flor {
      transform-origin: center bottom;
      animation: luluFlor 3s ease-in-out infinite;
    }

    #lulu-vectorial #ojos {
      animation: luluParpadear 6s infinite;
    }

    @keyframes luluRespirar {
      0%,100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.015,1.025);
      }
    }

    @keyframes luluFlor {
      0%,100% {
        transform: rotate(-3deg);
      }
      50% {
        transform: rotate(3deg);
      }
    }

    @keyframes luluParpadear {
      0%,44%,48%,100% {
        transform: scaleY(1);
      }
      46% {
        transform: scaleY(.08);
      }
    }

    #lulu-vectorial[data-estado="dormida"] #ojos {
      animation: none;
      transform: scaleY(.08);
    }

    #lulu-vectorial[data-estado="sedienta"] #flor {
      animation: none;
      transform: rotate(15deg);
    }

    #lulu-vectorial[data-estado="triste"] svg {
      filter: brightness(.8);
    }

    #lulu-vectorial[data-estado="feliz"] svg,
    #lulu-vectorial[data-estado="regada"] svg,
    #lulu-vectorial[data-estado="traviesa"] svg {
      animation: luluSaltar .7s ease-in-out 3;
    }

    #lulu-vectorial[data-estado="iluminada"] svg,
    #lulu-vectorial[data-estado="floreciendo"] svg {
      filter: drop-shadow(0 0 28px #d78aff);
    }

    @keyframes luluSaltar {
      0%,100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-9px);
      }
    }

    .lulu-particula {
      position: absolute;
      pointer-events: none;
      z-index: 3;
      font-size: 20px;
      animation: luluMagia 2s ease-out forwards;
    }

    @keyframes luluMagia {
      from {
        opacity: 1;
        transform: translateY(0) scale(.7);
      }
      to {
        opacity: 0;
        transform: translateY(-65px) scale(1.3);
      }
    }

    #lulu-emocion {
      text-align: center;
      font-size: 14px;
      color: #efc9ff;
      font-style: italic;
      margin: 10px 0;
    }

    @media(prefers-reduced-motion:reduce) {
      #lulu-vectorial *,
      #lulu-vectorial svg {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(estilos);

/* ===== FIN PARTE 1 ===== */
 /* ===== INICIO PARTE 2 ===== */

  const mensajes = {
    normal: "Mi magia está despierta. ✨",
    dormida: "Zzz... soñando con estrellas. 🌙",
    sedienta: "Mis hojitas necesitan agüita. 💧",
    triste: "Necesito un poquito de cariño.",
    feliz: "¡Mis hojitas están felices! 💜",
    regada: "¡Agüita mágica!",
    iluminada: "¡Qué bonita luz!",
    traviesa: "¡Buuu! Jejeje...",
    floreciendo: "¡Mi magia está floreciendo! 🌸"
  };

  function obtenerNivel(tipo) {

    const elemento =
      document.getElementById(tipo + "-texto");

    if (!elemento) return 60;

    const valor = parseFloat(elemento.textContent);

    return Number.isFinite(valor) ? valor : 60;
  }

  function estadoAutomatico() {

    const hora = new Date().getHours();

    const agua = obtenerNivel("agua");
    const carino = obtenerNivel("carino");
    const luz = obtenerNivel("luz");

    if (agua < 30) {
      return "sedienta";
    }

    if (hora >= 22 || hora < 7) {
      return "dormida";
    }

    if (carino < 30) {
      return "triste";
    }

    if (
      agua >= 90 &&
      carino >= 90 &&
      luz >= 70
    ) {
      return "floreciendo";
    }

    return "normal";
  }

  function cambiarEstado(estado) {

    if (!criatura) return;

    criatura.dataset.estado = estado;

    const emocion =
      document.getElementById("lulu-emocion");

    if (emocion) {
      emocion.textContent =
        mensajes[estado] || mensajes.normal;
    }
  }

/* ===== FIN PARTE 2 ===== */
 /* ===== INICIO PARTE 3 ===== */

  function particulas(simbolo) {

    if (!criatura) return;

    for (let i = 0; i < 8; i++) {

      const estrella =
        document.createElement("span");

      estrella.className = "lulu-particula";
      estrella.textContent = simbolo;

      estrella.style.left =
        (15 + Math.random() * 70) + "%";

      estrella.style.top =
        (25 + Math.random() * 45) + "%";

      estrella.style.animationDelay =
        (Math.random() * .4) + "s";

      criatura.appendChild(estrella);

      setTimeout(() => {
        estrella.remove();
      }, 2500);
    }
  }

  function reaccionar(estado, simbolo) {

    clearTimeout(temporizador);

    cambiarEstado(estado);

    if (simbolo) {
      particulas(simbolo);
    }

    temporizador = setTimeout(() => {

      temporizador = null;

      cambiarEstado(estadoAutomatico());

    }, 12000);
  }

  window.LuluVisual = {

    regar() {
      reaccionar("regada", "💧");
    },

    iluminar() {
      reaccionar("iluminada", "✨");
    },

    acariciar() {
      reaccionar("feliz", "💜");
    },

    jugar() {
      reaccionar("traviesa", "✦");
    },

    actualizar() {

      if (!temporizador) {
        cambiarEstado(estadoAutomatico());
      }

    }
  };

/* ===== FIN PARTE 3 ===== *
  /* ===== INICIO PARTE 4 ===== */

  async function iniciar() {

    const espacio =
      document.getElementById("lulu");

    if (!espacio) return;

    if (document.getElementById("lulu-vectorial")) {
      return;
    }

    criatura = document.createElement("div");
    criatura.id = "lulu-vectorial";

    try {

      const respuesta = await fetch(ARCHIVO);

      if (!respuesta.ok) {
        throw new Error("No se encontró lulu.svg");
      }

      const contenido = await respuesta.text();

      const documento = new DOMParser()
        .parseFromString(
          contenido,
          "image/svg+xml"
        );

      const svg = documento.documentElement;

      if (
        svg.localName !== "svg" ||
        documento.querySelector("parsererror")
      ) {
        throw new Error("SVG inválido");
      }

      criatura.appendChild(
        document.importNode(svg, true)
      );

      espacio.classList.remove("lulu");
      espacio.replaceChildren(criatura);

      const maceta =
        document.querySelector(".zona-lulu .maceta");

      if (maceta) {
        maceta.style.display = "none";
      }

      const emocion =
        document.createElement("p");

      emocion.id = "lulu-emocion";

      espacio.appendChild(emocion);

    } catch (error) {

      console.error("Lulú:", error);

      criatura = null;

      return;
    }

    cambiarEstado(estadoAutomatico());

    setInterval(() => {

      window.LuluVisual.actualizar();

    }, 10000);

    setInterval(() => {

      if (
        !temporizador &&
        estadoAutomatico() === "normal" &&
        Math.random() < .25
      ) {

        window.LuluVisual.jugar();

      }

    }, 60000);
  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      iniciar
    );

  } else {

    iniciar();

  }

})();
/* ===== INICIO PARTE 4 ===== */

  async function iniciar() {

    const espacio =
      document.getElementById("lulu");

    if (!espacio) return;

    if (document.getElementById("lulu-vectorial")) {
      return;
    }

    criatura = document.createElement("div");
    criatura.id = "lulu-vectorial";

    try {

      const respuesta = await fetch(ARCHIVO);

      if (!respuesta.ok) {
        throw new Error("No se encontró lulu.svg");
      }

      const contenido = await respuesta.text();

      const documento = new DOMParser()
        .parseFromString(
          contenido,
          "image/svg+xml"
        );

      const svg = documento.documentElement;

      if (
        svg.localName !== "svg" ||
        documento.querySelector("parsererror")
      ) {
        throw new Error("SVG inválido");
      }

      criatura.appendChild(
        document.importNode(svg, true)
      );

      espacio.classList.remove("lulu");
      espacio.replaceChildren(criatura);

      const maceta =
        document.querySelector(".zona-lulu .maceta");

      if (maceta) {
        maceta.style.display = "none";
      }

      const emocion =
        document.createElement("p");

      emocion.id = "lulu-emocion";

      espacio.appendChild(emocion);

    } catch (error) {

      console.error("Lulú:", error);

      criatura = null;

      return;
    }

    cambiarEstado(estadoAutomatico());

    setInterval(() => {

      window.LuluVisual.actualizar();

    }, 10000);

    setInterval(() => {

      if (
        !temporizador &&
        estadoAutomatico() === "normal" &&
        Math.random() < .25
      ) {

        window.LuluVisual.jugar();

      }

    }, 60000);
  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      iniciar
    );

  } else {

    iniciar();

  }

})();

/* ===== FIN PARTE 4 ===== */
JavaScript
/* ===== INICIO PARTE 4 ===== */

  async function iniciar() {

    const espacio =
      document.getElementById("lulu");

    if (!espacio) return;

    if (document.getElementById("lulu-vectorial")) {
      return;
    }

    criatura = document.createElement("div");
    criatura.id = "lulu-vectorial";

    try {

      const respuesta = await fetch(ARCHIVO);

      if (!respuesta.ok) {
        throw new Error("No se encontró lulu.svg");
      }

      const contenido = await respuesta.text();

      const documento = new DOMParser()
        .parseFromString(
          contenido,
          "image/svg+xml"
        );

      const svg = documento.documentElement;

      if (
        svg.localName !== "svg" ||
        documento.querySelector("parsererror")
      ) {
        throw new Error("SVG inválido");
      }

      criatura.appendChild(
        document.importNode(svg, true)
      );

      espacio.classList.remove("lulu");
      espacio.replaceChildren(criatura);

      const maceta =
        document.querySelector(".zona-lulu .maceta");

      if (maceta) {
        maceta.style.display = "none";
      }

      const emocion =
        document.createElement("p");

      emocion.id = "lulu-emocion";

      espacio.appendChild(emocion);

    } catch (error) {

      console.error("Lulú:", error);

      criatura = null;

      return;
    }

    cambiarEstado(estadoAutomatico());

    setInterval(() => {

      window.LuluVisual.actualizar();

    }, 10000);

    setInterval(() => {

      if (
        !temporizador &&
        estadoAutomatico() === "normal" &&
        Math.random() < .25
      ) {

        window.LuluVisual.jugar();

      }

    }, 60000);
  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      iniciar
    );

  } else {

    iniciar();

  }

})();
/* ===== INICIO PARTE 4A ===== */

  async function iniciar() {

    const espacio =
      document.getElementById("lulu");

    if (!espacio) return;

    if (document.getElementById("lulu-vectorial")) {
      return;
    }

    criatura = document.createElement("div");
    criatura.id = "lulu-vectorial";

    try {

      const respuesta = await fetch(ARCHIVO);

      if (!respuesta.ok) {
        throw new Error("No se encontró lulu.svg");
      }

      const contenido = await respuesta.text();

      const documento = new DOMParser()
        .parseFromString(
          contenido,
          "image/svg+xml"
        );

      const svg = documento.documentElement;

      if (
        svg.localName !== "svg" ||
        documento.querySelector("parsererror")
      ) {
        throw new Error("SVG inválido");
      }

      criatura.appendChild(
        document.importNode(svg, true)
      );

      espacio.classList.remove("lulu");
      espacio.replaceChildren(criatura);

/* ===== FIN PARTE 4A ===== */
      /* ===== INICIO PARTE 4B ===== */

      const maceta =
        document.querySelector(".zona-lulu .maceta");

      if (maceta) {
        maceta.style.display = "none";
      }

      const emocion = document.createElement("p");
      emocion.id = "lulu-emocion";
      espacio.appendChild(emocion);

    } catch (error) {
      console.error("Lulú:", error);
      criatura = null;
      return;
    }

    cambiarEstado(estadoAutomatico());

    setInterval(() => {
      window.LuluVisual.actualizar();
    }, 10000);

    setInterval(() => {
      if (
        !temporizador &&
        estadoAutomatico() === "normal" &&
        Math.random() < .25
      ) {
        window.LuluVisual.jugar();
      }
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      iniciar
    );
  } else {
    iniciar();
  }

})();

/* ===== FIN PARTE 4B ===== */
      
