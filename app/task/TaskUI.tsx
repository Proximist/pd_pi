
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

      // Listen for theme changes
      tg.onEvent('themeChanged', () => {
        setIsDarkMode(tg.colorScheme === 'dark');
      });
    }
  }, []);

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
          <button
            onClick={() => {
              if (buttonStage1 === 'check') {
                handleButtonClick4();
              } else if (buttonStage1 === 'claim') {
                handleClaim4();
              }
            }}
            disabled={buttonStage1 === 'claimed' || isLoading}
          >
            {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? '+200' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
          </button>
        </li>
        <li>
          <i className="fab fa-telegram-plane"></i>
          <span>Subscribe PG Telegram Channel :</span>
          <button
            onClick={() => {
              handleButtonClick6();
              handleClaim6();
            }}
            disabled={buttonStage3 === 'claimed'}
          >
            {buttonStage3 === 'check' ? '+200' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
          </button>
        </li>
        <li>
          <i className="fab fa-twitter"></i>
          <span>Follow PG's X Handle :</span>
          <button
            onClick={() => {
              handleButtonClick5();
              handleClaim5();
            }}
            disabled={buttonStage2 === 'claimed'}
          >
            {buttonStage2 === 'check' ? '+200' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
          </button>
        </li>
        <li>
          <i className="fab fa-discord"></i>
          <span>Join PG's Discord Server :</span>
          <button
            onClick={() => {
              if (buttonStage7 === 'check') {
                handleButtonClick7();
              } else if (buttonStage7 === 'claim') {
                handleClaim7();
              }
            }}
            disabled={buttonStage7 === 'claimed' || isLoading1}
          >
            {isLoading1 ? 'Claiming...' : buttonStage7 === 'check' ? '+200' : buttonStage7 === 'claim' ? 'Claim' : 'Claimed'}
          </button>
        </li>
        <li>
          <i className="fab fa-instagram"></i>
          <span>Follow PG Instagram Handle :</span>
          <button
            onClick={() => {
              if (buttonStage8 === 'check') {
                handleButtonClick8();
              } else if (buttonStage8 === 'claim') {
                handleClaim8();
              }
            }}
            disabled={buttonStage8 === 'claimed' || isLoading2}
          >
            {isLoading2 ? 'Claiming...' : buttonStage8 === 'check' ? '+200' : buttonStage8 === 'claim' ? 'Claim' : 'Claimed'}
          </button>
        </li>
      </ul>
      <div className="footer-container">
        <Link href="/">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-home text-2xl"></i>
            <p className="text-sm">Home</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-users text-2xl"></i>
            <p className="text-sm">Friends</p>
          </a>
        </Link>
        <Link href="/task">
          <a className="flex flex-col items-center text-gray-800">
            <i className="fas fa-clipboard text-2xl"></i>
            <p className="text-sm">Tasks</p>
          </a>
        </Link>
      </div>
      {notification && <div className="notification-banner">{notification}</div>}
    </div>
  );
}
