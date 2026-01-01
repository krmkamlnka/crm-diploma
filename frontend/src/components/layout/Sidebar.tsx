import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageSquare,
  CreditCard,
  UserPlus,
  Settings,
} from 'lucide-react'
import clsx from 'clsx'

export default function Sidebar() {
  const { user } = useAuthStore()
  const location = useLocation()

  const getNavItems = () => {
    if (!user) return []

    switch (user.role) {
      case 'super_admin':
      case 'admin':
        return [
          { icon: Home, label: 'Главная', path: '/admin' },
          { icon: UserPlus, label: 'Пригласить пользователя', path: '/admin/invite' },
          { icon: Users, label: 'Управление пользователями', path: '/admin/users' },
          { icon: CreditCard, label: 'Оплата', path: '/admin/payments' },
          { icon: Settings, label: 'Настройки', path: '/admin/settings' },
        ]

      case 'instructor':
        return [
          { icon: Home, label: 'Главная', path: '/instructor' },
          { icon: BookOpen, label: 'Курсы', path: '/instructor/courses' },
          { icon: Users, label: 'Студенты', path: '/instructor/students' },
          { icon: Calendar, label: 'Календарь', path: '/instructor/calendar' },
          { icon: Settings, label: 'Настройки', path: '/instructor/settings' },
        ]

      case 'student':
        return [
          { icon: Home, label: 'Главная', path: '/student' },
          { icon: Calendar, label: 'Календарь', path: '/student/calendar' },
          { icon: GraduationCap, label: 'Успеваемость', path: '/student/grades' },
          { icon: MessageSquare, label: 'AI Ассистент', path: '/student/ai-assistant' },
          { icon: CreditCard, label: 'Оплата', path: '/student/payments' },
          { icon: Settings, label: 'Настройки', path: '/student/settings' },
        ]

      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">CRM Система</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Учебный центр</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-primary-700 dark:text-primary-300 font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
