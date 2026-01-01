import { useState } from 'react'
import { useAuthStore } from '../../context/authStore'
import { Camera, Moon, Sun, Save } from 'lucide-react'
import { useThemeStore } from '../../context/themeStore'

export default function InstructorSettingsPage() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+7 (700) 123-45-67',
    bio: 'Преподаватель с 5-летним опытом в веб-разработке',
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save settings
    console.log('Saving settings:', formData)
    alert('Настройки сохранены!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-2">Управление профилем и параметрами приложения</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Фото профиля</h2>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-semibold text-primary-700">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Нажмите на иконку камеры,<br />чтобы загрузить фото
            </p>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="card lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Тема приложения</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Выберите тему оформления интерфейса
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-6 border-2 rounded-lg transition-all ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <Sun className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">Светлая</p>
                    <p className="text-xs text-gray-500 mt-1">Классическая светлая тема</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-6 border-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center">
                    <Moon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">Темная</p>
                    <p className="text-xs text-gray-500 mt-1">Темная тема для работы ночью</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Текущая тема:</strong> {theme === 'light' ? 'Светлая' : 'Темная'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Личные данные</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фамилия
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email не может быть изменен</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            О себе
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="input-field"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Сохранить изменения
          </button>
          <button type="button" className="btn-secondary">
            Отмена
          </button>
        </div>
      </form>

      {/* Password Change */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Смена пароля</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текущий пароль
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Введите текущий пароль"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Новый пароль
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Введите новый пароль"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подтвердите пароль
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Повторите новый пароль"
            />
          </div>

          <button type="button" className="btn-primary">
            Изменить пароль
          </button>
        </div>
      </div>
    </div>
  )
}
