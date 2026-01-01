import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LessonDetailModal from '../../components/instructor/LessonDetailModal'

interface Lesson {
  id: string
  courseId: string
  courseName: string
  title: string
  date: string
  time: string
  recordingUrl?: string
  students: Student[]
}

interface Student {
  id: string
  name: string
  attended: boolean
  homework?: {
    url: string
    isLate: boolean
    grade?: number
    status: 'pending' | 'graded'
  }
}

export default function InstructorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  // Get current date for mock lessons
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekStr = nextWeek.toISOString().split('T')[0]

  const lessons: Lesson[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      title: 'Введение в JS',
      date: todayStr,
      time: '14:00',
      recordingUrl: 'https://example.com/recording/1',
      students: [
        {
          id: '1',
          name: 'Алия Смагулова',
          attended: true,
          homework: {
            url: 'https://github.com/aliya/js-intro-hw',
            isLate: false,
            grade: 90,
            status: 'graded',
          },
        },
        {
          id: '2',
          name: 'Нуржан Касымов',
          attended: true,
          homework: {
            url: 'https://github.com/nurzhan/js-intro-hw',
            isLate: false,
            status: 'pending',
          },
        },
        {
          id: '3',
          name: 'Ерлан Абдуллаев',
          attended: false,
          homework: {
            url: 'https://github.com/erlan/js-intro-hw',
            isLate: true,
            status: 'pending',
          },
        },
      ],
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'React Advanced',
      title: 'Hooks в React',
      date: todayStr,
      time: '16:00',
      students: [
        {
          id: '4',
          name: 'Айгерим Токтарова',
          attended: true,
          homework: {
            url: 'https://github.com/aigerim/react-hooks-hw',
            isLate: false,
            status: 'pending',
          },
        },
        {
          id: '5',
          name: 'Дауир Сейтов',
          attended: true,
        },
      ],
    },
    {
      id: '3',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      title: 'Функции и массивы',
      date: tomorrowStr,
      time: '14:00',
      students: [
        {
          id: '1',
          name: 'Алия Смагулова',
          attended: false,
        },
        {
          id: '2',
          name: 'Нуржан Касымов',
          attended: false,
        },
        {
          id: '3',
          name: 'Ерлан Абдуллаев',
          attended: false,
        },
      ],
    },
    {
      id: '4',
      courseId: '3',
      courseName: 'Node.js Backend',
      title: 'Express.js основы',
      date: nextWeekStr,
      time: '18:00',
      students: [
        {
          id: '6',
          name: 'Жанар Нурланова',
          attended: false,
        },
        {
          id: '7',
          name: 'Асем Калиева',
          attended: false,
        },
      ],
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
        <p className="text-gray-600 dark:text-gray-400 mt-2">Все занятия по всем курсам</p>
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
        <LessonDetailModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onSave={() => {
            // TODO: Save changes
            setSelectedLesson(null)
          }}
        />
      )}
    </div>
  )
}
