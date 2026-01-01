import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'

export default function StudentDetailPage() {
  const { studentId } = useParams()
  const navigate = useNavigate()

  // Mock data
  const student = {
    id: studentId,
    name: 'Алия Смагулова',
    email: 'aliya@example.com',
    course: 'JavaScript Fundamentals',
    avgGrade: 87,
  }

  const lessons = [
    {
      id: 1,
      title: 'Введение в JS',
      date: '2024-02-01',
      attended: true,
      homework: {
        submitted: true,
        url: 'https://github.com/aliya/hw1',
        submittedAt: '2024-02-03',
        deadline: '2024-02-05',
        isLate: false,
        grade: 90,
        status: 'graded',
      },
    },
    {
      id: 2,
      title: 'Переменные и типы',
      date: '2024-02-08',
      attended: true,
      homework: {
        submitted: true,
        url: 'https://github.com/aliya/hw2',
        submittedAt: '2024-02-11',
        deadline: '2024-02-12',
        isLate: false,
        grade: 85,
        status: 'graded',
      },
    },
    {
      id: 3,
      title: 'Функции',
      date: '2024-02-15',
      attended: false,
      homework: {
        submitted: true,
        url: 'https://github.com/aliya/hw3',
        submittedAt: '2024-02-20',
        deadline: '2024-02-19',
        isLate: true,
        grade: null,
        status: 'pending',
      },
    },
    {
      id: 4,
      title: 'Массивы и объекты',
      date: '2024-02-22',
      attended: true,
      homework: {
        submitted: false,
        url: null,
        submittedAt: null,
        deadline: '2024-02-26',
        isLate: true,
        grade: null,
        status: 'not_submitted',
      },
    },
  ]

  const attendanceRate = (lessons.filter(l => l.attended).length / lessons.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/instructor/students')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-600 mt-1">{student.email} • {student.course}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 text-sm">Средний балл</p>
          <p className="text-4xl font-bold mt-2">{student.avgGrade}%</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 text-sm">Посещаемость</p>
          <p className="text-4xl font-bold mt-2">{Math.round(attendanceRate)}%</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-purple-100 text-sm">Выполнено ДЗ</p>
          <p className="text-4xl font-bold mt-2">
            {lessons.filter(l => l.homework.submitted).length}/{lessons.length}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Занятия и домашние задания</h2>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(lesson.date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {lesson.attended ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Присутствовал
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      <XCircle className="w-4 h-4" />
                      Отсутствовал
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Домашнее задание</h4>
                  {lesson.homework.isLate && lesson.homework.status !== 'not_submitted' && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      Просрочено
                    </span>
                  )}
                </div>

                {lesson.homework.submitted ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                      <a
                        href={lesson.homework.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm underline"
                      >
                        {lesson.homework.url}
                      </a>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        Сдано: {new Date(lesson.homework.submittedAt!).toLocaleDateString('ru-RU')}
                        <span className="mx-2">•</span>
                        Дедлайн: {new Date(lesson.homework.deadline).toLocaleDateString('ru-RU')}
                      </div>

                      {lesson.homework.status === 'graded' ? (
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                          Оценка: {lesson.homework.grade}%
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700">
                            Оценить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    {lesson.homework.isLate ? (
                      <span className="text-red-600 font-medium">
                        Не сдано (дедлайн: {new Date(lesson.homework.deadline).toLocaleDateString('ru-RU')})
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        Ожидается до {new Date(lesson.homework.deadline).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
