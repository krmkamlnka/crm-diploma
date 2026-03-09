import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login, isLoading, isAuthenticated } = useAuthStore()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[LoginPage] User already authenticated, redirecting to /')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      // After successful login, user is already in the store
      // Just navigate and let React re-render with the new state
      navigate('/', { replace: true })
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Неверный email или пароль'
      setError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Вход в систему</h1>
            <p className="text-gray-600 mt-2">CRM для учебных центров</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            <div className="text-center text-sm text-gray-600">
              Получили приглашение?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Зарегистрироваться
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
