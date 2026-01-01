import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Users, Calendar, FileText } from 'lucide-react'

export default function CoursesPage() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const courses = [
    {
      id: 1,
      name: 'JavaScript Fundamentals',
      description: 'Основы JavaScript для начинающих',
      students: 15,
      lessons: 24,
      startDate: '2024-01-15',
      status: 'active',
    },
    {
      id: 2,
      name: 'React Advanced',
      description: 'Продвинутые паттерны React',
      students: 12,
      lessons: 18,
      startDate: '2024-02-01',
      status: 'active',
    },
    {
      id: 3,
      name: 'Node.js Backend',
      description: 'Разработка серверной части на Node.js',
      students: 18,
      lessons: 20,
      startDate: '2024-02-15',
      status: 'active',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мои курсы</h1>
          <p className="text-gray-600 mt-2">Управление курсами и материалами</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Создать курс
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Активный
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{course.students} студентов</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>{course.lessons} занятий</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Начало: {new Date(course.startDate).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/instructor/courses/${course.id}`)}
              className="w-full btn-secondary"
            >
              Управление курсом
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Создать новый курс</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название курса
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Введите название курса"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Краткое описание курса"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата начала
                </label>
                <input
                  type="date"
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Создать
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
