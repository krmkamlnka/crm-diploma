import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import StudentLessonDetailModal from '../../components/student/StudentLessonDetailModal'

interface Lesson {
  id: string
  courseId: string
  courseName: string
  title: string
  date: string
  time: string
  materials: Material[]
  recordingUrl?: string
  homework?: Homework
}

interface Material {
  id: string
  name: string
  url: string
  type: 'pdf' | 'docx'
}

interface Homework {
  id: string
  title: string
  description: string
  deadline: string
  taskFileUrl?: string
  submittedUrl?: string
  isLate?: boolean
  grade?: number
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  // Get current date for mock lessons
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const lessons: Lesson[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      title: 'Введение в JS',
      date: yesterdayStr,
      time: '14:00',
      materials: [
        {
          id: '1',
          name: 'Презентация - Введение в JS.pdf',
          url: 'https://example.com/materials/js-intro.pdf',
          type: 'pdf',
        },
        {
          id: '2',
          name: 'Примеры кода.docx',
          url: 'https://example.com/materials/code-examples.docx',
          type: 'docx',
        },
      ],
      recordingUrl: 'https://example.com/recording/1',
      homework: {
        id: '1',
        title: 'ДЗ #1: Основы JavaScript',
        description: 'Создайте калькулятор с базовыми операциями',
        deadline: todayStr,
        taskFileUrl: 'https://example.com/homework/task1.pdf',
        submittedUrl: 'https://github.com/student/js-homework-1',
        grade: 90,
      },
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'React Advanced',
      title: 'Hooks в React',
      date: todayStr,
      time: '16:00',
      materials: [
        {
          id: '3',
          name: 'React Hooks - Презентация.pdf',
          url: 'https://example.com/materials/react-hooks.pdf',
          type: 'pdf',
        },
      ],
      homework: {
        id: '2',
        title: 'ДЗ #2: useState и useEffect',
        description: 'Реализуйте счетчик с сохранением в localStorage',
        deadline: tomorrowStr,
        taskFileUrl: 'https://example.com/homework/task2.pdf',
      },
    },
    {
      id: '3',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      title: 'Функции и массивы',
      date: tomorrowStr,
      time: '14:00',
      materials: [
        {
          id: '4',
          name: 'Функции высшего порядка.pdf',
          url: 'https://example.com/materials/higher-order-functions.pdf',
          type: 'pdf',
        },
      ],
      homework: {
        id: '3',
        title: 'ДЗ #3: Работа с массивами',
        description: 'Используйте map, filter, reduce для обработки данных',
        deadline: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        taskFileUrl: 'https://example.com/homework/task3.pdf',
      },
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getLessonsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return lessons.filter(lesson => lesson.date === dateStr)
  }

  const nextMonth = () => {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() + 1)
    setCurrentDate(date)
  }

  const prevMonth = () => {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() - 1)
    setCurrentDate(date)
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

        <div className="flex-1 grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
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
                  {dayLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="text-xs p-2 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div className="font-medium truncate">{lesson.time}</div>
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

      {selectedLesson && (
        <StudentLessonDetailModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  )
}
