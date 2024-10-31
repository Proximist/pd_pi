'use client';

import { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/types';
import Link from 'next/link';
import './timer.css';

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [countdownEndDate, setCountdownEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setIsDarkMode(tg.colorScheme === 'dark');
    }

    // Add Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);

    const initializeTimer = async () => {
      try {
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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [countdownEndDate]);

  const containerClass = `container ${isDarkMode ? 'dark-mode' : ''}`;
  const footerContainerClass = `footerContainer ${isDarkMode ? 'dark-mode' : ''}`;
  const footerLinkClass = `footerLink ${isDarkMode ? 'dark-mode' : ''}`;
  const activeFooterLinkClass = `footerLink activeFooterLink ${isDarkMode ? 'dark-mode' : ''}`;

  const renderContent = () => {
    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!countdownEndDate) {
      return <div className="loader"></div>;
    }

    return (
      <div className="timer-display">
        <div className="timer-unit">
          <div className="timer-slot">
            <div className="timer-number">{String(timeLeft.days).padStart(2, '0')}</div>
          </div>
          <div className="timer-label">Days</div>
        </div>
        <div className="timer-separator">:</div>
        <div className="timer-unit">
          <div className="timer-slot">
            <div className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</div>
          </div>
          <div className="timer-label">Hours</div>
        </div>
        <div className="timer-separator">:</div>
        <div className="timer-unit">
          <div className="timer-slot">
            <div className="timer-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
          </div>
          <div className="timer-label">Minutes</div>
        </div>
        <div className="timer-separator">:</div>
        <div className="timer-unit">
          <div className="timer-slot">
            <div className="timer-number">{String(timeLeft.seconds).padStart(2, '0')}</div>
          </div>
          <div className="timer-label">Seconds</div>
        </div>
      </div>
    );
  };

  return (
    <div className={containerClass}>
      {renderContent()}
      <div className={footerContainerClass}>
        <Link href="/">
          <a className={footerLinkClass}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
        </Link>
        <Link href="/invite">
          <a className={footerLinkClass}>
            <i className="fas fa-users"></i>
            <span>Friends</span>
          </a>
        </Link>
        <Link href="/task">
          <a className={footerLinkClass}>
            <i className="fas fa-clipboard"></i>
            <span>Tasks</span>
          </a>
        </Link>
        <Link href="/timer">
          <a className={activeFooterLinkClass}>
            <i className="fas fa-calendar"></i>
            <span>Event</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Timer;
