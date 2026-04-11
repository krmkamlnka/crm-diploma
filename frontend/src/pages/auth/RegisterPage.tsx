import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import { authService } from '../../services/authService'
import { useTranslation } from 'react-i18next'
import { UserPlus, Mail } from 'lucide-react'
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
  const [error, setError] = useState('')
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [verificationCode, setVerificationCode] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)

  const navigate = useNavigate()
  const { register, setUser } = useAuthStore()
  const { t } = useTranslation()

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (!tokenFromUrl) return

    setFormData(prev => ({ ...prev, invitationToken: tokenFromUrl }))

    axios.get(`/api/v1/invitations/by-token/${tokenFromUrl}`)
      .then(res => {
        if (res.data.email) {
          setFormData(prev => ({ ...prev, email: res.data.email }))
        }
      })
      .catch(() => {})
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
    const hasDigit = /\d/.test(formData.password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)

    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecial) {
      setError(t('auth.passwordTooWeak'))
      setSubmitLoading(false)
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        invitationToken: formData.invitationToken || undefined,
      })
      setStep('verify')
    } catch (err: any) {
      const data = err.response?.data
      if (data?.validationErrors) {
        const messages = Object.values(data.validationErrors).join(', ')
        setError(messages)
      } else {
        setError(data?.message || t('auth.registerError'))
      }
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

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('auth.emailVerification')}</h1>
              <p className="text-gray-600 mt-2">
                {t('auth.verificationCodeSent')} <span className="font-medium">{formData.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.verificationCode')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={verifyLoading}
                className="btn-primary w-full"
              >
                {verifyLoading ? t('auth.verifyLoading') : t('auth.verifyButton')}
              </button>

              <div className="text-center text-sm text-gray-600">
                <button type="button" onClick={() => setStep('register')} className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('common.back')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h1>
            <p className="text-gray-600 mt-2">{t('auth.registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {formData.invitationToken && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
                {t('auth.invitationActivated')}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.firstName')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Алия"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.lastName')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Смагулова"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.email')} <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.phone')}
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+77001234567"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.password')} <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('auth.passwordHint')}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.confirmPassword')} <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder={t('auth.confirmPasswordPlaceholder')}
                required
              />
            </div>

            {!formData.invitationToken && (
              <div>
                <label htmlFor="invitationToken" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.invitationCode')}
                </label>
                <input
                  id="invitationToken"
                  type="text"
                  name="invitationToken"
                  value={formData.invitationToken}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('auth.invitationCodePlaceholder')}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="btn-primary w-full"
            >
              {submitLoading ? t('auth.registerLoading') : t('auth.registerButton')}
            </button>

            <div className="text-center text-sm text-gray-600">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                {t('auth.loginLink')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
