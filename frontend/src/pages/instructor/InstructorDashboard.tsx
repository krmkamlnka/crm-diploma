import { BookOpen, Users, Calendar, CheckCircle } from 'lucide-react'

export default function InstructorDashboard() {
  const stats = [
    { label: 'Активных курсов', value: '3', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Всего студентов', value: '45', icon: Users, color: 'bg-green-500' },
    { label: 'Занятий в этом месяце', value: '12', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Проверено ДЗ', value: '28', icon: CheckCircle, color: 'bg-orange-500' },
  ]

  const upcomingLessons = [
    { id: 1, course: 'JavaScript Fundamentals', date: '2024-03-15', time: '14:00', students: 15 },
    { id: 2, course: 'React Advanced', date: '2024-03-16', time: '16:00', students: 12 },
    { id: 3, course: 'Node.js Backend', date: '2024-03-17', time: '15:00', students: 18 },
  ]

  const pendingHomework = [
    { id: 1, student: 'Алия Смагулова', course: 'JavaScript Fundamentals', dueDate: '2024-03-14', isLate: true },
    { id: 2, student: 'Нуржан Касымов', course: 'React Advanced', dueDate: '2024-03-15', isLate: false },
    { id: 3, student: 'Айгерим Токтарова', course: 'Node.js Backend', dueDate: '2024-03-16', isLate: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель преподавателя</h1>
        <p className="text-gray-600 mt-2">Управление курсами и успеваемостью студентов</p>
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
              <div key={lesson.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{lesson.course}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {lesson.students} студентов
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(lesson.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <span>{lesson.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Непроверенные домашние задания</h2>
          <div className="space-y-3">
            {pendingHomework.map((hw) => (
              <div key={hw.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{hw.student}</h3>
                    <p className="text-sm text-gray-600">{hw.course}</p>
                  </div>
                  {hw.isLate && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      Просрочено
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Дедлайн: {new Date(hw.dueDate).toLocaleDateString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
