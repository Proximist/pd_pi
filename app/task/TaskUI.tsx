import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './TaskUI.css';
import '../globals.css'

interface TaskUIProps {
  user: any;
  error: string | null;
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
  error,
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
    if (window.Telegram?.WebApp) {
      const isDark = window.Telegram.WebApp.colorScheme === 'dark';
      setIsDarkMode(isDark);

      // Add theme classes to body
      document.body.classList.toggle('dark-mode', isDark);
    }
  }, []);

  // Add dark mode classes to elements
  const containerClass = `task-page ${isDarkMode ? 'dark-mode' : ''}`;
  const headerClass = `header ${isDarkMode ? 'dark-mode' : ''}`;
  const pointsClass = `points ${isDarkMode ? 'dark-mode' : ''}`;
  const taskIconContainerClass = `task-icon-container ${isDarkMode ? 'dark-mode' : ''}`;
  const taskIconClass = `task-icon ${isDarkMode ? 'dark-mode' : ''}`;
  const descriptionClass = `description ${isDarkMode ? 'dark-mode' : ''}`;
  const taskListClass = `task-list ${isDarkMode ? 'dark-mode' : ''}`;
  const taskItemClass = `task-item ${isDarkMode ? 'dark-mode' : ''}`;
  const buttonClass = `task-button ${isDarkMode ? 'dark-mode' : ''}`;
  const footerContainerClass = `footerContainer ${isDarkMode ? 'dark-mode' : ''}`
  const footerLinkClass = `footerLink ${isDarkMode ? 'dark-mode' : ''}`;
  const activeFooterLinkClass = `footerLink activeFooterLink ${isDarkMode ? 'dark-mode' : ''}`
  const notificationClass = `notification-banner ${isDarkMode ? 'dark-mode' : ''}`;
  const errorClass = `container mx-auto p-4 text-red-500 ${isDarkMode ? 'dark-mode' : ''}`;
  const loaderClass = `loader ${isDarkMode ? 'dark-mode' : ''}`;

  const renderContent = () => {
    if (error) {
      return <div className={errorClass}>{error}</div>;
    }

    if (!user) {
      return <div className={loaderClass}></div>;
    }

    return (
      <>
        <div className={headerClass}>
          <div className={pointsClass}>
            <span>₱ {user.points}</span>
          </div>
        </div>
        <div className={taskIconContainerClass}>
          <div className={taskIconClass}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
        </div>
        <div className={descriptionClass}>
          Complete the following tasks<br />and increase PG
        </div>
        <ul className={taskListClass}>
          <li className={taskItemClass}>
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
              className={buttonClass}
            >
              {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? '+200' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </li>
          <li className={taskItemClass}>
            <i className="fab fa-telegram-plane"></i>
            <span>Subscribe PG Telegram Channel :</span>
            <button
              onClick={() => {
                handleButtonClick6();
                handleClaim6();
              }}
              disabled={buttonStage3 === 'claimed'}
              className={buttonClass}
            >
              {buttonStage3 === 'check' ? '+200' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </li>
          <li className={taskItemClass}>
            <i className="fab fa-twitter"></i>
            <span>Follow PG's X Handle :</span>
            <button
              onClick={() => {
                handleButtonClick5();
                handleClaim5();
              }}
              disabled={buttonStage2 === 'claimed'}
              className={buttonClass}
            >
              {buttonStage2 === 'check' ? '+200' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </li>
          <li className={taskItemClass}>
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
              className={buttonClass}
            >
              {isLoading1 ? 'Claiming...' : buttonStage7 === 'check' ? '+200' : buttonStage7 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </li>
          <li className={taskItemClass}>
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
              className={buttonClass}
            >
              {isLoading2 ? 'Claiming...' : buttonStage8 === 'check' ? '+200' : buttonStage8 === 'claim' ? 'Claim' : 'Claimed'}
            </button>
          </li>
        </ul>
      </>
    );
  };

  return (
    <div className={containerClass}>
      {renderContent()}
      <div className={footerContainerClass}>
        <Link href="/">
          <a className={footerLinkClass}>
            <i className="fas fa-home text-2xl"></i>
            <p className="text-sm">Home</p>
          </a>
        </Link>
        <Link href="/invite">
          <a className={footerLinkClass}>
            <i className="fas fa-users text-2xl"></i>
            <p className="text-sm">Friends</p>
          </a>
        </Link>
        <Link href="/task">
          <a className={activeFooterLinkClass}>
            <i className="fas fa-clipboard text-2xl"></i>
            <p className="text-sm">Tasks</p>
          </a>
        </Link>
      </div>
      {notification && <div className={notificationClass}>{notification}</div>}
    </div>
  );
}
