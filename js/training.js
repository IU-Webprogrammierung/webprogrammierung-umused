document.addEventListener('DOMContentLoaded', function () {
  const steps = document.querySelectorAll('.training-step');
  if (!steps.length) return;

  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 🔴 Intervall: EKG-Linie
  const ekgStep = document.getElementById('intervall');
  const ekgPath = ekgStep ? ekgStep.querySelector('.ekg-line path') : null;
  let ekgLength = 0;

  if (ekgPath) {
    ekgLength = ekgPath.getTotalLength();
    ekgPath.style.strokeDasharray = ekgLength;
    ekgPath.style.strokeDashoffset = ekgLength;
  }

  // ❤️ Intervall: Herz-Overlay
  const intervalHeart = document.querySelector('.interval-heart');

  // 🌿 Regeneration: Spirale
  const regenStep = document.getElementById('regeneration');
  const regenPath = regenStep ? regenStep.querySelector('.reg-spiral path') : null;
  let regenLength = 0;

  if (regenPath) {
    regenLength = regenPath.getTotalLength();
    regenPath.style.strokeDasharray = regenLength;
    regenPath.style.strokeDashoffset = regenLength;
  }

  // Bei reduzierter Bewegung: alles sichtbar, keine Animation
  if (prefersReduced) {
    if (ekgPath) ekgPath.style.strokeDashoffset = 0;
    if (regenPath) regenPath.style.strokeDashoffset = 0;
    if (intervalHeart) {
      intervalHeart.style.opacity = 1;
      intervalHeart.style.transform = 'translateX(0) translateY(-50%)';
    }
    return;
  }

  function updateSteps() {
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    steps.forEach(step => {
      const rect = step.getBoundingClientRect();
      const stepCenter = rect.top + rect.height / 2;

      const distance = Math.abs(viewportCenter - stepCenter);
      const maxDistance = viewportHeight * 2.0;

      let progress = 1 - distance / maxDistance;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      const eased = progress * progress;

      // Allgemeiner Effekt für alle Steps
      const opacity = 0.05 + eased * 1;
      const translateY = (1 - eased) * 30;

      step.style.opacity = opacity.toString();
      step.style.transform = 'translateY(' + translateY + 'px)';

      // 🔴 Intervall: EKG + Herz
      if (step.id === 'intervall') {
        if (ekgPath && ekgLength > 0) {
          const start = viewportHeight;
          const end = -rect.height;
          const total = start - end;

          let ekgProgress = (start - rect.top) / total;
          if (ekgProgress < 0) ekgProgress = 0;
          if (ekgProgress > 1) ekgProgress = 1;

          const drawOffset = ekgLength * (1 - ekgProgress);
          ekgPath.style.strokeDashoffset = drawOffset;

          if (intervalHeart) {
            const heartEase = ekgProgress * ekgProgress;
            const heartOpacity = heartEase;
            const slide = (1 - heartEase) * 80;

            intervalHeart.style.opacity = heartOpacity;
            intervalHeart.style.transform =
              'translateX(' + (-slide) + 'px) translateY(-50%)';
          }
        }
      }

      // 🌿 Regeneration: Spirale
      if (step.id === 'regeneration' && regenPath && regenLength > 0) {
        const start = viewportHeight;
        const end = -rect.height;
        const total = start - end;

        let regenProgress = (start - rect.top) / total;
        if (regenProgress < 0) regenProgress = 0;
        if (regenProgress > 1) regenProgress = 1;

        const drawOffset = regenLength * (1 - regenProgress);
        regenPath.style.strokeDashoffset = drawOffset;
      }
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateSteps();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', updateSteps);

  updateSteps();
});
