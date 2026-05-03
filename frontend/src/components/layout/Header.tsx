import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import { useThemeStore } from '../../context/themeStore'
import { useTranslation } from 'react-i18next'
import { Bell, LogOut, Menu, Moon, Sun } from 'lucide-react'
import NotificationPanel, { type Notification } from '../common/NotificationPanel'
import api from '../../services/api'

interface Props {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: Props) {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const getSettingsPath = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':      return '/admin/settings'
      case 'INSTRUCTOR': return '/instructor/settings'
      case 'STUDENT':    return '/student/settings'
      default:           return '/'
    }
  }
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  // Кешируем уведомления на уровне Header — панель не теряет состояние при закрытии/открытии
  const [cachedNotifications, setCachedNotifications] = useState<Notification[] | null>(null)

  const dateLocale = i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-RU'

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get<{ count: number }>('/notifications/unread-count')
      setUnreadCount(res.data.count)
    } catch {
      // non-critical
    }
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  const handleOpenNotifications = () => {
    setShowNotifications(v => !v)
  }

  return (
    <header className="relative z-10
                        bg-white/70 dark:bg-gray-900/60
                        backdrop-blur-xl
                        border-b border-gray-100/80 dark:border-gray-800/60
                        px-6 py-3.5
                        shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        {/* Left: hamburger (mobile) + greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-400 dark:text-gray-500
                       hover:bg-gray-100/80 dark:hover:bg-white/[0.06]
                       hover:text-gray-700 dark:hover:text-gray-300
                       transition-all duration-200 shrink-0"
          >
            <Menu size={19} />
          </button>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 truncate">
              {t('common.welcomeBack')}{' '}
              <span className="text-gradient font-bold">{user?.firstName}</span>
              <span className="text-gray-900 dark:text-gray-100">!</span>
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize hidden sm:block">
              {new Date().toLocaleDateString(dateLocale, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? t('common.darkTheme') : t('common.lightTheme')}
            className="relative p-2 rounded-xl text-gray-400 dark:text-gray-500
                       hover:bg-gray-100/80 dark:hover:bg-white/[0.06]
                       hover:text-gray-700 dark:hover:text-gray-300
                       transition-all duration-200"
          >
            <div className="transition-transform duration-300" style={{ transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              {theme === 'light'
                ? <Sun size={17} />
                : <Moon size={17} />
              }
            </div>
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={handleOpenNotifications}
              title={t('common.notifications')}
              className={`relative p-2 rounded-xl transition-all duration-200 ${
                showNotifications
                  ? 'bg-primary-100 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100/80 dark:hover:bg-white/[0.06] hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50 animate-ping" />
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900 leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationPanel
                onClose={() => setShowNotifications(false)}
                onUnreadCountChange={setUnreadCount}
                cachedNotifications={cachedNotifications}
                onNotificationsLoaded={setCachedNotifications}
              />
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700/60 mx-1" />

          {/* User avatar + logout */}
          <div className="flex items-center gap-2 pl-1">
            <button
              onClick={() => navigate(getSettingsPath())}
              title={t('nav.settings')}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600
                          flex items-center justify-center overflow-hidden shadow-sm ring-2
                          ring-primary-200/50 dark:ring-primary-900/50 shrink-0
                          hover:ring-primary-400/60 dark:hover:ring-primary-600/60
                          transition-all duration-200"
            >
              {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-xs">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-500 dark:text-gray-400
                         hover:text-red-500 dark:hover:text-red-400
                         hover:bg-red-50 dark:hover:bg-red-500/10
                         rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
