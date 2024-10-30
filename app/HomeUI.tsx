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
  isLoading1: boolean;
  isLoading2: boolean;
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

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const prevIntegerRef = useRef(Math.floor(value));
  const prevDecimalRef = useRef((value % 1).toFixed(1).substring(2));
  const [decimalKey, setDecimalKey] = useState(0);
  
  const integerPart = Math.floor(value);
  const decimalPart = (value % 1).toFixed(1).substring(2);
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    // Handle integer changes
    if (prevIntegerRef.current !== integerPart) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      prevIntegerRef.current = integerPart;
      return () => clearTimeout(timer);
    }
    
    // Handle decimal changes
    if (prevDecimalRef.current !== decimalPart) {
      setDecimalKey(prev => prev + 1);
      prevDecimalRef.current = decimalPart;
    }
  }, [integerPart, decimalPart]);

  return (
    <div className="number-container">
      <span className={`integer-part ${isPulsing ? 'pulse' : ''}`}>
        {integerPart}
      </span>
      <span className="decimal-separator">.</span>
      <div className="decimal-part-wrapper">
        <div 
          key={decimalKey}
          className="decimal-number"
        >
          {decimalPart}
        </div>
      </div>
    </div>
  );
};

export default function HomeUI({
  user,
  error,
  buttonStage1,
  buttonStage2,
  buttonStage3,
  farmingStatus,
  isLoading,
  isLoading1,
  isLoading2,
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
  const [isClaimAnimating, setIsClaimAnimating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(getRandomMessage());
  const [isTextFading, setIsTextFading] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextFading(true);
      setTimeout(() => {
        setUpdateMessage(getRandomMessage());
        setIsTextFading(false);
      }, 800);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);

    if (window.Telegram?.WebApp) {
      const isDark = window.Telegram.WebApp.colorScheme === 'dark';
      setIsDarkMode(isDark);
      document.body.classList.toggle('dark-mode', isDark);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (farmingStatus === 'farming' && user?.startFarming) {
      const startTime = new Date(user.startFarming).getTime();
      
      const updateFarmingProgress = () => {
        const currentTime = new Date().getTime();
        const actualSecondsElapsed = (currentTime - startTime) / 1000;
        
        // Calculate adjusted points to reach 350 in 1 hour
        const adjustedPoints = (actualSecondsElapsed / 3600) * 350;
        const roundedPoints = Math.min(Math.round(adjustedPoints * 10) / 10, 350);
        const progressPercentage = Math.min((actualSecondsElapsed / 3600) * 100, 100);
        
        setFarmingPoints(roundedPoints);

        // Update progress bar
        const buttonElement = document.querySelector('.farm-button') as HTMLElement;
        if (buttonElement) {
          buttonElement.style.setProperty('--progress-percentage', `${progressPercentage}%`);
        }
      };

      // Initial update
      updateFarmingProgress();
      
      interval = setInterval(updateFarmingProgress, 100); // More frequent updates for smoother animation
    } else {
      setFarmingPoints(0);
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

  const getRemainingTimeString = () => {
    if (!user?.startFarming) return '';
    
    const remainingTime = Math.max(3600 - Math.floor((new Date().getTime() - new Date(user.startFarming).getTime()) / 1000), 0);
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    if (hours > 0) return `${hours} hr ${minutes} min`;
    if (minutes > 0) return `${minutes} min`;
    return `${seconds}s`;
  };

  // Class names with dark mode
  const containerClass = `home-container ${isDarkMode ? 'dark-mode' : ''}`;
  const headerClass = `header-container ${isDarkMode ? 'dark-mode' : ''}`;
  const tasksClass = `tasks-container ${isDarkMode ? 'dark-mode' : ''}`;
  const socialClass = `social-container ${isDarkMode ? 'dark-mode' : ''}`;
  const footerContainerClass = `footerContainer ${isDarkMode ? 'dark-mode' : ''}`;
  const footerLinkClass = `footerLink ${isDarkMode ? 'dark-mode' : ''}`;
  const activeFooterLinkClass = `footerLink activeFooterLink ${isDarkMode ? 'dark-mode' : ''}`;
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
            {user.points.toLocaleString()} PixelDogs
          </p>
          <p className={`update-text ${isTextFading ? 'fade-out' : 'fade-in'} ${isDarkMode ? 'dark-mode' : ''}`}>
            {updateMessage}
          </p>
          <div className={tasksClass}>
            <button className={`tasks-button ${isDarkMode ? 'dark-mode' : ''}`}>Follow Our Socials..!</button>
            <div className={socialClass}>
              <p className={`social-text ${isDarkMode ? 'dark-mode' : ''}`}>Follow Our Youtube!</p>
              <button
                onClick={() => buttonStage1 === 'check' ? handleButtonClick1() : buttonStage1 === 'claim' ? handleClaim1() : null}
                disabled={buttonStage1 === 'claimed' || isLoading}
                className={`claim-button ${buttonStage1 === 'claimed' || isLoading ? 'disabled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              >
                {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
            <div className={socialClass}>
              <p className={`social-text ${isDarkMode ? 'dark-mode' : ''}`}>Follow Our Twitter!</p>
              <button
                onClick={() => buttonStage2 === 'check' ? handleButtonClick2() : buttonStage2 === 'claim' ? handleClaim2() : null}
                disabled={buttonStage2 === 'claimed' || isLoading1}
                className={`claim-button ${buttonStage2 === 'claimed' || isLoading1 ? 'disabled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              >
                {isLoading1 ? 'Claiming...' : buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
            <div className={socialClass}>
              <p className={`social-text ${isDarkMode ? 'dark-mode' : ''}`}>Join Our Telegram!</p>
              <button
                onClick={() => buttonStage3 === 'check' ? handleButtonClick3() : buttonStage3 === 'claim' ? handleClaim3() : null}
                disabled={buttonStage3 === 'claimed' || isLoading2}
                className={`claim-button ${buttonStage3 === 'claimed' || isLoading2 ? 'disabled' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              >
                {isLoading2 ? 'Claiming...' : buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
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
              <span className="farmingtext">Farming</span>
              <div className="farming-points">
                <AnimatedNumber value={farmingPoints} />
              </div>
              <span className="countdown-timer">
                {getRemainingTimeString()}
              </span>
            </>
          ) : (
            <span className="claimFarm">Claim Farm</span>
          )}
        </button>
        {notification && (
          <div className={`notification-banner ${isDarkMode ? 'dark-mode' : ''}`}>
            {notification}
          </div>
        )}
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
        <Link href="/timer">
          <a className={footerLinkClass}>
            <i className="fas fa-calendar"></i>
            <span>Event</span>
          </a>
        </Link>
      </div>
      </div>
  );
}
