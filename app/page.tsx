'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'
import HomeUI from './HomeUI'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [inviterInfo, setInviterInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')
  const [buttonStage1, setButtonStage1] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage2, setButtonStage2] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage3, setButtonStage3] = useState<'check' | 'claim' | 'claimed'>('check')
  const [farmingStatus, setFarmingStatus] = useState<'farm' | 'farming' | 'claim'>('farm')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading1, setIsLoading1] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  // Add these new handlers after existing handlers:
  const handleMenuItemClick = (item: string) => {
      if (item === 'Live Support') {
        window.location.href = '/LiveSupport.html'
      } else if (item === 'Home') {
        window.location.href = '/'
      } else if (item === 'Transaction History') {
        window.location.href = './transaction-history'
      } else if (item === 'Profile') {
        window.location.href = './profile'
      } else if  (item === 'Invite & Earn') {
        window.location.href = './invite'
      }
      setMenuOpen(false)
    }

  const handleBuyPi = () => {
  setShowNotification(true)
  setTimeout(() => setShowNotification(false), 3000)
  }

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...initDataUnsafe.user, start_param: initDataUnsafe.start_param || null })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data.user)
              setInviterInfo(data.inviterInfo)
              setButtonStage1(data.user.claimedButton1 ? 'claimed' : 'check')
              setButtonStage2(data.user.claimedButton2 ? 'claimed' : 'check')
              setButtonStage3(data.user.claimedButton3 ? 'claimed' : 'check')
              checkFarmingStatus(data.user)
              setShowIntro(!data.introSeen) // Add this line
            }
          })
          .catch(() => {
            setError('Failed to fetch user data')
          })
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])

  useEffect(() => {
    const updateOnlineStatus = () => {
      if (user) {
        fetch('/api/update-online-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: user.telegramId, isOnline: true }),
        })
      }
    }

    const interval = setInterval(updateOnlineStatus, 5000) // Update every minute

    return () => {
      clearInterval(interval)
      if (user) {
        fetch('/api/update-online-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ telegramId: user.telegramId, isOnline: false }),
        })
      }
    }
  }, [user])

  const checkFarmingStatus = (userData: any) => {
    if (userData.startFarming) {
      const now = new Date()
      const startTime = new Date(userData.startFarming)
      const timeDiff = now.getTime() - startTime.getTime()
      if (timeDiff < 60 * 60 * 1000) { // Less than 60 seconds
        setFarmingStatus('farming')
        setTimeout(() => setFarmingStatus('claim'), 60 * 60 * 1000 - timeDiff) // 60 minutes
      } else {
        setFarmingStatus('claim')
      }
    } else {
      setFarmingStatus('farm')
    }
  }

  const handleIncreasePoints = async (pointsToAdd: number, buttonId: string) => {
    if (!user) return

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId, pointsToAdd, buttonId }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user, points: data.points })
        setNotification(`Points increased successfully! (+${pointsToAdd})`)
        setTimeout(() => setNotification(''), 3000)
      } else {
        setError('Failed to increase points')
      }
    } catch {
      setError('An error occurred while increasing points')
    }
  }

  const handleFarmClick = async () => {
  if (!user) return

  if (farmingStatus === 'farm') {
    try {
      const res = await fetch('/api/start-farming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId }),
      })
      const data = await res.json()
      if (data.success) {
        // Update the local user state with new startFarming timestamp
        setUser({ ...user, startFarming: new Date().toISOString() })
        setFarmingStatus('farming')
        setTimeout(() => setFarmingStatus('claim'), 60 * 60 * 1000) // 60 minutes
      }
    } catch (error) {
      console.error('Error starting farming:', error)
    }
  } else if (farmingStatus === 'claim') {
    handleIncreasePoints(350, 'farmButton')
    setTimeout(() => {
      setFarmingStatus('farm')
    }, 600)
  }
}

  const handleButtonClick1 = () => {
    if (buttonStage1 === 'check') {
      window.open('https://www.youtube.com/@PixelDogsCoin', '_blank')
      setButtonStage1('claim')
    }
  }

  const handleButtonClick2 = () => {
    if (buttonStage2 === 'check') {
      window.open('https://x.com/PixelDogs74328?t=0nP0JfU8kA8upUBSeDoNbg&s=09', '_blank')
      setButtonStage2('claim')
    }
  }

  const handleButtonClick3 = () => {
    if (buttonStage3 === 'check') {
      window.open('https://t.me/pixel_dogs_x', '_blank')
      setButtonStage3('claim')
    }
  }

  const handleClaim1 = () => {
    if (buttonStage1 === 'claim') {
      setIsLoading(true)
      handleIncreasePoints(300, 'button1')
      setTimeout(() => {
        setButtonStage1('claimed')
        setIsLoading(false)
      }, 3000)
    }
  }

  const handleClaim2 = () => {
    if (buttonStage2 === 'claim') {
      setIsLoading1(true)
      handleIncreasePoints(300, 'button2')
      setTimeout(() => {
      setButtonStage2('claimed')
      setIsLoading1(false)
      }, 3000)
    }
  }

  const handleClaim3 = () => {
    if (buttonStage3 === 'claim') {
      setIsLoading2(true)
      handleIncreasePoints(300, 'button3')
      setTimeout(() => {
      setButtonStage3('claimed')
      setIsLoading2(false)
      }, 3000)
    }
  }

  return (
    <HomeUI 
      user={user}
      buttonStage1={buttonStage1}
      buttonStage2={buttonStage2}
      buttonStage3={buttonStage3}
      farmingStatus={farmingStatus}
      isLoading={isLoading}
      isLoading1={isLoading1}
      isLoading2={isLoading2}
      notification={notification}
      error={error}
      isInitialLoading={!user}
      handleButtonClick1={handleButtonClick1}
      handleButtonClick2={handleButtonClick2}
      handleButtonClick3={handleButtonClick3}
      handleClaim1={handleClaim1}
      handleClaim2={handleClaim2}
      handleClaim3={handleClaim3}
      handleFarmClick={handleFarmClick}
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      showIntro={showIntro}
      showNotification={showNotification}
      mounted={mounted}
      handleMenuItemClick={handleMenuItemClick}
      handleBuyPi={handleBuyPi}
    />
  )
}
