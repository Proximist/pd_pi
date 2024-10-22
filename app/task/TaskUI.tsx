import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './TaskUI.css';

interface TaskUIProps {
  user: any;
  buttonStage1: 'check' | 'claim' | 'claimed';
  buttonStage2: 'check' | 'claim' | 'claimed';
  buttonStage3: 'check' | 'claim' | 'claimed';
  buttonStage7: 'check' | 'claim' | 'claimed';
  buttonStage8: 'check' | 'claim' | 'claimed';
  isLoading: boolean;
  isLoading1: boolean;
  isLoading2: boolean;
  notification: string;
  handleButtonClick4: () => void;
  handleButtonClick5: () => void;
  handleButtonClick6: () => void;
  handleButtonClick7: () => void;
  handleButtonClick8: () => void;
  handleClaim4: () => void;
  handleClaim5: () => void;
  handleClaim6: () => void;
  handleClaim7: () => void;
  handleClaim8: () => void;
}

export default function TaskUI({
  user,
  buttonStage1,
  buttonStage2,
  buttonStage3,
  buttonStage7,
  buttonStage8,
  isLoading,
  isLoading1,
  isLoading2,
  notification,
  handleButtonClick4,
  handleButtonClick5,
  handleButtonClick6,
  handleButtonClick7,
  handleButtonClick8,
  handleClaim4,
  handleClaim5,
  handleClaim6,
  handleClaim7,
  handleClaim8,
}: TaskUIProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsDarkMode(tg.colorScheme === 'dark');

      tg.onEvent('themeChanged', () => {
        setIsDarkMode(tg.colorScheme === 'dark');
      });
    }
  }, []);

  const renderButton = (stage: 'check' | 'claim' | 'claimed', points: number, onClick: () => void, isLoading: boolean) => {
    if (stage === 'check') {
      return (
        <button className="button" onClick={onClick} disabled={isLoading}>
          <div className="button-wrapper">
            <div className="text">+{points}</div>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </span>
          </div>
        </button>
      );
    } else if (stage === 'claim') {
      return (
        <button className="button" onClick={onClick} disabled={isLoading}>
          <div className="button-wrapper">
            <div className="text">Claim</div>
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </span>
          </div>
        </button>
      );
    } else {
      return (
        <button className="button" disabled>
          <div className="button-wrapper">
            <div className="text">Claimed</div>
          </div>
        </button>
      );
    }
  };

  if (!user) {
    return <div className="loader"></div>;
  }

  return (
    <div className={`task-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="header">
        <div className="points">
          <span>₱ {user.points}</span>
        </div>
      </div>
      <div className="task-icon-container">
        <div className="task-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
      </div>
      <div className="description">
        Complete the following tasks<br />and increase PG
      </div>
      <ul className="task-list">
        <li>
          <i className="fab fa-youtube"></i>
          <span>Subscribe PG YouTube channel :</span>
          {renderButton(buttonStage1, 200, handleButtonClick4, isLoading)}
        </li>
        <li>
          <i className="fab fa-telegram-plane"></i>
          <span>Subscribe PG Telegram Channel :</span>
          {renderButton(buttonStage3, 200, handleButtonClick6, isLoading)}
        </li>
        <li>
          <i className="fab fa-twitter"></i>
          <span>Follow PG's X Handle :</span>
          {renderButton(buttonStage2, 200, handleButtonClick5, isLoading)}
        </li>
        <li>
          <i className="fab fa-discord"></i>
          <span>Join PG's Discord Server :</span>
          {renderButton(buttonStage7, 200, handleButtonClick7, isLoading1)}
        </li>
        <li>
          <i className="fab fa-instagram"></i>
          <span>Follow PG Instagram Handle :</span>
          {renderButton(buttonStage8, 200, handleButtonClick8, isLoading2)}
        </li>
      </ul>
      <div className={`footer-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <Link href="/">
          <a className="footer-link">
            <i className="fas fa-home footer-icon"></i>
            <p className="footer-text">Home</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className="footer-link">
            <i className="fas fa-users footer-icon"></i>
            <p className="footer-text">Friends</p>
          </a>
        </Link>
        <Link href="/task">
          <a className="footer-link active-nav">
            <i className="fas fa-clipboard footer-icon"></i>
            <p className="footer-text">Tasks</p>
          </a>
        </Link>
      </div>
      {notification && <div className="notification-banner">{notification}</div>}
    </div>
  );
}
