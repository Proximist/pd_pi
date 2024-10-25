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
  const [buttonStage1, setButtonStage1] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage2, setButtonStage2] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage3, setButtonStage3] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage7, setButtonStage7] = useState<'check' | 'claim' | 'claimed'>('check')
  const [buttonStage8, setButtonStage8] = useState<'check' | 'claim' | 'claimed'>('check')
  const [isLoading4, setIsLoading4] = useState(false)
  const [isLoading5, setIsLoading5] = useState(false)
  const [isLoading6, setIsLoading6] = useState(false)
  const [isLoading7, setIsLoading7] = useState(false)
  const [isLoading8, setIsLoading8] = useState(false)

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
              setButtonStage1(data.user.claimedButton4 ? 'claimed' : 'check')
              setButtonStage2(data.user.claimedButton5 ? 'claimed' : 'check')
              setButtonStage3(data.user.claimedButton6 ? 'claimed' : 'check')
              setButtonStage7(data.user.claimedButton7 ? 'claimed' : 'check')
              setButtonStage8(data.user.claimedButton8 ? 'claimed' : 'check')
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
    if (buttonStage1 === 'check') {
      window.open('https://youtu.be/xvFZjo5PgG0', '_blank')
      setButtonStage1('claim')
    }
  }

  const handleButtonClick5 = () => {
    if (buttonStage2 === 'check') {
      window.open('https://twitter.com', '_blank')
      setButtonStage2('claim')
    }
  }

  const handleButtonClick6 = () => {
    if (buttonStage3 === 'check') {
      window.open('https://telegram.org', '_blank')
      setButtonStage3('claim')
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

  const handleClaim4 = () => {
    if (buttonStage1 === 'claim') {
      setIsLoading4(true)
      handleIncreasePoints(100, 'button4')
      setTimeout(() => {
        setButtonStage1('claimed')
        setIsLoading4(false)
      }, 3000)
    }
  }

  const handleClaim5 = () => {
    if (buttonStage2 === 'claim') {
      setIsLoading5(true)
      handleIncreasePoints(150, 'button5')
      setTimeout(() => {
      setButtonStage2('claimed')
      setIsLoading5(false)
    }, 3000)
  }
}

  const handleClaim6 = () => {
    if (buttonStage3 === 'claim') {
      setIsLoading6(true)
      handleIncreasePoints(300, 'button6')
      setTimeout(() => {
      setButtonStage3('claimed')
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

  return (
    <TaskUI 
      user={user}
      error={error}
      buttonStage1={buttonStage1}
      buttonStage2={buttonStage2}
      buttonStage3={buttonStage3}
      buttonStage7={buttonStage7}
      buttonStage8={buttonStage8}
      isLoading4={isLoading4}
      isLoading5={isLoading5}
      isLoading6={isLoading6}
      isLoading7={isLoading7}
      isLoading8={isLoading8}
      notification={notification}
      handleButtonClick4={handleButtonClick4}
      handleButtonClick5={handleButtonClick5}
      handleButtonClick6={handleButtonClick6}
      handleButtonClick7={handleButtonClick7}
      handleButtonClick8={handleButtonClick8}
      handleClaim4={handleClaim4}
      handleClaim5={handleClaim5}
      handleClaim6={handleClaim6}
      handleClaim7={handleClaim7}
      handleClaim8={handleClaim8}
    />
  )
}
