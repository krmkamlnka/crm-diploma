import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../services/api'
import StudentLessonDetailModal from '../../components/student/StudentLessonDetailModal'

interface LessonResponse {
  id: string
  courseId: string
  courseName: string
  title: string
  scheduledAt: string
  durationMinutes: number
  location?: string
  onlineMeetingUrl?: string
  recordingUrl?: string
  status: string
  materialsCount: number
  hasHomework: boolean
}

// Shape expected by StudentLessonDetailModal
interface LessonForModal {
  id: string
  courseId: string
  courseName: string
  title: string
  date: string
  time: string
  materials: { id: string; name: string; url: string; type: 'pdf' | 'docx' }[]
  recordingUrl?: string
  homework?: {
    id: string
    title: string
    description: string
    deadline: string
    homeworkFileId?: string   // ID домашнего задания для скачивания файла задания
    submittedUrl?: string
    grade?: number
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [lessons, setLessons] = useState<LessonResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<LessonForModal | null>(null)
  const [loadingModal, setLoadingModal] = useState(false)

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    setLoading(true)
    try {
      const res = await api.get<LessonResponse[]>('/student/lessons')
      setLessons(res.data)
    } catch (err) {
      console.error('Failed to load student lessons:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = async (lesson: LessonResponse) => {
    setLoadingModal(true)
    try {
      const dt = new Date(lesson.scheduledAt)
      const date = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
      const time = dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

      // Fetch materials
      let materials: LessonForModal['materials'] = []
      if (lesson.materialsCount > 0) {
        try {
          const matRes = await api.get<{ id: string; name: string; fileType: string }[]>(
            `/instructor/lessons/${lesson.id}/materials`
          )
          materials = matRes.data.map(m => ({
            id: m.id,
            name: m.name,
            url: '',
            type: (m.fileType === 'pdf' ? 'pdf' : 'docx') as 'pdf' | 'docx',
          }))
        } catch {}
      }

      // Fetch homework (always try, don't rely on cached hasHomework flag)
      let homework: LessonForModal['homework'] | undefined
      try {
        const hwRes = await api.get<{
          id: string
          title: string
          description: string
          deadline: string
          taskFileUrl?: string
        }>(`/instructor/lessons/${lesson.id}/homework`)
        const hw = hwRes.data

        // Check if student already submitted
        let submittedUrl: string | undefined
        let grade: number | undefined
        try {
          const subRes = await api.get<{ githubUrl?: string; grade?: number }>(
            `/student/homework/${hw.id}/my-submission`
          )
          submittedUrl = subRes.data.githubUrl
          grade = subRes.data.grade
        } catch {}

        homework = {
          id: hw.id,
          title: hw.title,
          description: hw.description,
          deadline: hw.deadline,
          homeworkFileId: hw.taskFileUrl ? hw.id : undefined,
          submittedUrl,
          grade,
        }
      } catch {
        // No homework for this lesson — that's fine
      }

      setSelectedLesson({
        id: lesson.id,
        courseId: lesson.courseId,
        courseName: lesson.courseName,
        title: lesson.title,
        date,
        time,
        materials,
        recordingUrl: lesson.recordingUrl,
        homework,
      })
    } finally {
      setLoadingModal(false)
    }
  }

  const localDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const getLessonsForDate = (date: Date) => {
    const dateStr = localDateStr(date)
    return lessons.filter(l => localDateStr(new Date(l.scheduledAt)) === dateStr)
  }

  const getLessonTime = (scheduledAt: string) => {
    return new Date(scheduledAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i))
    return days
  }

  const nextMonth = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }

  const prevMonth = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() - 1)
    setCurrentDate(d)
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Календарь занятий</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Расписание, материалы и домашние задания</p>
      </div>

      <div className="card flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <div className="grid grid-cols-7 gap-1 min-w-[480px] px-1">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-gray-700 dark:text-gray-300 py-2">
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800" />
              }

              const dayLessons = getLessonsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()

              return (
                <div
                  key={day.toISOString()}
                  className={`border-2 rounded-lg p-2 min-h-[120px] ${
                    isToday
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {day.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dayLessons.map(lesson => (
                      <div
                        key={lesson.id}
                        onClick={() => !loadingModal && handleLessonClick(lesson)}
                        className="text-xs p-2 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <div className="font-medium truncate">{getLessonTime(lesson.scheduledAt)}</div>
                        <div className="truncate">{lesson.title}</div>
                        <div className="text-[10px] opacity-75 truncate">{lesson.courseName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        )}
      </div>

      {loadingModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}

      {selectedLesson && !loadingModal && (
        <StudentLessonDetailModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  )
}
