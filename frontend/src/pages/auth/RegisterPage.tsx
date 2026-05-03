import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import { authService } from '../../services/authService'
import { useTranslation } from 'react-i18next'
import {
  Sparkles, Mail, Lock, User, Phone, ArrowRight,
  ShieldCheck, KeyRound, CheckCircle2,
} from 'lucide-react'
import axios from 'axios'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    invitationToken: '',
  })
  const [error, setError]                   = useState('')
  const [step, setStep]                     = useState<'register' | 'verify'>('register')
  const [verificationCode, setVerificationCode] = useState('')
  const [submitLoading, setSubmitLoading]   = useState(false)
  const [verifyLoading, setVerifyLoading]   = useState(false)

  const navigate = useNavigate()
  const { register, setUser } = useAuthStore()
  const { t } = useTranslation()

  // Cursor glow
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const glowRef       = useRef<HTMLDivElement>(null)

  // Left panel parallax blobs
  const leftPanelRef  = useRef<HTMLDivElement>(null)
  const blob1Ref      = useRef<HTMLDivElement>(null)
  const blob2Ref      = useRef<HTMLDivElement>(null)
  const blob3Ref      = useRef<HTMLDivElement>(null)

  const handleLeftMouseMove = useCallback((e: MouseEvent) => {
    const panel = leftPanelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    const rx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
    const ry = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    if (blob1Ref.current)
      blob1Ref.current.style.transform = `translate(calc(-50% + ${rx * -28}px), calc(-50% + ${ry * -28}px))`
    if (blob2Ref.current)
      blob2Ref.current.style.transform = `translate(calc(33% + ${rx * 20}px), calc(33% + ${ry * 20}px))`
    if (blob3Ref.current)
      blob3Ref.current.style.transform = `translate(calc(-50% + ${rx * 14}px), calc(-50% + ${ry * 14}px))`
  }, [])

  const handleRightMouseMove = useCallback((e: MouseEvent) => {
    const panel = rightPanelRef.current
    const glow  = glowRef.current
    if (!panel || !glow) return
    const rect = panel.getBoundingClientRect()
    glow.style.left    = `${e.clientX - rect.left}px`
    glow.style.top     = `${e.clientY - rect.top}px`
    glow.style.opacity = '1'
  }, [])

  const handleRightMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [])

  useEffect(() => {
    const lp = leftPanelRef.current
    const rp = rightPanelRef.current
    lp?.addEventListener('mousemove', handleLeftMouseMove)
    rp?.addEventListener('mousemove', handleRightMouseMove)
    rp?.addEventListener('mouseleave', handleRightMouseLeave)
    return () => {
      lp?.removeEventListener('mousemove', handleLeftMouseMove)
      rp?.removeEventListener('mousemove', handleRightMouseMove)
      rp?.removeEventListener('mouseleave', handleRightMouseLeave)
    }
  }, [handleLeftMouseMove, handleRightMouseMove, handleRightMouseLeave])

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (!tokenFromUrl) return
    setFormData(prev => ({ ...prev, invitationToken: tokenFromUrl }))
    axios.get(`/api/v1/invitations/by-token/${tokenFromUrl}`)
      .then(res => {
        if (res.data.email) setFormData(prev => ({ ...prev, email: res.data.email }))
      })
      .catch(() => {})
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      setSubmitLoading(false)
      return
    }
    if (formData.password.length < 8) {
      setError(t('auth.passwordTooShort'))
      setSubmitLoading(false)
      return
    }
    const hasUppercase = /[A-Z]/.test(formData.password)
    const hasLowercase = /[a-z]/.test(formData.password)
    const hasDigit     = /\d/.test(formData.password)
    const hasSpecial   = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecial) {
      setError(t('auth.passwordTooWeak'))
      setSubmitLoading(false)
      return
    }

    try {
      await register({
        email:           formData.email,
        password:        formData.password,
        firstName:       formData.firstName,
        lastName:        formData.lastName,
        phone:           formData.phone || undefined,
        invitationToken: formData.invitationToken || undefined,
      })
      setStep('verify')
    } catch (err: any) {
      const data = err.response?.data
      setError(
        data?.validationErrors
          ? Object.values(data.validationErrors).join(', ')
          : data?.message || t('auth.registerError')
      )
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setVerifyLoading(true)
    try {
      const response = await authService.verifyEmail(formData.email, verificationCode)
      setUser(response.user)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.verificationError'))
    } finally {
      setVerifyLoading(false)
    }
  }

  // ── Verify step ──
  if (step === 'verify') {
    return (
      <div className="min-h-screen flex bg-gray-50 overflow-hidden">
        {/* Left panel */}
        <div
          ref={leftPanelRef}
          className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center p-12 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-900" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '128px' }} />
          <div ref={blob1Ref} className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-white/8 rounded-full blur-3xl transition-transform duration-75 ease-out"
            style={{ transform: 'translate(-50%, -50%)' }} />
          <div ref={blob2Ref} className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl transition-transform duration-75 ease-out"
            style={{ transform: 'translate(33%, 33%)' }} />
          <div ref={blob3Ref} className="absolute top-1/4 left-1/2 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl transition-transform duration-75 ease-out"
            style={{ transform: 'translate(-50%, -50%)' }} />
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative text-center space-y-6 max-w-sm">
            <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center
                            shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">{t('auth.emailVerification')}</h2>
            <p className="text-primary-200/80 text-lg leading-relaxed">
              {t('auth.verificationCodeSent')}{' '}
              <span className="font-semibold text-cyan-300">{formData.email}</span>
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white/70 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Проверьте папку «Спам», если письмо не пришло
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div
          ref={rightPanelRef}
          className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div
            ref={glowRef}
            className="pointer-events-none absolute w-[420px] h-[420px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s ease' }}
          />

          <div className="relative w-full max-w-[380px]">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8
                            shadow-[0_20px_60px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.06)]
                            border border-white/60">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-2xl mb-4 shadow-sm">
                  <Mail className="w-7 h-7 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('auth.emailVerification')}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {t('auth.verificationCodeSent')}{' '}
                  <span className="font-medium text-gray-700">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.verificationCode')}
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    className="input-field text-center text-3xl tracking-[0.5em] font-bold"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="btn-primary w-full py-3"
                >
                  {verifyLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.verifyButton')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => setStep('register')}
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    {t('common.back')}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Register step ──
  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">

      {/* ── Left panel ── */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-900" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '128px' }} />
        <div ref={blob1Ref} className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-white/8 rounded-full blur-3xl transition-transform duration-75 ease-out"
          style={{ transform: 'translate(-50%, -50%)' }} />
        <div ref={blob2Ref} className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl transition-transform duration-75 ease-out"
          style={{ transform: 'translate(33%, 33%)' }} />
        <div ref={blob3Ref} className="absolute top-1/4 left-1/2 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl transition-transform duration-75 ease-out"
          style={{ transform: 'translate(-50%, -50%)' }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center
                          shadow-[0_2px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Sparkles className="w-5 h-5 text-white drop-shadow" />
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-none">{t('sidebar.systemName')}</span>
            <p className="text-primary-200/70 text-xs mt-0.5">{t('sidebar.learningCenter')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5
                            bg-white/10 backdrop-blur-sm rounded-full
                            border border-white/20 text-white/80 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t('auth.registerSubtitle')}
            </div>
            <h1 className="text-[38px] font-bold text-white leading-[1.15] tracking-tight">
              {t('auth.register')}
              <span className="block text-cyan-300 mt-1">{t('sidebar.learningCenter')}</span>
            </h1>
            <p className="text-primary-200/80 text-base leading-relaxed max-w-sm">
              {t('auth.heroSubtitle')}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {[
              { icon: User,         text: 'Заполните личные данные' },
              { icon: KeyRound,     text: 'Придумайте надёжный пароль' },
              { icon: ShieldCheck,  text: 'Подтвердите email' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/8 hover:bg-white/12
                                       backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20
                                       transition-all duration-200 group">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0
                                 group-hover:scale-110 transition-transform duration-200">
                  <step.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-500/40 border border-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-white/80 text-sm font-medium">{step.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative" />
      </div>

      {/* ── Right panel ── */}
      <div
        ref={rightPanelRef}
        className="flex-1 flex items-center justify-center p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* Cursor glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute w-[420px] h-[420px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s ease' }}
        />

        <div className="relative w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">{t('sidebar.systemName')}</span>
          </div>

          {/* Form card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8
                          shadow-[0_20px_60px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.06)]
                          border border-white/60">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('auth.registerSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  {error}
                </div>
              )}

              {formData.invitationToken && (
                <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {t('auth.invitationActivated')}
                </div>
              )}

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.firstName')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Алия"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.lastName')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Смагулова"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  {t('common.email')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  {t('common.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="+77001234567"
                  />
                </div>
              </div>

              {/* Passwords row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('common.password')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.confirmPassword')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 -mt-1">{t('auth.passwordHint')}</p>

              {/* Invitation token (if not prefilled) */}
              {!formData.invitationToken && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auth.invitationCode')}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="invitationToken"
                      value={formData.invitationToken}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder={t('auth.invitationCodePlaceholder')}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitLoading}
                className="btn-primary w-full py-3 mt-2"
              >
                {submitLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('auth.registerButton')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 pt-1">
                {t('auth.haveAccount')}{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  {t('auth.loginLink')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
