document.addEventListener('DOMContentLoaded', () => {
  const starContainer = document.getElementById('star-container');
  
  // Nur ausführen, wenn wir auf der About-Seite sind
  if (starContainer) {
    const starCount = 300; // Anzahl der Sterne

    // 1. Sterne generieren
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Zufällige Position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Zufällige Größe (zwischen 1px und 3px)
      const size = Math.random() * 0.7 + 0.9;
      
      // Zufällige Verzögerung fürs Funkeln (damit nicht alle gleichzeitig blinken)
      const delay = Math.random() * 5;

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;

      starContainer.appendChild(star);
    }

    // 2. Parallax Effekt beim Scrollen
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // Wir bewegen den Container halb so schnell wie den Scroll (0.5)
      starContainer.style.transform = `translateY(${scrollY * 0.5}px)`;
    });
  }
});