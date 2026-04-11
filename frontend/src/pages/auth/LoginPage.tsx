import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import { useTranslation } from 'react-i18next'
import { Sparkles, Mail, Lock, ArrowRight, BookOpen, Users, TrendingUp, Bot } from 'lucide-react'

const FEATURES = [
  { icon: Users,      color: 'from-emerald-400 to-teal-500',  labelKey: 'Студенты' },
  { icon: BookOpen,   color: 'from-blue-400 to-primary-500',  labelKey: 'Курсы' },
  { icon: Bot,        color: 'from-violet-400 to-purple-500', labelKey: 'AI-репетитор' },
  { icon: TrendingUp, color: 'from-orange-400 to-amber-500',  labelKey: 'Аналитика' },
]

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  const navigate = useNavigate()
  const { login, isLoading, isAuthenticated } = useAuthStore()
  const { t } = useTranslation()

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t('auth.loginError'))
    }
  }

  const heroTags = t('auth.heroTags', { returnObjects: true }) as string[]

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#080d14] overflow-hidden">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-900" />
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '128px' }}
        />
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-2xl
                          flex items-center justify-center
                          shadow-[0_2px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Sparkles className="w-5 h-5 text-white drop-shadow" />
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-none">{t('sidebar.systemName')}</span>
            <p className="text-primary-200/70 text-xs mt-0.5">{t('sidebar.learningCenter')}</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5
                            bg-white/10 backdrop-blur-sm rounded-full
                            border border-white/20 text-white/80 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online Platform
            </div>
            <h1 className="text-[42px] font-bold text-white leading-[1.15] tracking-tight">
              {t('auth.heroTitle').split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 0 ? line : <span className="text-cyan-300">{line}</span>}
                </span>
              ))}
            </h1>
            <p className="text-primary-200/80 text-lg leading-relaxed max-w-md">
              {t('auth.heroSubtitle')}
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3
                           bg-white/8 hover:bg-white/12
                           backdrop-blur-sm rounded-xl
                           border border-white/10 hover:border-white/20
                           transition-all duration-200 group"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${f.color}
                                 rounded-lg flex items-center justify-center shadow-md
                                 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">
                  {heroTags[i] ?? f.labelKey}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decorative */}
        <div className="relative flex items-center gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1 rounded-full bg-white/20 flex-1`}>
              <div className={`h-full rounded-full bg-white/60 ${i === 0 ? 'w-full' : i === 1 ? 'w-2/3' : 'w-1/3'}`} />
            </div>
          ))}
          <span className="text-white/40 text-xs">v2.0</span>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background for right panel */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#080d14] dark:to-[#0d1520]" />
        <div className="absolute inset-0 opacity-30 dark:opacity-100"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl
                            flex items-center justify-center shadow-lg">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{t('sidebar.systemName')}</span>
          </div>

          {/* Form card */}
          <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl
                          rounded-3xl p-8
                          shadow-[0_20px_60px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.06)]
                          border border-white/60 dark:border-gray-700/50">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('auth.login')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('auth.loginSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20
                                text-red-600 dark:text-red-400
                                px-4 py-3 rounded-xl text-sm
                                border border-red-100 dark:border-red-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('auth.loginButton')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
                {t('auth.haveInvitation')}{' '}
                <Link
                  to="/register"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold transition-colors"
                >
                  {t('auth.registerLink')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
