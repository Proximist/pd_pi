'use client';

import { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/types';
import { format, parseISO } from 'date-fns';

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // Set the fixed countdown date (12 days from now)
      const countdownDate = new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000);

      // Update the countdown timer every second
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate.getTime() - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeLeft('Countdown completed!');
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        }

        setIsInitialLoading(false);
      }, 1000);

      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    } else {
      setTimeLeft('This app should be opened in Telegram');
      setIsInitialLoading(false);
    }
  }, []);

  return (
    <div className="timer-container">
      {isInitialLoading ? (
        <div className="loader"></div>
      ) : (
        <div className="timer-display">{timeLeft}</div>
      )}
    </div>
  );
};

export default Timer;
