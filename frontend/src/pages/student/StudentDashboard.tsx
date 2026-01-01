import { BookOpen, Calendar, Award, Clock } from 'lucide-react'

export default function StudentDashboard() {
  const stats = [
    { label: 'Курсы', value: '2', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Ближайших занятий', value: '3', icon: Calendar, color: 'bg-green-500' },
    { label: 'Средний балл', value: '87%', icon: Award, color: 'bg-purple-500' },
    { label: 'Активных ДЗ', value: '2', icon: Clock, color: 'bg-orange-500' },
  ]

  const upcomingLessons = [
    { id: 1, course: 'JavaScript Fundamentals', topic: 'Async/Await', date: '2024-03-15', time: '14:00' },
    { id: 2, course: 'React Advanced', topic: 'Context API', date: '2024-03-16', time: '16:00' },
  ]

  const recentGrades = [
    { id: 1, homework: 'ДЗ #5: Promises', course: 'JavaScript Fundamentals', grade: 92, date: '2024-03-10' },
    { id: 2, homework: 'ДЗ #3: State Management', course: 'React Advanced', grade: 85, date: '2024-03-12' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель студента</h1>
        <p className="text-gray-600 mt-2">Ваш прогресс и предстоящие занятия</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Предстоящие занятия</h2>
          <div className="space-y-3">
            {upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
                <h3 className="font-medium text-gray-900 mb-1">{lesson.topic}</h3>
                <p className="text-sm text-gray-600 mb-2">{lesson.course}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(lesson.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full btn-secondary mt-4">
            Посмотреть календарь
          </button>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Последние оценки</h2>
          <div className="space-y-3">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{grade.homework}</h3>
                    <p className="text-sm text-gray-600">{grade.course}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg font-semibold ${
                    grade.grade >= 90 ? 'bg-green-100 text-green-700' :
                    grade.grade >= 75 ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {grade.grade}%
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(grade.date).toLocaleDateString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full btn-secondary mt-4">
            Посмотреть дневник
          </button>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-primary-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">AI Ассистент готов помочь</h3>
            <p className="text-primary-100">
              Задавайте вопросы по курсам и получайте персональные рекомендации
            </p>
          </div>
          <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Начать диалог
          </button>
        </div>
      </div>
    </div>
  )
}
