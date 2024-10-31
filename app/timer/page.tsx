'use client';

import { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/types';
import './timer.css';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTimer = async () => {
      try {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
        }

        const response = await fetch('/api/countdown');
        const data = await response.json();

        if (data.countdownEndDate) {
          setCountdownEndDate(new Date(data.countdownEndDate));
        } else {
          const newCountdownEndDate = new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000);
          setCountdownEndDate(newCountdownEndDate);

          await fetch('/api/countdown', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ countdownEndDate: newCountdownEndDate.toISOString() }),
          });
        }
      } catch (error) {
        console.error('Error initializing timer:', error);
        setError('Failed to initialize timer');
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeTimer();
  }, []);

  useEffect(() => {
    if (!countdownEndDate) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = countdownEndDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft('Countdown completed!');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [countdownEndDate]);

  if (error) {
    return (
      <div className="timer-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="timer-container">
      {isInitialLoading ? (
        <div className="loader"></div>
      ) : (
        <div className="timer-display">
          <div className="timer-text">{timeLeft}</div>
          <div className="timer-background"></div>
        </div>
      )}
    </div>
  );
};

export default Timer;
