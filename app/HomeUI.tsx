import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import IntroPage from './components/IntroPage';
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
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  showNotification: boolean;
  mounted: boolean;
  handleMenuItemClick: (item: string) => void;
  handleBuyPi: () => void;
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
  menuOpen,
  setMenuOpen,
  showNotification,
  mounted,
  handleMenuItemClick,
  handleBuyPi,
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

    return (
      <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ${mounted ? 'fade-in' : ''}`}>
        <Script src="https://kit.fontawesome.com/18e66d329f.js"/>
        {/* Header */}
        <div className="w-full bg-[#670773] text-white p-4 shadow-lg flex items-center justify-between relative z-10 slide-down">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:scale-110 transition-transform"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
          <h1 className="text-2xl font-bold">Pi Trader Official</h1>
          <div className="w-8"></div>
        </div>
    
        {/* Keep the existing notification component but add the new Pi notification */}
        {showNotification && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#670773] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            This feature will be available soon
          </div>
        )}
    
        {/* Main content container */}
        <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 text-center fade-in-up">
          <p className="text-[#670773] text-sm font-medium">
            Pi Coin has not launched. This is the premarket price set by our team and does not represent Official data
          </p>
        </div>

        <div className="text-center mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md mb-4">
            <h2 className="text-4xl font-bold text-[#670773]">
              ~$0.41/Pi
            </h2>
          </div>

          <div className="relative w-48 h-48 mx-auto mb-6 scale-in">
            <img 
              src="https://i.imgur.com/2E3jTAp.png" 
              alt="Pi Coin" 
              className="w-full h-full object-cover rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col gap-3 items-center slide-up">
            <Link href="/PaymentMethods" className="w-full max-w-xs">
              <button className="w-full bg-[#670773] text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#7a1b86] transform hover:scale-105 transition-all duration-300 active:scale-95">
                Sell Your Pi
              </button>
            </Link>
            <button 
              onClick={handleBuyPi}
              className="w-full max-w-xs bg-white text-[#670773] text-lg font-bold py-3 px-6 rounded-full shadow-lg border-2 border-[#670773] hover:bg-[#670773] hover:text-white transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Buy Pi
            </button>
          </div>
        </div>
        </div>
        {/* Add the sliding menu */}
        <div className={`fixed top-0 left-0 h-full w-72 bg-[#670773] text-white shadow-2xl transform transition-transform duration-300 z-50 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                    e.preventDefault()
                    handleMenuItemClick(item)
                  }}
                  className="block py-3 px-6 hover:bg-white/10 transition-colors duration-300"
                >
                  <i className={`fas fa-${
                    item === 'Home' ? 'home' :
                    item === 'Transaction History' ? 'history' :
                    item === 'Live Support' ? 'headset' :
                    item === 'Profile' ? 'user' :
                    item === 'Invite & Earn' ? 'gift' :
                    'tools'
                  } mr-3`}></i>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        </div>
      </div>
    );
}
