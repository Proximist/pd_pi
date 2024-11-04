'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { WebApp } from '@twa-dev/types'
import Script from 'next/script'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

// Add interface for invited user data
interface InvitedUserData {
  username: string;
  totalPisold: number;
}

export default function Invite() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [invitedUsers, setInvitedUsers] = useState<InvitedUserData[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      const isDark = tg.colorScheme === 'dark'
      setIsDarkMode(isDark)

      document.body.classList.toggle('dark:bg-gray-900', isDark)

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
              setInviteLink(`https://t.me/gimmexcbot/Hcisjid/start?startapp=${data.user.telegramId}`)
              // Convert invited users data to include totalPisold
              setInvitedUsers(data.invitedUsersData || data.user.invitedUsers.map((username: string) => ({
                username,
                totalPisold: 0
              })))
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

  const handleInvite = async () => {
    if (inviteLink) {
      try {
        await navigator.clipboard.writeText(inviteLink)
        setNotification('Invite link copied successfully!')
        setTimeout(() => setNotification(''), 3000)
      } catch (err) {
        setNotification('Failed to copy invite link')
        setTimeout(() => setNotification(''), 3000)
      }
    }
  }

  const darkModeClasses = isDarkMode ? 'dark' : ''

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${darkModeClasses} ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Script src="https://kit.fontawesome.com/18e66d329f.js" />
      
      <div className="min-h-screen">
        {/* Header */}
        <div className="w-full bg-[#670773] text-white p-4 shadow-lg flex items-center justify-between relative z-10">
          <Link href="/" className="hover:scale-110 transition-transform">
            <i className="fas fa-arrow-left text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-bold">Invite & Earn</h1>
          <div className="w-8"></div>
        </div>

        {error ? (
          <div className="flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-red-500 text-center">
              {error}
            </div>
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#670773] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-6">
            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6 transform transition-all duration-300">
              <div className="text-center mb-6">
                <i className="fas fa-gift text-5xl text-[#670773] dark:text-purple-400 mb-4"></i>
                <h2 className="text-2xl font-bold text-[#670773] dark:text-purple-400 mb-2">
                  Earn 2,500 Points
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  For each friend who joins using your invite link
                </p>
              </div>

              <button
                onClick={handleInvite}
                className="w-full bg-[#670773] hover:bg-[#7a1b86] text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 mb-6"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy Invite Link
              </button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[#670773] dark:text-purple-400">
                    {invitedUsers.length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Friends Invited</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[#670773] dark:text-purple-400">
                    {user?.totalCommission?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">Total Pi Commission</p>
                </div>
              </div>

              {/* Invited Friends List */}
               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <div className="flex items-center mb-4">
      <i className="fas fa-users text-[#670773] dark:text-purple-400 text-xl mr-2"></i>
      <h3 className="text-lg font-bold text-[#670773] dark:text-purple-400">
        Invited Friends
      </h3>
    </div>
    {invitedUsers.length > 0 ? (
      <div className="space-y-2">
        {invitedUsers.map((user, index) => (
          <div key={index} className="bg-white dark:bg-gray-600 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-user-circle text-[#670773] dark:text-purple-400 mr-3"></i>
              <span className="dark:text-gray-200">{user.username}</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#670773] dark:text-purple-400 font-medium mr-2">
                {(user.totalPisold * 0.1).toFixed(1)} Pi
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm opacity-70">
                + {(user.totalPisold * 0.025).toFixed(1)} Pi (2.5%)
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        <p>No friends invited yet</p>
      </div>
    )}
  </div>
            </div>

            {/* Invited By Section */}
            {user.invitedBy && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Invited by: <span className="font-bold text-[#670773] dark:text-purple-400">{user.invitedBy}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-[#670773] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {notification}
          </div>
        )}
      </div>
    </div>
  )
}
