import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './HomeUI.css';
import './globals.css';
import { getRandomMessage } from './updateTextUtils';

interface HomeUIProps {
  user: any;
  error: string | null;
  buttonStage1: 'check' | 'claim' | 'claimed';
  buttonStage2: 'check' | 'claim' | 'claimed';
  buttonStage3: 'check' | 'claim' | 'claimed';
  farmingStatus: 'farm' | 'farming' | 'claim';
  isLoading: boolean;
  notification: string;
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
  error,
  buttonStage1,
  buttonStage2,
  buttonStage3,
  farmingStatus,
  isLoading,
  notification,
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
  const [updateMessage, setUpdateMessage] = useState(getRandomMessage());

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateMessage(getRandomMessage());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);

    // Check Telegram theme
    if (window.Telegram?.WebApp) {
      const isDark = window.Telegram.WebApp.colorScheme === 'dark';
      setIsDarkMode(isDark);

      // Add theme classes to body
      document.body.classList.toggle('dark-mode', isDark);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (farmingStatus === 'farming' && user?.startFarming) {
      const startTime = new Date(user.startFarming).getTime();
      const currentTime = new Date().getTime();
      const secondsElapsed = Math.floor((currentTime - startTime) / 1000);
      const progressPercentage = Math.min((secondsElapsed / 30) * 100, 100);
      const remainingSeconds = Math.max(30 - secondsElapsed, 0);

     // Update farming points as before
      setFarmingPoints(secondsElapsed);
      setCurrentNumber(secondsElapsed);

      // Update progress bar
      const buttonElement = document.querySelector('.farm-button') as HTMLElement;
      if (buttonElement) {
        buttonElement.style.setProperty('--progress-percentage', `${progressPercentage}%`);
      }

      interval = setInterval(() => {
        setIsSliding(true);
        setTimeout(() => {
          const newTime = new Date().getTime();
          const newSecondsElapsed = Math.floor((newTime - startTime) / 1000);
          const newProgressPercentage = Math.min((newSecondsElapsed / 30) * 100, 100);
           const newRemainingSeconds = Math.max(30 - newSecondsElapsed, 0);
          
          setFarmingPoints(prev => prev + 1);
          setCurrentNumber(prev => prev + 1);
          setIsSliding(false);
          
          // Update progress bar
          if (buttonElement) {
            buttonElement.style.setProperty('--progress-percentage', `${newProgressPercentage}%`);
          }
        }, 500);
      }, 1000);
    } else {
      setFarmingPoints(0);
      setCurrentNumber(0);

      // Reset progress bar
      const buttonElement = document.querySelector('.farm-button') as HTMLElement;
      if (buttonElement) {
        buttonElement.style.setProperty('--progress-percentage', '0%');
      }
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
          <p className={`update-text ${isDarkMode ? 'dark-mode' : ''}`}>
            {updateMessage}
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
               <span className="countdown-timer">
      {Math.max(30 - Math.floor((new Date().getTime() - new Date(user?.startFarming).getTime()) / 1000), 0)}s
    </span>
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
      <div className={footerContainerClass}>
        <Link href="/">
          <a className={activeFooterLinkClass}>
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
      </div>
    </div>
  );
}
