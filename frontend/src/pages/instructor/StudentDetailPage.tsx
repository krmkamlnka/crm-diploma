import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import api from '../../services/api'

interface SubmissionInfo {
  id: string
  githubUrl: string
  submittedAt: string
  isLate: boolean
  grade?: number
  feedback?: string
  gradedAt?: string
}

interface HomeworkInfo {
  id: string
  title: string
  deadline: string
  submission?: SubmissionInfo
}

interface LessonPerformance {
  lessonId: string
  lessonTitle: string
  lessonDate: string
  attendance: { status: string }
  homework?: HomeworkInfo
}

interface StudentDetail {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  courseId: string
  courseName: string
  averageGrade?: number
  attendanceRate?: number
  homeworkCompletionRate?: number
  performance: LessonPerformance[]
}

export default function StudentDetailPage() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [grades, setGrades] = useState<Record<string, string>>({})
  const [grading, setGrading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchStudent()
  }, [studentId])

  const fetchStudent = async () => {
    setLoading(true)
    try {
      const res = await api.get<StudentDetail>(`/instructor/students/${studentId}`)
      setStudent(res.data)
    } catch {
      setError('Не удалось загрузить данные студента')
    } finally {
      setLoading(false)
    }
  }

  const handleGrade = async (submissionId: string, hwId: string) => {
    const grade = parseInt(grades[submissionId] ?? '')
    if (isNaN(grade) || grade < 0 || grade > 100) return
    setGrading(prev => ({ ...prev, [submissionId]: true }))
    try {
      await api.patch(`/instructor/submissions/${submissionId}/grade`, { grade })
      // Update local state
      setStudent(prev => {
        if (!prev) return prev
        return {
          ...prev,
          performance: prev.performance.map(p => {
            if (p.homework?.id === hwId && p.homework.submission?.id === submissionId) {
              return {
                ...p,
                homework: {
                  ...p.homework,
                  submission: { ...p.homework.submission!, grade },
                },
              }
            }
            return p
          }),
        }
      })
    } catch {
      alert('Ошибка при выставлении оценки')
    } finally {
      setGrading(prev => ({ ...prev, [submissionId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !student) {
    return <div className="text-center py-20 text-red-500">{error || 'Студент не найден'}</div>
  }

  const fmtPct = (val?: number | null) => val != null ? `${Math.round(val)}%` : '—'
  const fmtGrade = (val?: number | null) => val != null ? `${Math.round(val)}/100` : '—'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/instructor/students')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {student.email} • {student.courseName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 text-sm">Средний балл</p>
          <p className="text-4xl font-bold mt-2">{fmtGrade(student.averageGrade)}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 text-sm">Посещаемость</p>
          <p className="text-4xl font-bold mt-2">{fmtPct(student.attendanceRate)}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-purple-100 text-sm">Выполнено ДЗ</p>
          <p className="text-4xl font-bold mt-2">{fmtPct(student.homeworkCompletionRate)}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Занятия и домашние задания
        </h2>

        {student.performance.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">Занятия не найдены</p>
        ) : (
          <div className="space-y-4">
            {student.performance.map((p) => {
              const attended = p.attendance?.status === 'PRESENT' || p.attendance?.status === 'LATE'
              const notMarked = p.attendance?.status === 'NOT_MARKED'
              const sub = p.homework?.submission

              return (
                <div key={p.lessonId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{p.lessonTitle}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {p.lessonDate ? new Date(p.lessonDate).toLocaleDateString('ru-RU') : ''}
                      </p>
                    </div>
                    <div>
                      {notMarked ? (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                          Не отмечен
                        </span>
                      ) : attended ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Присутствовал
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm">
                          <XCircle className="w-4 h-4" />
                          Отсутствовал
                        </span>
                      )}
                    </div>
                  </div>

                  {p.homework && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{p.homework.title}</h4>
                        {sub?.isLate && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            Просрочено
                          </span>
                        )}
                      </div>

                      {sub ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400 shrink-0" />
                            <a
                              href={sub.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 text-sm underline truncate"
                            >
                              {sub.githubUrl}
                            </a>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-600 dark:text-gray-400">
                              Сдано: {new Date(sub.submittedAt).toLocaleDateString('ru-RU')}
                              <span className="mx-2">•</span>
                              Дедлайн: {new Date(p.homework.deadline).toLocaleDateString('ru-RU')}
                            </div>

                            {sub.grade != null ? (
                              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-semibold">
                                Оценка: {sub.grade}%
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="0-100"
                                  value={grades[sub.id] ?? ''}
                                  onChange={e => setGrades(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <button
                                  onClick={() => handleGrade(sub.id, p.homework!.id)}
                                  disabled={grading[sub.id]}
                                  className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
                                >
                                  {grading[sub.id] ? '...' : 'Оценить'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {p.homework.deadline && new Date(p.homework.deadline) < new Date() ? (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              Не сдано (дедлайн: {new Date(p.homework.deadline).toLocaleDateString('ru-RU')})
                            </span>
                          ) : (
                            <span>
                              Ожидается до {p.homework.deadline ? new Date(p.homework.deadline).toLocaleDateString('ru-RU') : '—'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
