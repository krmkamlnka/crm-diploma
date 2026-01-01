import { useState } from 'react'
import { UserPlus, Mail, Send } from 'lucide-react'

export default function InviteUserPage() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'instructor' | 'student'>('student')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    // TODO: Replace with actual API call
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
      setEmail('')
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Пригласить пользователя</h1>
        <p className="text-gray-600 mt-2">Отправьте приглашение новому пользователю</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Новое приглашение</h2>
            <p className="text-sm text-gray-600">Пользователь получит email с кодом для регистрации</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <Send className="w-5 h-5" />
            <span>Приглашение успешно отправлено!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email адрес
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Роль пользователя
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  role === 'student'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-gray-900">Студент</p>
                  <p className="text-xs text-gray-500 mt-1">Доступ к курсам</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  role === 'instructor'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-gray-900">Преподаватель</p>
                  <p className="text-xs text-gray-500 mt-1">Управление курсами</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  role === 'admin'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-gray-900">Администратор</p>
                  <p className="text-xs text-gray-500 mt-1">Полный доступ</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Отправка...' : 'Отправить приглашение'}
            </button>
          </div>
        </form>
      </div>

      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Недавние приглашения</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">user{i}@example.com</p>
                <p className="text-sm text-gray-500">Отправлено {i} дн. назад</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Студент
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Ожидает
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
