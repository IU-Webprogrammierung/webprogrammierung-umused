document.addEventListener('DOMContentLoaded', function () {
  const steps = document.querySelectorAll('.training-step');
  if (!steps.length) return;

  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* EINSTELLUNG: Trägheit / "Gewicht"
     0.02 - 0.03 = Sehr weich, "schwer", wirkt edel (Premium)
     0.05 - 0.10 = Reagiert schneller, direkter
  */
  const SMOOTHING_FACTOR = 0.03; 

  // --- Initialisierung der Pfade ---
  
  // 1. Dauerlauf
  const dauerStep = document.getElementById('dauerlauf');
  const dauerPath = dauerStep ? dauerStep.querySelector('.dauerlauf-path path') : null;
  let dauerLength = 0;
  if (dauerPath) {
    dauerLength = dauerPath.getTotalLength();
    dauerPath.style.strokeDasharray = dauerLength;
    dauerPath.style.strokeDashoffset = dauerLength;
  }

  // 2. Intervall
  const ekgStep = document.getElementById('intervall');
  const ekgPath = ekgStep ? ekgStep.querySelector('.ekg-line path') : null;
  let ekgLength = 0;
  if (ekgPath) {
    ekgLength = ekgPath.getTotalLength();
    ekgPath.style.strokeDasharray = ekgLength;
    ekgPath.style.strokeDashoffset = ekgLength;
  }
  const intervalHeart = document.querySelector('.interval-heart');

  // 3. Regeneration
  const regenStep = document.getElementById('regeneration');
  const regenPath = regenStep ? regenStep.querySelector('.reg-spiral path') : null;
  let regenLength = 0;
  if (regenPath) {
    regenLength = regenPath.getTotalLength();
    regenPath.style.strokeDasharray = regenLength;
    regenPath.style.strokeDashoffset = regenLength;
  }

  // 4. Ernährung
  // 4. Ernährung NEU (Masken-Logik)
  const eggStep = document.getElementById('ernaehrung');
  const foodRevealRect = document.getElementById('food-reveal-rect');
  // Maximale Höhe des SVGs (siehe viewBox="0 0 793 650")
  const FOOD_SVG_HEIGHT = 650; 

  // Fallback Reduced Motion
  if (prefersReduced) {
    // ... (andere fallbacks)
    if (foodRevealRect) foodRevealRect.setAttribute('height', FOOD_SVG_HEIGHT); // Sofort alles zeigen
    // ...
    return;
  }

  // --- Reduced Motion Fallback ---
  if (prefersReduced) {
    // Alles sofort sichtbar machen, wenn Nutzer keine Animation wünscht
    if (dauerPath) dauerPath.style.strokeDashoffset = 0;
    if (ekgPath) ekgPath.style.strokeDashoffset = 0;
    if (regenPath) regenPath.style.strokeDashoffset = 0;
    if (eggOutline) eggOutline.style.strokeDashoffset = 0;
    if (eggYolk) eggYolk.style.opacity = 1;
    
    // Cards sofort einblenden
    steps.forEach(step => {
      const card = step.querySelector('.step-card');
      if (card) {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }
    });
    if (intervalHeart) {
      intervalHeart.style.opacity = 1;
      intervalHeart.style.transform = 'translateX(0) translateY(-50%)';
    }
    return; // Script hier beenden
  }

  // ============================================================
  // STATE MANAGEMENT FÜR SMOOTH SCROLL
  // ============================================================
  
  let stepStates = new Map();

  steps.forEach(step => {
    stepStates.set(step, {
      currentProgress: 0, // Der "verzögerte" Wert für die Animation
      targetProgress: 0   // Der "echte" Wert vom Scrollrad
    });
  });

  // ============================================================
  // RENDER LOOP (Läuft permanent 60fps)
  // ============================================================
  function render() {
    const viewportHeight = window.innerHeight;

    steps.forEach(step => {
      const state = stepStates.get(step);
      const rect = step.getBoundingClientRect();
      const stepHeight = step.offsetHeight; // Sollte durch CSS ca 500vh sein
      
      // WICHTIG: Wir animieren die .step-card, nicht den ganzen Container
      const card = step.querySelector('.step-card');
      if (!card) return;

      // --- 1. Ziel-Fortschritt berechnen ---
      // Wie weit ist der Step durch den Viewport gescrollt?
      const totalDistance = stepHeight + viewportHeight;
      const currentScrollPos = viewportHeight - rect.top;
      
      let rawTarget = currentScrollPos / totalDistance;
      
      // Begrenzen auf 0 bis 1
      if (rawTarget < 0) rawTarget = 0;
      if (rawTarget > 1) rawTarget = 1;

      state.targetProgress = rawTarget;

      // --- 2. Interpolation (Die "Gummiband"-Physik) ---
      const diff = state.targetProgress - state.currentProgress;
      
      // Performance-Optimierung: Wenn Unterschied winzig, direkt setzen
      if (Math.abs(diff) < 0.0001) {
        state.currentProgress = state.targetProgress;
      } else {
        // Annäherung pro Frame um den Faktor
        state.currentProgress += diff * SMOOTHING_FACTOR;
      }

      const progress = state.currentProgress;

      // --- 3. Visualisierung: Der "Elevator"-Effekt ---
      
      /* ZEITPLANUNG (TIMELINE):
         0.00 - 0.15: Karte kommt von unten rein (Fährt hoch)
         0.15 - 0.80: PLATEAU (Karte steht still) -> Hier läuft die SVG Animation!
         0.80 - 0.95: Karte fährt nach oben weg (Abgang)
      */

      const fadeInStart = 0.05; 
      const fadeInEnd = 0.15;   
      
      const fadeOutStart = 0.80; 
      const fadeOutEnd = 0.95;  

      let opacity = 0;
      let translateY = 0; 

      if (progress < fadeInStart) {
        // 1. Warten unten
        opacity = 0; 
        translateY = 120; // Startet 120px tiefer
      } else if (progress < fadeInEnd) {
        // 2. Auftritt (Einblenden & Hochfahren)
        const localP = (progress - fadeInStart) / (fadeInEnd - fadeInStart);
        opacity = localP;
        // Bewegung von 120px zu 0px
        translateY = 120 * (1 - localP);
        
      } else if (progress < fadeOutStart) {
        // 3. PLATEAU (Mitte) - Karte steht still, Bühne frei für SVG
        opacity = 1; 
        translateY = 0;
        
      } else if (progress < fadeOutEnd) {
        // 4. Abgang (Ausblenden & Wegfahren)
        const localP = (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        opacity = 1 - localP;
        // Bewegung von 0px zu -120px (nach oben)
        translateY = -120 * localP; 
        
      } else {
        // 5. Vorbei (oben unsichtbar)
        opacity = 0; 
        translateY = -120;
      }

      // Werte auf die Karte anwenden
      card.style.opacity = opacity.toFixed(3);
      card.style.transform = `translateY(${translateY.toFixed(1)}px)`;


      // --- 4. SVG Animationen (Nur während des Plateaus) ---
      
      // Wir starten das Zeichnen erst, wenn die Karte "eingerastet" ist (bei 0.15)
      // und beenden es kurz bevor sie wegfährt (bei 0.75)
      const drawStart = 0.15;
      const drawEnd = 0.75;
      
      let drawProgress = (progress - drawStart) / (drawEnd - drawStart);
      
      // Begrenzen
      if (drawProgress < 0) drawProgress = 0;
      if (drawProgress > 1) drawProgress = 1;

      // >>>> A) Dauerlauf
      if (step.id === 'dauerlauf' && dauerPath) {
        dauerPath.style.strokeDashoffset = dauerLength * (1 - drawProgress);
      }

      // >>>> B) Intervall
      if (step.id === 'intervall' && ekgPath) {
        ekgPath.style.strokeDashoffset = ekgLength * (1 - drawProgress);
        
        if (intervalHeart) {
          // Herz erscheint passend zur Linie
          intervalHeart.style.opacity = drawProgress;
          // Herz bewegt sich leicht horizontal
          intervalHeart.style.transform = `translateX(${drawProgress * 30}px) translateY(-50%)`; 
        }
      }

      // >>>> C) Regeneration
      if (step.id === 'regeneration' && regenPath) {
        regenPath.style.strokeDashoffset = regenLength * (1 - drawProgress);
      }

// >>>> D) Ernährung (Neue Masken-Animation)
      if (step.id === 'ernaehrung' && foodRevealRect) {
        // Wir nutzen drawProgress (0.0 bis 1.0)
        // und mappen es auf die Höhe des SVGs (0 bis 650)
        
        const revealHeight = drawProgress * FOOD_SVG_HEIGHT;
        foodRevealRect.setAttribute('height', revealHeight);
      }

    }); // Ende forEach step

    // Loop am Leben halten
    requestAnimationFrame(render);
  }

  // Starten
  requestAnimationFrame(render);
});