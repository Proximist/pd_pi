function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const UPDATE_MESSAGES = [
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

export const getRandomMessage = (): string => {
  let randomIndex;
  do {
    randomIndex = getRandomInt(0, UPDATE_MESSAGES.length - 1);
  } while (randomIndex === previousIndex);
  
  previousIndex = randomIndex;
  return UPDATE_MESSAGES[randomIndex];
};

export const toggleUpdateText = (elementId: string): void => {
  const updateTextElement = document.getElementById(elementId);
  if (!updateTextElement) return;

  setInterval(() => {
    updateTextElement.classList.remove('fade-in');
    updateTextElement.classList.add('fade-out');
    
    setTimeout(() => {
      updateTextElement.textContent = getRandomMessage();
      updateTextElement.classList.remove('fade-out');
      updateTextElement.classList.add('fade-in');
    }, 1000);
  }, 10000);
};
