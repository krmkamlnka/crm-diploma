import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, ArrowLeft } from 'lucide-react'
import CreateLessonModal from '../../components/instructor/CreateLessonModal'

interface Lesson {
  id: string
  courseId: string
  courseName: string
  title: string
  date: string
  time: string
  materials: { name: string; url: string }[]
  homework?: { name: string; url: string }
}

export default function CourseManagementPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data - в реальности будет из API
  const course = {
    id: courseId,
    name: 'JavaScript Fundamentals',
    description: 'Основы JavaScript для начинающих',
  }

  const allLessons: Lesson[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      title: 'Введение в JS',
      date: '2024-03-15',
      time: '14:00',
      materials: [],
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'React Advanced',
      title: 'Hooks в React',
      date: '2024-03-15',
      time: '16:00',
      materials: [],
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

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getLessonsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return allLessons.filter(lesson => lesson.date === dateStr)
  }

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    setSelectedDate(dateStr)
    setShowCreateModal(true)
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/instructor/courses')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
            <p className="text-gray-600 mt-1">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="card flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="border border-gray-200 rounded-lg bg-gray-50" />
            }

            const lessons = getLessonsForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div
                key={day.toISOString()}
                className={`border-2 rounded-lg p-2 min-h-[120px] cursor-pointer transition-all hover:border-primary-400 ${
                  isToday ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                  {day.getDate()}
                </div>

                <div className="space-y-1">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`text-xs p-1 rounded truncate ${
                        lesson.courseId === courseId
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                      title={`${lesson.time} - ${lesson.title} (${lesson.courseName})`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lesson.time} - {lesson.title}
                    </div>
                  ))}
                </div>

                {lessons.length === 0 && (
                  <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-600">Занятия этого курса</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-gray-600">Занятия других курсов (конфликт)</span>
          </div>
        </div>
      </div>

      {showCreateModal && selectedDate && (
        <CreateLessonModal
          courseId={courseId!}
          courseName={course.name}
          selectedDate={selectedDate}
          existingLessons={allLessons.filter(l => l.date === selectedDate)}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedDate(null)
          }}
          onSave={() => {
            // TODO: Save lesson
            setShowCreateModal(false)
            setSelectedDate(null)
          }}
        />
      )}
    </div>
  )
}
