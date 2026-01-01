import { Award, TrendingUp } from 'lucide-react'

export default function GradesPage() {
  const courses = [
    {
      id: 1,
      name: 'JavaScript Fundamentals',
      instructor: 'Нуржан Касымов',
      avgGrade: 87,
      homeworks: [
        { id: 1, title: 'ДЗ #1: Переменные и типы данных', grade: 90, date: '2024-02-01', feedback: 'Отличная работа!' },
        { id: 2, title: 'ДЗ #2: Функции', grade: 85, date: '2024-02-08', feedback: 'Хорошо, но можно улучшить читаемость кода' },
        { id: 3, title: 'ДЗ #3: Массивы и объекты', grade: 92, date: '2024-02-15', feedback: 'Превосходно!' },
        { id: 4, title: 'ДЗ #4: DOM манипуляции', grade: 88, date: '2024-02-22', feedback: 'Отлично выполнено' },
        { id: 5, title: 'ДЗ #5: Модули ES6', grade: 82, date: '2024-03-01', feedback: 'Хорошо, но есть над чем поработать' },
      ],
    },
    {
      id: 2,
      name: 'React Advanced',
      instructor: 'Айгерим Токтарова',
      avgGrade: 89,
      homeworks: [
        { id: 6, title: 'ДЗ #1: Hooks', grade: 88, date: '2024-02-10', feedback: 'Хорошее понимание хуков' },
        { id: 7, title: 'ДЗ #2: Context API', grade: 90, date: '2024-02-17', feedback: 'Отлично!' },
        { id: 8, title: 'ДЗ #3: State Management', grade: 89, date: '2024-02-24', feedback: 'Хорошая работа' },
      ],
    },
  ]

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50'
    if (grade >= 75) return 'text-blue-600 bg-blue-50'
    if (grade >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const totalAvg = Math.round(
    courses.reduce((sum, course) => sum + course.avgGrade, 0) / courses.length
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Дневник успеваемости</h1>
        <p className="text-gray-600 mt-2">Ваши оценки и обратная связь от преподавателей</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-blue-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <p className="text-primary-100 text-sm">Общий средний балл</p>
              <p className="text-4xl font-bold mt-1">{totalAvg}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-green-100 text-sm">Тенденция</p>
              <p className="text-4xl font-bold mt-1">+5%</p>
              <p className="text-green-100 text-xs mt-1">от прошлого месяца</p>
            </div>
          </div>
        </div>
      </div>

      {courses.map((course) => (
        <div key={course.id} className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{course.name}</h2>
              <p className="text-gray-600 text-sm mt-1">Преподаватель: {course.instructor}</p>
            </div>
            <div className={`px-6 py-3 rounded-lg font-bold text-2xl ${getGradeColor(course.avgGrade)}`}>
              {course.avgGrade}%
            </div>
          </div>

          <div className="space-y-3">
            {course.homeworks.map((hw) => (
              <div key={hw.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{hw.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Сдано: {new Date(hw.date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${getGradeColor(hw.grade)}`}>
                    {hw.grade}%
                  </div>
                </div>
                {hw.feedback && (
                  <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm font-medium text-blue-900">Обратная связь:</p>
                    <p className="text-sm text-blue-800 mt-1">{hw.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Прогресс по курсу</h4>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${course.avgGrade}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
