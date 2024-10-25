'use client'

import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'
import TaskUI from './TaskUI'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')
  const [buttonStage4, setButtonStage4] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage5, setButtonStage5] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage6, setButtonStage6] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage7, setButtonStage7] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage8, setButtonStage8] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage9, setButtonStage9] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage10, setButtonStage10] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage11, setButtonStage11] = useState<'check' | 'claim' | 'claimed'>('check')
  const [isLoading4, setIsLoading4] = useState(false)
  const [isLoading5, setIsLoading5] = useState(false)
  const [isLoading6, setIsLoading6] = useState(false)
  const [isLoading7, setIsLoading7] = useState(false)
  const [isLoading8, setIsLoading8] = useState(false)
  const [isLoading9, setIsLoading9] = useState(false)
  const [isLoading10, setIsLoading10] = useState(false)
  const [isLoading11, setIsLoading11] = useState(false)

  useEffect(() => {
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
              setButtonStage4(data.user.claimedButton4 ? 'claimed' : 'check')
              setButtonStage5(data.user.claimedButton5 ? 'claimed' : 'check')
              setButtonStage6(data.user.claimedButton6 ? 'claimed' : 'check')
              setButtonStage7(data.user.claimedButton7 ? 'claimed' : 'check')
              setButtonStage8(data.user.claimedButton8 ? 'claimed' : 'check')
              setButtonStage9(data.user.claimedButton9 ? 'claimed' : 'check')
              setButtonStage10(data.user.claimedButton10 ? 'claimed' : 'check')
              setButtonStage11(data.user.claimedButton11 ? 'claimed' : 'check')
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

  const handleButtonClick4 = () => {
    if (buttonStage4 === 'check') {
      window.open('https://youtu.be/xvFZjo5PgG0', '_blank')
      setButtonStage4('claim')
    }
  }

  const handleButtonClick5 = () => {
    if (buttonStage5 === 'check') {
      window.open('https://twitter.com', '_blank')
      setButtonStage5('claim')
    }
  }

  const handleButtonClick6 = () => {
    if (buttonStage6 === 'check') {
      window.open('https://telegram.org', '_blank')
      setButtonStage6('claim')
    }
  }

  const handleButtonClick7 = () => {
    if (buttonStage7 === 'check') {
      window.open('https://discord.com', '_blank')
      setButtonStage7('claim')
    }
  }

  const handleButtonClick8 = () => {
    if (buttonStage8 === 'check') {
      window.open('https://tiktok.com', '_blank')
      setButtonStage8('claim')
    }
  }

  const handleButtonClick9 = () => {
    if (buttonStage9 === 'check') {
      window.open('https://t.me/blum/app?startapp=ref_Zur5QL0eWE', '_blank')
      setButtonStage9('claim')
    }
  }

  const handleButtonClick10 = () => {
    if (buttonStage10 === 'check') {
      window.open('https://t.me/major/start?startapp=1125596880', '_blank')
      setButtonStage10('claim')
    }
  }

  const handleButtonClick11 = () => {
    if (buttonStage11 === 'check') {
      window.open('https://t.me/Tomarket_ai_bot/app?startapp=0000Tdrx', '_blank')
      setButtonStage11('claim')
    }
  }

  const handleClaim4 = () => {
    if (buttonStage4 === 'claim') {
      setIsLoading4(true)
      handleIncreasePoints(100, 'button4')
      setTimeout(() => {
        setButtonStage4('claimed')
        setIsLoading4(false)
      }, 3000)
    }
  }

  const handleClaim5 = () => {
    if (buttonStage5 === 'claim') {
      setIsLoading5(true)
      handleIncreasePoints(150, 'button5')
      setTimeout(() => {
      setButtonStage5('claimed')
      setIsLoading5(false)
    }, 3000)
  }
}

  const handleClaim6 = () => {
    if (buttonStage6 === 'claim') {
      setIsLoading6(true)
      handleIncreasePoints(300, 'button6')
      setTimeout(() => {
      setButtonStage6('claimed')
      setIsLoading6(false)
    }, 3000)
  }
}
  const handleClaim7 = () => {
    if (buttonStage7 === 'claim') {
      setIsLoading7(true)
      handleIncreasePoints(150, 'button7')
      setTimeout(() => {
        setButtonStage7('claimed')
        setIsLoading7(false)
      }, 3000)
    }
  }

  const handleClaim8 = () => {
    if (buttonStage8 === 'claim') {
      setIsLoading8(true)
      handleIncreasePoints(150, 'button8')
      setTimeout(() => {
        setButtonStage8('claimed')
        setIsLoading8(false)
      }, 3000)
    }
  }

  const handleClaim9 = () => {
    if (buttonStage9 === 'claim') {
      setIsLoading9(true)
      handleIncreasePoints(150, 'button9')
      setTimeout(() => {
        setButtonStage9('claimed')
        setIsLoading9(false)
      }, 3000)
    }
  }

  const handleClaim10 = () => {
    if (buttonStage10 === 'claim') {
      setIsLoading10(true)
      handleIncreasePoints(150, 'button10')
      setTimeout(() => {
        setButtonStage10('claimed')
        setIsLoading10(false)
      }, 3000)
    }
  }

  const handleClaim11 = () => {
    if (buttonStage11 === 'claim') {
      setIsLoading11(true)
      handleIncreasePoints(150, 'button11')
      setTimeout(() => {
        setButtonStage11('claimed')
        setIsLoading11(false)
      }, 3000)
    }
  }

  return (
    <TaskUI 
      user={user}
      error={error}
      buttonStage4={buttonStage4}
      buttonStage5={buttonStage5}
      buttonStage6={buttonStage6}
      buttonStage7={buttonStage7}
      buttonStage8={buttonStage8}
      buttonStage9={buttonStage9}
      buttonStage10={buttonStage10}
      buttonStage11={buttonStage11}
      isLoading4={isLoading4}
      isLoading5={isLoading5}
      isLoading6={isLoading6}
      isLoading7={isLoading7}
      isLoading8={isLoading8}
      isLoading9={isLoading9}
      isLoading10={isLoading10}
      isLoading11={isLoading11}
      notification={notification}
      handleButtonClick4={handleButtonClick4}
      handleButtonClick5={handleButtonClick5}
      handleButtonClick6={handleButtonClick6}
      handleButtonClick7={handleButtonClick7}
      handleButtonClick8={handleButtonClick8}
      handleButtonClick9={handleButtonClick9}
      handleButtonClick10={handleButtonClick10}
      handleButtonClick11={handleButtonClick11}
      handleClaim4={handleClaim4}
      handleClaim5={handleClaim5}
      handleClaim6={handleClaim6}
      handleClaim7={handleClaim7}
      handleClaim8={handleClaim8}
      handleClaim9={handleClaim9}
      handleClaim10={handleClaim10}
      handleClaim11={handleClaim11}
    />
  )
}
