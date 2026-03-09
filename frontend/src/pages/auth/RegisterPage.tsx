import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import { UserPlus } from 'lucide-react'
import EmailVerificationModal from '../../components/auth/EmailVerificationModal'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    invitationCode: '',
  })
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { register, verifyEmail, isLoading, isAuthenticated, pendingVerificationEmail, setPendingVerificationEmail } = useAuthStore()

  // Auto-fill invitation token from URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      console.log('[RegisterPage] Auto-filling invitation token from URL:', tokenFromUrl)
      setFormData(prev => ({
        ...prev,
        invitationCode: tokenFromUrl
      }))
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[RegisterPage] User already authenticated, redirecting to /')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Debug: отслеживаем изменения состояния модалки
  useEffect(() => {
    console.log('pendingVerificationEmail changed to:', pendingVerificationEmail)
  }, [pendingVerificationEmail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.invitationCode.trim()) {
      setError('Код приглашения обязателен для регистрации')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }

    try {
      console.log('Sending registration request...', formData)
      const response = await register(formData)
      console.log('Registration response:', response)

      // Сохраняем email в глобальный стор
      console.log('Setting pendingVerificationEmail to:', response.email)
      setPendingVerificationEmail(response.email)
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = err.response?.data?.message || 'Ошибка при регистрации. Проверьте код приглашения.'
      setError(errorMessage)
    }
  }

  const handleVerifyEmail = async (code: string) => {
    if (!pendingVerificationEmail) return
    await verifyEmail(pendingVerificationEmail, code)
    setPendingVerificationEmail(null)
    // Navigation will be handled by role-based redirect in App.tsx
    navigate('/')
  }

  const handleCloseModal = () => {
    setPendingVerificationEmail(null)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
            <p className="text-gray-600 mt-2">Завершите регистрацию по приглашению</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Код приглашения <span className="text-red-500">*</span>
              </label>
              <input
                id="invitationCode"
                type="text"
                name="invitationCode"
                value={formData.invitationCode}
                onChange={handleChange}
                className="input-field"
                placeholder="Введите код из письма"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Регистрация доступна только по приглашению
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Имя
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Минимум 8 символов"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Повторите пароль"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <div className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={!!pendingVerificationEmail}
        email={pendingVerificationEmail || ''}
        onVerify={handleVerifyEmail}
        onClose={handleCloseModal}
      />
    </div>
  )
}
