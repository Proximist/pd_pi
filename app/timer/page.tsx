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
  const [countdownEndDate, setCountdownEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // Fetch the countdown end date from the server
      fetch('/api/countdown-end-date')
        .then((res) => res.json())
        .then((data) => {
          if (data.countdownEndDate) {
            setCountdownEndDate(parseISO(data.countdownEndDate));
          } else {
            // If no countdown end date is found, set it to 12 days from now
            const newCountdownEndDate = new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000);
            setCountdownEndDate(newCountdownEndDate);

            // Save the new countdown end date to the server
            fetch('/api/countdown-end-date', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ countdownEndDate: newCountdownEndDate.toISOString() }),
            });
          }

          // Start the countdown timer
          startCountdownTimer();
        })
        .catch((error) => {
          console.error('Error fetching countdown end date:', error);
          setTimeLeft('This app should be opened in Telegram');
          setIsInitialLoading(false);
        });
    } else {
      setTimeLeft('This app should be opened in Telegram');
      setIsInitialLoading(false);
    }
  }, []);

  const startCountdownTimer = () => {
    const interval = setInterval(() => {
      if (countdownEndDate) {
        const now = new Date().getTime();
        const distance = countdownEndDate.getTime() - now;

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
      }

      setIsInitialLoading(false);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  };

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
