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
  buttonStage9: 'check' | 'claim' | 'claimed';
  buttonStage10: 'check' | 'claim' | 'claimed';
  buttonStage11: 'check' | 'claim' | 'claimed';
  isLoading4: boolean;
  isLoading5: boolean;
  isLoading6: boolean;
  isLoading7: boolean;
  isLoading8: boolean;
  isLoading9: boolean;
  isLoading10: boolean;
  isLoading11: boolean;
  notification: string;
  handleButtonClick4: () => void;
  handleButtonClick5: () => void;
  handleButtonClick6: () => void;
  handleButtonClick7: () => void;
  handleButtonClick8: () => void;
  handleButtonClick9: () => void;
  handleButtonClick10: () => void;
  handleButtonClick11: () => void;
  handleClaim4: () => void;
  handleClaim5: () => void;
  handleClaim6: () => void;
  handleClaim7: () => void;
  handleClaim8: () => void;
  handleClaim9: () => void;
  handleClaim10: () => void;
  handleClaim11: () => void;
}

export default function TaskUI({
  user,
  error,
  buttonStage4,
  buttonStage5,
  buttonStage6,
  buttonStage7,
  buttonStage8,
  buttonStage9,
  buttonStage10,
  buttonStage11,
  isLoading4,
  isLoading5,
  isLoading6,
  isLoading7,
  isLoading8,
  isLoading9,
  isLoading10,
  isLoading11,
  notification,
  handleButtonClick4,
  handleButtonClick5,
  handleButtonClick6,
  handleButtonClick7,
  handleButtonClick8,
  handleButtonClick9,
  handleButtonClick10,
  handleButtonClick11,
  handleClaim4,
  handleClaim5,
  handleClaim6,
  handleClaim7,
  handleClaim8,
  handleClaim9,
  handleClaim10,
  handleClaim11,
}: TaskUIProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('handles');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const isDark = window.Telegram.WebApp.colorScheme === 'dark';
      setIsDarkMode(isDark);
      document.body.classList.toggle('dark-mode', isDark);
    }
  }, []);

  const containerClass = `task-page ${isDarkMode ? 'dark-mode' : ''}`;
  const headerClass = `header ${isDarkMode ? 'dark-mode' : ''}`;
  const pointsClass = `points ${isDarkMode ? 'dark-mode' : ''}`;
  const taskIconContainerClass = `task-icon-container ${isDarkMode ? 'dark-mode' : ''}`;
  const taskIconClass = `task-icon ${isDarkMode ? 'dark-mode' : ''}`;
  const descriptionClass = `description ${isDarkMode ? 'dark-mode' : ''}`;
  const taskListClass = `task-list ${isDarkMode ? 'dark-mode' : ''}`;
  const taskItemClass = `task-item ${isDarkMode ? 'dark-mode' : ''}`;
  const buttonClass = `task-button ${isDarkMode ? 'dark-mode' : ''}`;
  const footerContainerClass = `footerContainer ${isDarkMode ? 'dark-mode' : ''}`;
  const footerLinkClass = `footerLink ${isDarkMode ? 'dark-mode' : ''}`;
  const activeFooterLinkClass = `footerLink activeFooterLink ${isDarkMode ? 'dark-mode' : ''}`;
  const notificationClass = `notification-banner ${isDarkMode ? 'dark-mode' : ''}`;
  const errorClass = `container mx-auto p-4 text-red-500 ${isDarkMode ? 'dark-mode' : ''}`;
  const loaderClass = `loader ${isDarkMode ? 'dark-mode' : ''}`;

  const tabsContainerClass = `flex justify-center space-x-4 mb-4 ${isDarkMode ? 'dark-mode' : ''}`;
  const tabClass = (isActive: boolean) => `
    px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors
    ${isDarkMode 
      ? (isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300') 
      : (isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800')}
  `;

  const renderHandlesTasks = () => (
    <ul className={taskListClass}>
      <li className={taskItemClass}>
        <i className="fab fa-youtube"></i>
        <span>Subscribe PG YouTube channel :</span>
        <button
          onClick={() => {
            if (buttonStage4 === 'check') handleButtonClick4();
            else if (buttonStage4 === 'claim') handleClaim4();
          }}
          disabled={buttonStage4 === 'claimed' || isLoading4}
          className={buttonClass}
        >
          {isLoading4 ? 'Claiming...' : buttonStage4 === 'check' ? '+100' : buttonStage4 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
      <li className={taskItemClass}>
        <i className="fab fa-telegram-plane"></i>
        <span>Subscribe PG Telegram Channel :</span>
        <button
          onClick={() => {
            if (buttonStage6 === 'check') handleButtonClick6();
            else if (buttonStage6 === 'claim') handleClaim6();
          }}
          disabled={buttonStage6 === 'claimed' || isLoading6}
          className={buttonClass}
        >
          {isLoading6 ? 'Claiming...' : buttonStage6 === 'check' ? '+300' : buttonStage6 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
      <li className={taskItemClass}>
        <i className="fab fa-twitter"></i>
        <span>Follow PG's X Handle :</span>
        <button
          onClick={() => {
            if (buttonStage5 === 'check') handleButtonClick5();
            else if (buttonStage5 === 'claim') handleClaim5();
          }}
          disabled={buttonStage5 === 'claimed' || isLoading5}
          className={buttonClass}
        >
          {isLoading5 ? 'Claiming...' : buttonStage5 === 'check' ? '+150' : buttonStage5 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
      <li className={taskItemClass}>
        <i className="fab fa-discord"></i>
        <span>Join PG's Discord Server :</span>
        <button
          onClick={() => {
            if (buttonStage7 === 'check') handleButtonClick7();
            else if (buttonStage7 === 'claim') handleClaim7();
          }}
          disabled={buttonStage7 === 'claimed' || isLoading7}
          className={buttonClass}
        >
          {isLoading7 ? 'Claiming...' : buttonStage7 === 'check' ? '+150' : buttonStage7 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
      <li className={taskItemClass}>
        <i className="fab fa-instagram"></i>
        <span>Follow PG Instagram Handle :</span>
        <button
          onClick={() => {
            if (buttonStage8 === 'check') handleButtonClick8();
            else if (buttonStage8 === 'claim') handleClaim8();
          }}
          disabled={buttonStage8 === 'claimed' || isLoading8}
          className={buttonClass}
        >
          {isLoading8 ? 'Claiming...' : buttonStage8 === 'check' ? '+150' : buttonStage8 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
    </ul>
  );

  const renderPartnersTasks = () => (
    <ul className={taskListClass}>
      <li className={taskItemClass}>
        <i className="fab fa-twitch"></i>
        <span>Checkout Blum :</span>
        <button
          onClick={() => {
            if (buttonStage9 === 'check') handleButtonClick9();
            else if (buttonStage9 === 'claim') handleClaim9();
          }}
          disabled={buttonStage9 === 'claimed' || isLoading9}
          className={buttonClass}
        >
          {isLoading9 ? 'Claiming...' : buttonStage9 === 'check' ? '+100' : buttonStage9 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
      <li className={taskItemClass}>
        <i className="fab fa-youtube"></i>
        <span>Become a Major :</span>
        <button
          onClick={() => {
            if (buttonStage10 === 'check') handleButtonClick10();
            else if (buttonStage10 === 'claim') handleClaim10();
          }}
          disabled={buttonStage10 === 'claimed' || isLoading10}
          className={buttonClass}
        >
          {isLoading6 ? 'Claiming...' : buttonStage10 === 'check' ? '+300' : buttonStage10 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
      <li className={taskItemClass}>
        <i className="fab fa-youtube"></i>
        <span>Play Tomato :</span>
        <button
          onClick={() => {
            if (buttonStage11 === 'check') handleButtonClick11();
            else if (buttonStage11 === 'claim') handleClaim11();
          }}
          disabled={buttonStage11 === 'claimed' || isLoading11}
          className={buttonClass}
        >
          {isLoading11 ? 'Claiming...' : buttonStage11 === 'check' ? '+300' : buttonStage11 === 'claim' ? 'Claim' : 'Claimed'}
        </button>
      </li>
    </ul>
  );

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
        <div className={tabsContainerClass}>
          <div 
            className={tabClass(activeTab === 'handles')}
            onClick={() => setActiveTab('handles')}
          >
            Handles
          </div>
          <div 
            className={tabClass(activeTab === 'partners')}
            onClick={() => setActiveTab('partners')}
          >
            Partners
          </div>
        </div>
        {activeTab === 'handles' ? renderHandlesTasks() : renderPartnersTasks()}
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
