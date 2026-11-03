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
document.addEventListener('DOMContentLoaded', () => {

    // 1. Array de Objetos con 5 frases literarias y sus respectivos autores
    const frases = [
        {
            texto: '"El secreto de ir adelante es comenzar."',
            autor: '— Mark Twain'
        },
        {
            texto: '"No hay medicina que cure lo que no cura la felicidad."',
            autor: '— Gabriel García Márquez'
        },
        {
            texto: '"Caminante, no hay camino, se hace camino al andar."',
            autor: '— Antonio Machado'
        },
        {
            texto: '"No todo lo que es de oro reluce, ni toda la gente errante está perdida."',
            autor: '— J.R.R. Tolkien'
        },
        {
            texto: '"Estar solo no tiene nada de malo, pero estar con alguien que te haga sentir solo es lo peor."',
            autor: '— Robin Williams'
        }
    ];

    // 2. Capturar los elementos del DOM utilizando document.getElementById()
    const textoFrase = document.getElementById('texto-frase');
    const autorFrase = document.getElementById('autor-frase');
    const btnNuevaFrase = document.getElementById('btn-nueva-frase');
    const btnModoOscuro = document.getElementById('btn-cambiar-tema');

    // 3. Evento click del botón "Nueva Frase" con selección aleatoria usando Math.random()
    if (btnNuevaFrase && textoFrase && autorFrase) {
        btnNuevaFrase.addEventListener('click', () => {
            const indiceAleatorio = Math.floor(Math.random() * frases.length);
            const fraseSeleccionada = frases[indiceAleatorio];

            textoFrase.textContent = fraseSeleccionada.texto;
            autorFrase.textContent = fraseSeleccionada.autor;
        });
    }

    // 4. Evento click del botón "Modo Oscuro" alternando la clase .modooscuro en el body
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener('click', () => {
            document.body.classList.toggle('modooscuro');
        });
    }

});
