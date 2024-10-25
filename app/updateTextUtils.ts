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

let lastIndex = -1;

export const getRandomMessage = (): string => {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * UPDATE_MESSAGES.length);
    } while (newIndex === lastIndex);
    
    lastIndex = newIndex;
    return UPDATE_MESSAGES[newIndex];
};
