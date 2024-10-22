import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toggleUpdateText } from './utils';
import './HomeUI.css';

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

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
    toggleUpdateText();
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
        <div className="header-container">
          <div className="dog-image-container">
            <img
              alt="Animated style dog image"
              className="dog-image"
              src="https://storage.googleapis.com/a1aa/image/YlpvEfbklKRiDi8LX5Rww5U3zZZwHEUfju1qUNknpEZ6e2OnA.jpg"
            />
          </div>
          <p id="pixelDogsCount" className="pixel-dogs-count">
            {user.points} PixelDogs
          </p>
          <p id="updateText" className="update-text fade fade-in">
            Exciting updates are on the way :)
          </p>
          <div className="tasks-container">
            <button className="tasks-button">Daily Tasks..!</button>
            <div className="social-container">
              <p className="social-text">Follow Our Youtube!</p>
              <button
                onClick={() => {
                  if (buttonStage1 === 'check') {
                    handleButtonClick1();
                  } else if (buttonStage1 === 'claim') {
                    handleClaim1();
                  }
                }}
                disabled={buttonStage1 === 'claimed' || isLoading}
                className={`claim-button ${buttonStage1 === 'claimed' || isLoading ? 'disabled' : ''}`}
              >
                {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
            <div className="social-container">
              <p className="social-text">Follow Our Twitter!</p>
              <button
                onClick={() => {
                  handleButtonClick2();
                  handleClaim2();
                }}
                disabled={buttonStage2 === 'claimed'}
                className="claim-button"
              >
                {buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
            <div className="social-container">
              <p className="social-text">Join Our Telegram!</p>
              <button
                onClick={() => {
                  handleButtonClick3();
                  handleClaim3();
                }}
                disabled={buttonStage3 === 'claimed'}
                className="claim-button"
              >
                {buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow"></div>
        <button
          className={`farm-button ${farmingStatus === 'farming' ? 'farming' : ''} ${isClaimAnimating ? 'claim-animating' : ''}`}
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
        {notification && <div className="notification-banner">{notification}</div>}
      </>
    );
  };

  return (
    <div className="home-container">
      {renderContent()}
      <section className="footer-container">
        <label className="label">
          <Link href="/">
            <input type="radio" name="nav" defaultChecked />
            <svg viewBox="0 0 24 24"><path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z"></path></svg>
          </Link>
        </label>
        <label className="label">
          <Link href="/invite">
            <input type="radio" name="nav" />
            <svg viewBox="0 0 24 24"><path d="M16.018 3.815 15.232 8h-4.966l.716-3.815-1.964-.37L8.232 8H4v2h3.857l-.751 4H3v2h3.731l-.714 3.805 1.965.369L8.766 16h4.966l-.714 3.805 1.965.369.783-4.174H20v-2h-3.859l.751-4H21V8h-3.733l.716-3.815-1.965-.37zM14.106 14H9.141l.751-4h4.966l-.752 4z"></path></svg>
          </Link>
        </label>
        <label className="label">
          <Link href="/task">
            <input type="radio" name="nav" />
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-7.933 13.481-3.774-3.774 1.414-1.414 2.36 2.36 5.586-5.586 1.414 1.414-7 7z"></path></svg>
          </Link>
        </label>
      </section>
    </div>
  );
}
