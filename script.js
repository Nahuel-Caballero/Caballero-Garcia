/* ------------------------------------------------------------
 * CARRUSEL DE RECOMENDACIONES
 * - Muestra una tarjeta a la vez
 * - Avanza sola cada 5 segundos
 * - Flechas < y > para moverlo a mano
 * - Puntos que indican (y permiten saltar a) la tarjeta actual
 * ------------------------------------------------------------ */
(function () {
  const pista      = document.getElementById('recomendaciones');
  const btnPrev    = document.getElementById('btn-anterior');
  const btnNext    = document.getElementById('btn-siguiente');
  const cajaPuntos = document.getElementById('puntos');
  const carrusel   = document.querySelector('.carrusel');

  if (!pista || !btnPrev || !btnNext || !cajaPuntos) return;

  const slides = Array.from(pista.children); // las <article>
  const total = slides.length;
  if (total === 0) return;

  let indice = 0;
  let temporizador = null;
  const INTERVALO = 5000; // 5 segundos

  /* --- Crear los puntos (uno por tarjeta) --- */
  slides.forEach(function (_, i) {
    const punto = document.createElement('button');
    punto.type = 'button';
    punto.className = 'punto';
    punto.setAttribute('aria-label', 'Ir a la recomendación ' + (i + 1));
    punto.addEventListener('click', function () {
      irA(i);
      reiniciar();
    });
    cajaPuntos.appendChild(punto);
  });
  const puntos = Array.from(cajaPuntos.children);

  /* --- Ir a una tarjeta concreta --- */
  function irA(i) {
    indice = (i + total) % total; // vuelta circular
    pista.style.transform = 'translateX(-' + (indice * 100) + '%)';
    puntos.forEach(function (p, j) {
      p.classList.toggle('activo', j === indice);
    });
  }

  function siguiente() { irA(indice + 1); }
  function anterior() { irA(indice - 1); }

  /* --- Temporizador automático --- */
  function iniciar() {
    detener();
    temporizador = setInterval(siguiente, INTERVALO);
  }

  function detener() {
    if (temporizador) clearInterval(temporizador);
    temporizador = null;
  }

  // Al usar flechas o puntos, el contador se reinicia
  function reiniciar() { iniciar(); }

  /* --- Controles --- */
  btnNext.addEventListener('click', function () { siguiente(); reiniciar(); });
  btnPrev.addEventListener('click', function () { anterior(); reiniciar(); });

  /* --- Pausa al pasar el mouse o al enfocar el carrusel --- */
  if (carrusel) {
    carrusel.addEventListener('mouseenter', detener);
    carrusel.addEventListener('mouseleave', iniciar);
    carrusel.addEventListener('focusin', detener);
    carrusel.addEventListener('focusout', iniciar);
  }

  /* --- Arranque --- */
  irA(0);
  iniciar();
})();