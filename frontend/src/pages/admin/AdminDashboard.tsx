import { useEffect, useState } from 'react'
import { Users, UserPlus, GraduationCap, TrendingUp, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../../services/api'
import AnimatedStatCard from '../../components/common/AnimatedStatCard'
import AnimatedProgressBar from '../../components/common/AnimatedProgressBar'
import { StatCardSkeleton, ListItemSkeleton } from '../../components/common/Skeleton'
import { useAuthStore } from '../../context/authStore'

interface RecentUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  profilePhotoUrl?: string
}

interface DashboardData {
  totalUsers: number
  newRegistrationsThisMonth: number
  activeCourses: number
  growthPercent: number
  activeUsersPercent: number
  courseFillPercent: number
  paidInvoicesPercent: number
  recentRegistrations: RecentUser[]
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'STUDENT': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
    case 'INSTRUCTOR': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800'
    default: return 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-800'
  }
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    api.get<DashboardData>('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = data ? [
    { label: t('admin.dashboard.totalUsers'), value: String(data.totalUsers), icon: Users, bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400' },
    { label: t('admin.dashboard.newThisMonth'), value: String(data.newRegistrationsThisMonth), icon: UserPlus, bg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: t('admin.dashboard.totalCourses'), value: String(data.activeCourses), icon: GraduationCap, bg: 'bg-violet-50 dark:bg-violet-900/20', iconColor: 'text-violet-600 dark:text-violet-400' },
    { label: t('admin.dashboard.growth'), value: `${data.growthPercent}%`, icon: TrendingUp, bg: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-600 dark:text-orange-400' },
  ] : []

  const bars = data ? [
    { label: t('common.active'), value: data.activeUsersPercent, color: 'bg-emerald-500' },
    { label: t('common.courses'), value: data.courseFillPercent, color: 'bg-blue-500' },
    { label: t('common.payments'), value: data.paidInvoicesPercent, color: 'bg-violet-500' },
  ] : []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('common.goodMorning') : hour < 18 ? t('common.goodAfternoon') : t('common.goodEvening')

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl
                      bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600
                      p-6 text-white shadow-lg
                      animate-[fadeSlideDown_0.4s_ease_both]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-fuchsia-400/15 rounded-full blur-2xl translate-y-1/2" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-violet-100/80 text-sm font-medium mb-1">{greeting}</p>
            <h1 className="text-2xl font-bold leading-tight">
              {user ? `${user.firstName} ${user.lastName}` : t('admin.dashboard.title')}
            </h1>
            <p className="text-violet-100/70 text-sm mt-1">{t('admin.dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 shrink-0">
                <div className="flex items-center gap-1.5 justify-center mb-0.5">
                  <Users className="w-4 h-4 text-violet-200" />
                  <span className="text-xs text-violet-100/70 font-medium">{t('admin.dashboard.totalUsers')}</span>
                </div>
                <p className="text-3xl font-bold">{data.totalUsers}</p>
              </div>
            )}
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat, i) => <AnimatedStatCard key={stat.label} {...stat} delay={i * 80} />)
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent registrations */}
        <div className="card animate-[fadeSlideUp_0.5s_0.2s_ease_both] opacity-0 [animation-fill-mode:forwards]">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('admin.dashboard.recentRegistrations')}</h2>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <ListItemSkeleton key={i} />)}</div>
          ) : (
            <div className="space-y-2">
              {data?.recentRegistrations.map((user, i) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                      {user.profilePhotoUrl ? (
                        <img src={user.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                    {t(`roles.${user.role}`)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System activity */}
        <div className="card animate-[fadeSlideUp_0.5s_0.3s_ease_both] opacity-0 [animation-fill-mode:forwards]">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5">{t('admin.dashboard.systemActivity')}</h2>
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {bars.map((bar, i) => (
                <AnimatedProgressBar key={bar.label} {...bar} delay={i * 150} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
