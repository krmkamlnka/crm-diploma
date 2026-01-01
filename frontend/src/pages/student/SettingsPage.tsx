import { useState } from 'react'
import { useAuthStore } from '../../context/authStore'
import { Camera, Moon, Sun, Save } from 'lucide-react'
import { useThemeStore } from '../../context/themeStore'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    about: '',
  })

  const [profileImage, setProfileImage] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save settings to backend
    console.log('Saving settings:', formData)
    alert('Настройки сохранены!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Настройки</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Управление профилем и предпочтениями</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Информация профиля
              </h2>

              {/* Profile Image */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-semibold text-primary-700 dark:text-primary-300">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Фото профиля</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    JPG, PNG или GIF, максимум 5МБ
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Введите имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Введите фамилию"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="example@email.com"
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email нельзя изменить
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  О себе
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Расскажите немного о себе..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>

        {/* Appearance Settings */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Оформление
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Тема
                </label>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'light' ? (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {theme === 'light' ? 'Светлая тема' : 'Темная тема'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Нажмите для переключения
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Информация об аккаунте
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Роль</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {user?.role === 'student' ? 'Студент' : user?.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Дата регистрации</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Статус email</span>
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Подтвержден
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
