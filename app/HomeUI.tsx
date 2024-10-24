import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toggleUpdateText } from './utils';
import './HomeUI.css';
import './globals.css';

interface HomeUIProps {
  user: any;
  buttonStage1: 'check' | 'claim' | 'claimed';
  buttonStage2: 'check' | 'claim' | 'claimed';
  buttonStage3: 'check' | 'claim' | 'claimed';
  farmingStatus: 'farm' | 'farming' | 'claim';
  isLoading: boolean;
  notification: string;
  error: string | null;
  isInitialLoading: boolean;
  handleButtonClick1: () => void;
  handleButtonClick2: () => void;
  handleButtonClick3: () => void;
  handleClaim1: () => void;
  handleClaim2: () => void;
  handleClaim3: () => void;
  handleFarmClick: () => void;
}

export default function HomeUI({
  user,
  buttonStage1,
  buttonStage2,
  buttonStage3,
  farmingStatus,
  isLoading,
  notification,
  error,
  isInitialLoading,
  handleButtonClick1,
  handleButtonClick2,
  handleButtonClick3,
  handleClaim1,
  handleClaim2,
  handleClaim3,
  handleFarmClick,
}: HomeUIProps) {
  const [farmingPoints, setFarmingPoints] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isClaimAnimating, setIsClaimAnimating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
    toggleUpdateText();

    // Check Telegram theme
    if (window.Telegram?.WebApp) {
      const isDark = window.Telegram.WebApp.colorScheme === 'dark';
      setIsDarkMode(isDark);

      // Add theme classes to body
      document.body.classList.toggle('dark-mode', isDark);
    }
  // Add this:
  const path = window.location.pathname;
  if (path === '/') setActiveTab('home');
  else if (path === '/invite') setActiveTab('friends');
  else if (path === '/task') setActiveTab('tasks');
}, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (farmingStatus === 'farming' && user?.startFarming) {
      const startTime = new Date(user.startFarming).getTime();
      const currentTime = new Date().getTime();
      const secondsElapsed = Math.floor((currentTime - startTime) / 1000);
      
      setFarmingPoints(secondsElapsed);
      setCurrentNumber(secondsElapsed);

      interval = setInterval(() => {
        setIsSliding(true);
        setTimeout(() => {
          setFarmingPoints(prev => prev + 1);
          setCurrentNumber(prev => prev + 1);
          setIsSliding(false);
        }, 500);
      }, 1000);
    } else {
      setFarmingPoints(0);
      setCurrentNumber(0);
    }
    return () => clearInterval(interval);
  }, [farmingStatus, user?.startFarming]);

  const handleClaimClick = () => {
    setIsClaimAnimating(true);
    handleFarmClick();
    setTimeout(() => {
      setIsClaimAnimating(false);
    }, 1000);
  };

  // Add dark mode classes to elements
  const containerClass = `home-container ${isDarkMode ? 'dark-mode' : ''}`;
  const headerClass = `header-container ${isDarkMode ? 'dark-mode' : ''}`;
  const tasksClass = `tasks-container ${isDarkMode ? 'dark-mode' : ''}`;
  const socialClass = `social-container ${isDarkMode ? 'dark-mode' : ''}`;
  const footerClass = `footer-container ${isDarkMode ? 'dark-mode' : ''}`;
  const footerContainerClass = `footerContainer ${isDarkMode ? 'dark-mode' : ''}`
  const footerLinkClass = `footerLink ${isDarkMode ? 'dark-mode' : ''}`
  const activeFooterLinkClass = `footerLink activeFooterLink ${isDarkMode ? 'dark-mode' : ''}`

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <div className="content-area">
          <div className="loader"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="content-area">
          <div className="error">{error}</div>
        </div>
      );
    }

    return (
      <>
        <div className={headerClass}>
          <div className="dog-image-container">
            <img
              alt="Animated style dog image"
              className="dog-image"
              src="https://i.imgur.com/F13Hj7a.jpeg"
            />
          </div>
          <p id="pixelDogsCount" className={`pixel-dogs-count ${isDarkMode ? 'dark-mode' : ''}`}>
            {user.points} PixelDogs
          </p>
          <p id="updateText" className={`update-text fade fade-in ${isDarkMode ? 'dark-mode' : ''}`}>
            Exciting updates are on the way :)
          </p>
          <div className={tasksClass}>
            <button className={`tasks-button ${isDarkMode ? 'dark-mode' : ''}`}>Follow Our Socials..!</button>
            <div className={`social-container ${isDarkMode ? 'dark-mode' : ''}`}>
              <p className={`social-text ${isDarkMode ? 'dark-mode' : ''}`}>Follow Our Youtube!</p>
              <button
                onClick={() => {
                  if (buttonStage1 === 'check') {
                    handleButtonClick1();
                  } else if (buttonStage1 === 'claim') {
                    handleClaim1();
                  }
                }}
                disabled={buttonStage1 === 'claimed' || isLoading}
                className={`claim-button ${buttonStage1 === 'claimed' || isLoading ? 'disabled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              >
                {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
            <div className={`social-container ${isDarkMode ? 'dark-mode' : ''}`}>
              <p className={`social-text ${isDarkMode ? 'dark-mode' : ''}`}>Follow Our Twitter!</p>
              <button
                onClick={() => {
                  handleButtonClick2();
                  handleClaim2();
                }}
                disabled={buttonStage2 === 'claimed'}
                className={`claim-button ${buttonStage2 === 'claimed' ? 'disabled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              >
                {buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
            <div className={`social-container ${isDarkMode ? 'dark-mode' : ''}`}>
              <p className={`social-text ${isDarkMode ? 'dark-mode' : ''}`}>Join Our Telegram!</p>
              <button
                onClick={() => {
                  handleButtonClick3();
                  handleClaim3();
                }}
                disabled={buttonStage3 === 'claimed'}
                className={`claim-button ${buttonStage3 === 'claimed' ? 'disabled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              >
                {buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow"></div>
        <button
          className={`farm-button ${farmingStatus === 'farming' ? 'farming' : ''} ${isClaimAnimating ? 'claim-animating' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
          onClick={farmingStatus === 'claim' ? handleClaimClick : handleFarmClick}
          disabled={farmingStatus === 'farming' || isClaimAnimating}
        >
          {farmingStatus === 'farm' ? (
            <span className="claimFarms">Farm PixelDogs</span>
          ) : farmingStatus === 'farming' ? (
            <>
              Farming
              <div className="farming-points">
                <span className={`farming-points-number ${isSliding ? 'sliding-out' : ''}`} key={currentNumber}>
                  {farmingPoints}
                </span>
              </div>
            </>
          ) : (
            <span className="claimFarm">Claim Farm</span>
          )}
        </button>
        {notification && <div className={`notification-banner ${isDarkMode ? 'dark-mode' : ''}`}>{notification}</div>}
      </>
    );
  };

  return (
    <div className={containerClass}>
      {renderContent()}
      <div 
  className={footerContainerClass} 
  data-active={activeTab}
  data-from={activeTab === 'tasks' && newTab === 'home' ? 'tasks' : activeTab === 'home' && newTab === 'tasks' ? 'home' : undefined}
>
        <Link href="/">
          <a 
    className={activeTab === 'home' ? activeFooterLinkClass : footerLinkClass}
    onClick={() => setActiveTab('home')}
  >
    <i className="fas fa-home"></i>
    <span>Home</span>
  </a>
</Link>
<Link href="/invite">
  <a 
    className={activeTab === 'friends' ? activeFooterLinkClass : footerLinkClass}
    onClick={() => setActiveTab('friends')}
  >
    <i className="fas fa-users"></i>
    <span>Friends</span>
  </a>
</Link>
<Link href="/task">
  <a 
    className={activeTab === 'tasks' ? activeFooterLinkClass : footerLinkClass}
    onClick={() => setActiveTab('tasks')}
  >
    <i className="fas fa-clipboard"></i>
    <span>Tasks</span>
  </a>
        </Link>
      </div>
    </div>
  );
}
