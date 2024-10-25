function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function toggleUpdateText() {
  // Wait for DOM to be ready
  const initializeTextToggle = () => {
    const updateTextElement = document.getElementById('updateText');
    
    // Guard clause if element doesn't exist
    if (!updateTextElement) {
      console.warn('Update text element not found');
      return;
    }

    const texts = [
      "Exciting updates are on the way, keep farming :)",
      "Stay healthy and stay alive for future events :)",
      "Join our socials for latest updates",
      "Only follow news shared in our official platforms",
      "You're part of something special, stay connected for surprises!",
      "Big things are growing, keep your eyes on the field!",
      "Hold tight! The best surprises are worth the wait!",
      "Behind the scenes, we're working on something you'll love!"
    ];
    
    let previousIndex = -1;
    let isTransitioning = false;

    // Initial text setup
    updateTextElement.classList.add('fade');
    updateTextElement.classList.add('fade-in');

    const updateText = () => {
      if (isTransitioning) return;
      isTransitioning = true;

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * texts.length);
      } while (randomIndex === previousIndex);

      previousIndex = randomIndex;

      updateTextElement.classList.remove('fade-in');
      updateTextElement.classList.add('fade-out');

      setTimeout(() => {
        updateTextElement.textContent = texts[randomIndex];
        updateTextElement.classList.remove('fade-out');
        updateTextElement.classList.add('fade-in');
        isTransitioning = false;
      }, 1000);
    };

    // Start the interval after initial delay
    setTimeout(() => {
      updateText(); // Initial update
      setInterval(updateText, 10000);
    }, 2000);
  };

  // If document is already loaded, initialize immediately
  if (document.readyState === 'complete') {
    initializeTextToggle();
  } else {
    // Otherwise wait for DOM to be ready
    window.addEventListener('load', initializeTextToggle);
  }
}
