import { useState } from 'react'
import { X, Video, CheckCircle, XCircle, ExternalLink, Clock } from 'lucide-react'

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

interface LessonDetailModalProps {
  lesson: Lesson
  onClose: () => void
  onSave: () => void
}

export default function LessonDetailModal({ lesson, onClose, onSave }: LessonDetailModalProps) {
  const [recordingUrl, setRecordingUrl] = useState(lesson.recordingUrl || '')
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    lesson.students.reduce((acc, student) => ({ ...acc, [student.id]: student.attended }), {})
  )
  const [grades, setGrades] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const handleSave = () => {
    // TODO: Save recording URL, attendance, and grades
    console.log('Saving:', { recordingUrl, attendance, grades, feedback })
    onSave()
  }

  const toggleAttendance = (studentId: string) => {
    setAttendance({ ...attendance, [studentId]: !attendance[studentId] })
  }

  const handleGradeChange = (studentId: string, grade: string) => {
    setGrades({ ...grades, [studentId]: grade })
  }

  const handleFeedbackChange = (studentId: string, text: string) => {
    setFeedback({ ...feedback, [studentId]: text })
  }

  const submitGrade = (studentId: string) => {
    // TODO: Submit grade and feedback for student
    console.log(`Submitting grade ${grades[studentId]} and feedback for student ${studentId}:`, feedback[studentId])
    alert('Оценка и обратная связь отправлены!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {lesson.courseName} • {new Date(lesson.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} • {lesson.time}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Recording URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ссылка на видеозапись
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={recordingUrl}
                  onChange={(e) => setRecordingUrl(e.target.value)}
                  className="input-field pl-10"
                  placeholder="https://example.com/recording"
                />
              </div>
              {recordingUrl && (
                <a
                  href={recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Открыть
                </a>
              )}
            </div>
          </div>

          {/* Attendance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Посещаемость ({Object.values(attendance).filter(Boolean).length}/{lesson.students.length})
            </h3>
            <div className="space-y-2">
              {lesson.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{student.name}</span>
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      attendance[student.id]
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                    }`}
                  >
                    {attendance[student.id] ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Присутствовал
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Отсутствовал
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Homework submissions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Домашние задания</h3>
            <div className="space-y-4">
              {lesson.students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-750"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{student.name}</h4>
                      {student.homework && (
                        <a
                          href={student.homework.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 mt-1 break-all"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          {student.homework.url}
                        </a>
                      )}
                    </div>
                    {student.homework?.isLate && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs font-medium flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        Просрочено
                      </span>
                    )}
                  </div>

                  {student.homework ? (
                    student.homework.status === 'graded' ? (
                      <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">
                        Оценка: {student.homework.grade}%
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={grades[student.id] || ''}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="0-100"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">баллов</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Обратная связь
                          </label>
                          <textarea
                            value={feedback[student.id] || ''}
                            onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                            placeholder="Напишите комментарий к работе студента..."
                          />
                        </div>
                        <button
                          onClick={() => submitGrade(student.id)}
                          disabled={!grades[student.id]}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full"
                        >
                          Оценить и отправить
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Домашняя работа не сдана
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleSave} className="btn-primary flex-1">
              Сохранить изменения
            </button>
            <button onClick={onClose} className="btn-secondary flex-1">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
