document.addEventListener('DOMContentLoaded', function () {
  const steps = document.querySelectorAll('.training-step');
  if (!steps.length) return;

  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SCROLL_FACTOR =3.0; 

  // --- Initialisierung der Pfade ---
  const dauerStep = document.getElementById('dauerlauf');
  const dauerPath = dauerStep ? dauerStep.querySelector('.dauerlauf-path path') : null;
  let dauerLength = 0;
  if (dauerPath) {
    dauerLength = dauerPath.getTotalLength();
    dauerPath.style.strokeDasharray = dauerLength;
    dauerPath.style.strokeDashoffset = dauerLength;
  }

  const ekgStep = document.getElementById('intervall');
  const ekgPath = ekgStep ? ekgStep.querySelector('.ekg-line path') : null;
  let ekgLength = 0;
  if (ekgPath) {
    ekgLength = ekgPath.getTotalLength();
    ekgPath.style.strokeDasharray = ekgLength;
    ekgPath.style.strokeDashoffset = ekgLength;
  }
  const intervalHeart = document.querySelector('.interval-heart');

  const regenStep = document.getElementById('regeneration');
  const regenPath = regenStep ? regenStep.querySelector('.reg-spiral path') : null;
  let regenLength = 0;
  if (regenPath) {
    regenLength = regenPath.getTotalLength();
    regenPath.style.strokeDasharray = regenLength;
    regenPath.style.strokeDashoffset = regenLength;
  }

  const eggStep = document.getElementById('ernaehrung');
  const eggOutline = eggStep ? eggStep.querySelector('.egg-outline') : null;
  const eggYolk = eggStep ? eggStep.querySelector('.egg-yolk') : null;
  let eggOutlineLength = 0;
  if (eggOutline) {
    eggOutlineLength = eggOutline.getTotalLength();
    eggOutline.style.strokeDasharray = eggOutlineLength;
    eggOutline.style.strokeDashoffset = eggOutlineLength;
  }

  // Reduced Motion Fallback
  if (prefersReduced) {
    if (dauerPath) dauerPath.style.strokeDashoffset = 0;
    if (ekgPath) ekgPath.style.strokeDashoffset = 0;
    if (regenPath) regenPath.style.strokeDashoffset = 0;
    if (eggOutline) eggOutline.style.strokeDashoffset = 0;
    if (eggYolk) eggYolk.style.opacity = 1;
    if (intervalHeart) {
      intervalHeart.style.opacity = 1;
      intervalHeart.style.transform = 'translateX(0) translateY(-50%)';
    }
    return;
  }

  // ============================================================
  // HIER HATTE DIE FUNKTION GEFEHLT
  // ============================================================
  function updateSteps() {
    const viewportHeight = window.innerHeight;
    const viewportCenterAbs = window.scrollY + (viewportHeight / 2);

    steps.forEach(step => {
      const rect = step.getBoundingClientRect();
      
      // Berechnungen für die SVG-Logik später
      const stepTopAbs = rect.top + window.scrollY;
      const stepCenterAbs = stepTopAbs + (step.offsetHeight / 2);

      /* ================================
         1) NEU: Plateau-Fade / Translate
         ================================ */
      
      // 1.0 = ganz unten am Rand, 0.0 = ganz oben am Rand
      const centerPercent = (rect.top + rect.height / 2) / viewportHeight;

      // Plateau-Definition:
      const startFadeIn = 2.95; // Erscheint unten
      const endFadeIn = 2.0;   // Voll sichtbar
      const startFadeOut = 0.20; // Beginnt oben zu verschwinden
      const endFadeOut = -0.10;  // Ganz weg (über dem Screen)

      let opacity = 0;

      if (centerPercent > startFadeIn) {
        opacity = 0; // Noch unterhalb
      } else if (centerPercent > endFadeIn) {
        // Einfaden unten
        opacity = 1 - (centerPercent - endFadeIn) / (startFadeIn - endFadeIn);
      } else if (centerPercent > startFadeOut) {
        // PLATEAU: Mitte voll sichtbar
        opacity = 1;
      } else if (centerPercent > endFadeOut) {
        // Ausfaden oben
        opacity = (centerPercent - endFadeOut) / (startFadeOut - endFadeOut);
      } else {
        opacity = 0; // Ganz oben weg
      }

      // Sanfte Bewegung von unten
      let translateY = 0;
      if (centerPercent > endFadeIn) {
          translateY = (centerPercent - endFadeIn) * 200; 
      }

      step.style.opacity = opacity.toFixed(2);
      step.style.transform = 'translateY(' + translateY.toFixed(1) + 'px)';

      /* ==========================================
         2) SVG Zeichnen-Logik
         ========================================== */
      
      const delta = viewportCenterAbs - stepCenterAbs;
      const halfRange = (viewportHeight * SCROLL_FACTOR) / 2;

      let sectionProgress = (delta + halfRange) / (2 * halfRange);
      if (sectionProgress < 0) sectionProgress = 0;
      if (sectionProgress > 1) sectionProgress = 1;

      const easedSection = sectionProgress;

      // --- Spezielle Animationen ---

      // 🔵 Dauerlauf
      if (step.id === 'dauerlauf' && dauerPath) {
        const drawOffset = dauerLength * (1 - easedSection);
        dauerPath.style.strokeDashoffset = drawOffset;
      }

      // 🔴 Intervall
      if (step.id === 'intervall' && ekgPath) {
        const drawOffset = ekgLength * (1 - easedSection);
        ekgPath.style.strokeDashoffset = drawOffset;

        if (intervalHeart) {
          intervalHeart.style.opacity = easedSection;
          intervalHeart.style.transform = `translateX(${easedSection * 20}px) translateY(-50%)`; 
        }
      }

      // 🌿 Regeneration
      if (step.id === 'regeneration' && regenPath) {
        const drawOffset = regenLength * (1 - easedSection);
        regenPath.style.strokeDashoffset = drawOffset;
      }

      // 🥚 Ernährung
      if (step.id === 'ernaehrung') {
        if (eggOutline) {
          const outlineProg = Math.min(sectionProgress / 0.6, 1);
          eggOutline.style.strokeDashoffset = eggOutlineLength * (1 - outlineProg);
        }
        if (eggYolk) {
          const yolkProg = Math.max((sectionProgress - 0.4) / 0.6, 0);
          eggYolk.style.opacity = yolkProg;
        }
      }
    }); // Ende forEach
  } // Ende updateSteps

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateSteps();
        ticking = false;
      });
      ticking = true;
    }
  });
  window.addEventListener('resize', updateSteps);
  
  // Einmal initial aufrufen
  updateSteps();
});