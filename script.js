/**
 * ============================================================
 * Café & Letras - Comportamiento principal
 * ------------------------------------------------------------
 * Contenido:
 *   1. Cambio de tema (claro / oscuro)
 *   2. Frases inspiradoras (Nueva Frase)
 *   3. Carrusel de recomendaciones (auto + flechas + puntos)
 * ============================================================
 */

/* ------------------------------------------------------------
 * 1. CAMBIO DE TEMA
 * Alterna el atributo data-theme en <html> y actualiza el texto
 * del botón. Al no usar localStorage el tema se reinicia al
 * recargar; si quieres que se recuerde, descomenta el bloque
 * indicado más abajo.
 * ------------------------------------------------------------ */
(function () {
  const btn = document.getElementById('btn-cambiar-tema');
  if (!btn) return;

  const html = document.documentElement; // <html>

  // Sincroniza el texto del botón con el tema actual
  function actualizarTexto() {
    const oscuro = html.getAttribute('data-theme') === 'dark';
    btn.textContent = oscuro ? 'Modo Claro' : 'Modo Oscuro';
  }

  // Estado inicial: claro. Si quieres recordar la preferencia,
  // recupera aquí el valor guardado (ver comentario al final).
  actualizarTexto();

  btn.addEventListener('click', function () {
    const oscuro = html.getAttribute('data-theme') === 'dark';
    if (oscuro) {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', 'dark');
    }
    actualizarTexto();
    // localStorage.setItem('tema', oscuro ? 'light' : 'dark');
  });

  /*
   * Para recordar la preferencia entre visitas, coloca esto justo
   * después de `const html = ...`:
   *
   *   const guardado = localStorage.getItem('tema');
   *   if (guardado === 'dark') html.setAttribute('data-theme', 'dark');
   *
   * y deja activa la línea de localStorage.setItem del click.
   */
})();


/* ------------------------------------------------------------
 * 2. FRASES INSPIRADORAS
 * Array de pares [texto, autor]. Al pulsar "Nueva Frase
 * Inspiradora" se elige una distinta a la actual y se escribe
 * en #texto-frase y #autor-frase.
 * ------------------------------------------------------------ */
(function () {
  const btn = document.getElementById('btn-nueva-frase');
  const textoEl = document.getElementById('texto-frase');
  const autorEl = document.getElementById('autor-frase');
  if (!btn || !textoEl || !autorEl) return;

  const frases = [
    ['"El secreto de ir adelante es comenzar."', 'Mark Twain'],
    ['"No cuentes los días, haz que los días cuenten."', 'Muhammad Ali'],
    ['"La creatividad es la inteligencia divirtiéndose."', 'Albert Einstein'],
    ['"Haz de tu vida un sueño y de tu sueño una realidad."', 'Antoine de Saint-Exupéry'],
    ['"El único modo de hacer un gran trabajo es amar lo que haces."', 'Steve Jobs'],
    ['"Cada sorbo de café es una excusa para comenzar de nuevo."', 'Anónimo'],
    ['"Un libro, un café y buena compañía: la receta perfecta."', 'Anónimo'],
    ['"Las palabras son, en mi no tan humilde opinión, nuestra más inagotable fuente de magia."', 'J. K. Rowling'],
    ['"Vive el momento, porque cada instante es único."', 'Anónimo'],
    ['"La inspiración existe, pero tiene que encontrarte trabajando."', 'Pablo Picasso']
  ];

  let indice = 0; // empieza en la frase que ya está en el HTML

  btn.addEventListener('click', function () {
    // Elige una frase distinta a la actual (si hay más de una)
    let nuevo = indice;
    while (nuevo === indice && frases.length > 1) {
      nuevo = Math.floor(Math.random() * frases.length);
    }
    indice = nuevo;

    textoEl.textContent = frases[indice][0];
    autorEl.textContent = '— ' + frases[indice][1];
  });
})();


/* ------------------------------------------------------------
 * 3. CARRUSEL DE RECOMENDACIONES
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