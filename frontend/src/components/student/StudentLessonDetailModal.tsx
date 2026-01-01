import { useState } from 'react'
import { X, Download, Video, FileText, ExternalLink, Upload, CheckCircle, Clock } from 'lucide-react'

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

interface StudentLessonDetailModalProps {
  lesson: Lesson
  onClose: () => void
}

export default function StudentLessonDetailModal({ lesson, onClose }: StudentLessonDetailModalProps) {
  const [homeworkUrl, setHomeworkUrl] = useState(lesson.homework?.submittedUrl || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitHomework = async () => {
    if (!homeworkUrl.trim()) return

    setIsSubmitting(true)
    // TODO: Submit homework URL to backend
    console.log('Submitting homework:', homeworkUrl)

    setTimeout(() => {
      setIsSubmitting(false)
      alert('Домашняя работа успешно отправлена!')
    }, 1000)
  }

  const isDeadlinePassed = lesson.homework
    ? new Date(lesson.homework.deadline) < new Date()
    : false

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
          {lesson.recordingUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Видеозапись занятия
              </h3>
              <a
                href={lesson.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-purple-700 dark:text-purple-300">Посмотреть запись урока</span>
                <ExternalLink className="w-4 h-4 ml-auto text-purple-600 dark:text-purple-400" />
              </a>
            </div>
          )}

          {/* Materials */}
          {lesson.materials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Раздаточные материалы
              </h3>
              <div className="space-y-2">
                {lesson.materials.map((material) => (
                  <a
                    key={material.id}
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">{material.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{material.type}</span>
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Homework */}
          {lesson.homework && (
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-750">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {lesson.homework.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {lesson.homework.description}
                  </p>
                </div>
                {lesson.homework.grade !== undefined ? (
                  <span className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                    Оценка: {lesson.homework.grade}%
                  </span>
                ) : isDeadlinePassed ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    Просрочено
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium flex-shrink-0">
                    До {new Date(lesson.homework.deadline).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>

              {/* Task file */}
              {lesson.homework.taskFileUrl && (
                <a
                  href={lesson.homework.taskFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 mb-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="flex-1 font-medium text-gray-900 dark:text-gray-100">Задание (ТЗ)</span>
                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </a>
              )}

              {/* Submit homework */}
              {lesson.homework.grade === undefined && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ссылка на GitHub репозиторий
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        value={homeworkUrl}
                        onChange={(e) => setHomeworkUrl(e.target.value)}
                        className="input-field pl-10"
                        placeholder="https://github.com/username/repository"
                        disabled={!!lesson.homework.submittedUrl}
                      />
                    </div>
                    {!lesson.homework.submittedUrl && (
                      <button
                        onClick={handleSubmitHomework}
                        disabled={!homeworkUrl.trim() || isSubmitting}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Отправить
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {lesson.homework.submittedUrl && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Домашняя работа отправлена, ожидает проверки</span>
                    </div>
                  )}
                </div>
              )}

              {lesson.homework.grade !== undefined && lesson.homework.submittedUrl && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Домашняя работа проверена</span>
                  <a
                    href={lesson.homework.submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto hover:underline flex items-center gap-1"
                  >
                    Посмотреть решение
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onClose} className="btn-secondary px-6">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
