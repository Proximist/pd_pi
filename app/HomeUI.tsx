import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { getRandomMessage } from './updateTextUtils';
import IntroPage from './components/IntroPage';

interface MergedHomeUIProps {
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
    if (prevIntegerRef.current !== integerPart) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      prevIntegerRef.current = integerPart;
      return () => clearTimeout(timer);
    }
    
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
        <div key={decimalKey} className="decimal-number">
          {decimalPart}
        </div>
      </div>
    </div>
  );
};

export default function MergedHomeUI({
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
}: MergedHomeUIProps) {
  const [farmingPoints, setFarmingPoints] = useState(0);
  const [isClaimAnimating, setIsClaimAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(getRandomMessage());
  const [isTextFading, setIsTextFading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (farmingStatus === 'farming' && user?.startFarming) {
      const startTime = new Date(user.startFarming).getTime();
      
      const updateFarmingProgress = () => {
        const currentTime = new Date().getTime();
        const actualSecondsElapsed = (currentTime - startTime) / 1000;
        const adjustedPoints = (actualSecondsElapsed / 3600) * 350;
        const roundedPoints = Math.min(Math.round(adjustedPoints * 10) / 10, 350);
        const progressPercentage = Math.min((actualSecondsElapsed / 3600) * 100, 100);
        
        setFarmingPoints(roundedPoints);

        const buttonElement = document.querySelector('.farm-button') as HTMLElement;
        if (buttonElement) {
          buttonElement.style.setProperty('--progress-percentage', `${progressPercentage}%`);
        }
      };

      updateFarmingProgress();
      interval = setInterval(updateFarmingProgress, 100);
    } else {
      setFarmingPoints(0);
      const buttonElement = document.querySelector('.farm-button') as HTMLElement;
      if (buttonElement) {
        buttonElement.style.setProperty('--progress-percentage', '0%');
      }
    }
    return () => clearInterval(interval);
  }, [farmingStatus, user?.startFarming]);

  const handleMenuItemClick = (item: string) => {
    if (item === 'Live Support') {
      window.location.href = '/LiveSupport.html';
    } else if (item === 'Home') {
      window.location.href = '/';
    } else if (item === 'Transaction History') {
      window.location.href = './transaction-history';
    } else if (item === 'Profile') {
      window.location.href = './profile';
    }
    setMenuOpen(false);
  };

  const handleBuyPi = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-red-500 text-center">
          {error}
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ${mounted ? 'fade-in' : ''}`}>
      <Script src="https://kit.fontawesome.com/18e66d329f.js" />
      
      {/* Header */}
      <div className="w-full bg-[#670773] text-white p-4 shadow-lg flex items-center justify-between relative z-10 slide-down">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:scale-110 transition-transform"
        >
          <i className="fas fa-bars text-2xl"></i>
        </button>
        <h1 className="text-2xl font-bold">PixelDogs</h1>
        <div className="w-8"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 text-center fade-in-up">
          <p className="text-sm font-medium">
            {updateMessage}
          </p>
        </div>

        <div className="text-center mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md mb-4">
            <h2 className="text-4xl font-bold text-[#670773]">
              {user?.points.toLocaleString()} PixelDogs
            </h2>
          </div>

          <div className="relative w-48 h-48 mx-auto mb-6 scale-in">
            <img 
              src="https://i.imgur.com/F13Hj7a.jpeg"
              alt="PixelDogs Logo" 
              className="w-full h-full object-cover rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Social Tasks Section */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6">
            <h3 className="text-xl font-bold text-[#670773] mb-4">Follow Our Socials</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Follow Our Youtube!</span>
                <button
                  onClick={() => buttonStage1 === 'check' ? handleButtonClick1() : buttonStage1 === 'claim' ? handleClaim1() : null}
                  disabled={buttonStage1 === 'claimed' || isLoading}
                  className="bg-[#670773] text-white px-4 py-2 rounded-full disabled:opacity-50"
                >
                  {isLoading ? 'Claiming...' : buttonStage1 === 'check' ? 'Check' : buttonStage1 === 'claim' ? 'Claim' : 'Claimed'}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Follow Our Twitter!</span>
                <button
                  onClick={() => buttonStage2 === 'check' ? handleButtonClick2() : buttonStage2 === 'claim' ? handleClaim2() : null}
                  disabled={buttonStage2 === 'claimed' || isLoading1}
                  className="bg-[#670773] text-white px-4 py-2 rounded-full disabled:opacity-50"
                >
                  {isLoading1 ? 'Claiming...' : buttonStage2 === 'check' ? 'Check' : buttonStage2 === 'claim' ? 'Claim' : 'Claimed'}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Join Our Telegram!</span>
                <button
                  onClick={() => buttonStage3 === 'check' ? handleButtonClick3() : buttonStage3 === 'claim' ? handleClaim3() : null}
                  disabled={buttonStage3 === 'claimed' || isLoading2}
                  className="bg-[#670773] text-white px-4 py-2 rounded-full disabled:opacity-50"
                >
                  {isLoading2 ? 'Claiming...' : buttonStage3 === 'check' ? 'Check' : buttonStage3 === 'claim' ? 'Claim' : 'Claimed'}
                </button>
              </div>
            </div>
          </div>

          {/* Farming Button */}
          <button
            className={`w-full bg-[#670773] text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#7a1b86] transform hover:scale-105 transition-all duration-300 active:scale-95 ${
              farmingStatus === 'farming' ? 'farming' : ''
            } ${isClaimAnimating ? 'claim-animating' : ''}`}
            onClick={farmingStatus === 'claim' ? () => {
              setIsClaimAnimating(true);
              handleFarmClick();
              setTimeout(() => setIsClaimAnimating(false), 1000);
            } : handleFarmClick}
            disabled={farmingStatus === 'farming' || isClaimAnimating}
          >
            {farmingStatus === 'farm' ? (
              <span>Farm PixelDogs</span>
            ) : farmingStatus === 'farming' ? (
              <>
                <span>Farming</span>
                <div className="farming-points">
                  <AnimatedNumber value={farmingPoints} />
                </div>
              </>
            ) : (
              <span>Claim Farm</span>
            )}
          </button>
        </div>
      </div>

      {/* Sliding Menu */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#670773] text-white shadow-2xl transform transition-transform duration-300 z-50 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-white/20">
          <button 
            onClick={() => setMenuOpen(false)} 
            className="absolute top-4 right-4 text-white hover:scale-110 transition-transform"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
          <h2 className="text-xl font-bold mt-8">Menu</h2>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            {['Home', 'Transaction History', 'Live Support', 'Profile'].map((item, index) => (
              <li key={index} className="menu-item" style={{animationDelay: `${index * 0.1}s`}}>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuItemClick(item);
                  }}
                  className="block py-3 px-6 hover:bg-white/10 transition-colors duration-300"
                >
                  <i className={`fas fa-${
                    item === 'Home' ? 'home' :
                    item === 'Transaction History' ? 'history' :
                    item === 'Live Support' ? 'headset' :
                    'user'
                  } mr-3`}></i>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#670773] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      <style jsx>{`
        .loading-spinner {
          border: 4px solid rgba(103, 7, 115, 0.1);
          border-left-color: #670773;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .slide-down {
          transform: translateY(-100%);
          animation: slideDown 0.5s ease-out forwards;
        }
        .slide-up {
          opacity: 0;
          transform: translateY(50px);
          animation: slideUp 0.5s ease-out forwards;
        }
        .scale-in {
          opacity: 0;
          transform: scale(0.8);
          animation: scaleIn 0.5s ease-out forwards;
        }
        .menu-item {
          opacity: 0;
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          to { transform: translateY(0); }
        }
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
