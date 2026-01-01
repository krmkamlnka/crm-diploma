import { useState } from 'react'
import { X, Upload, FileText, Trash2, AlertCircle } from 'lucide-react'

interface Lesson {
  id: string
  courseId: string
  courseName: string
  title: string
  date: string
  time: string
}

interface CreateLessonModalProps {
  courseId: string
  courseName: string
  selectedDate: string
  existingLessons: Lesson[]
  onClose: () => void
  onSave: () => void
}

interface FileUpload {
  id: string
  name: string
  file: File
}

export default function CreateLessonModal({
  courseId,
  courseName,
  selectedDate,
  existingLessons,
  onClose,
  onSave,
}: CreateLessonModalProps) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('14:00')
  const [materials, setMaterials] = useState<FileUpload[]>([])
  const [homework, setHomework] = useState<FileUpload | null>(null)

  const hasConflict = existingLessons.some((lesson) => {
    const lessonTime = parseInt(lesson.time.split(':')[0])
    const newTime = parseInt(time.split(':')[0])
    return Math.abs(lessonTime - newTime) < 2 // Конфликт если разница меньше 2 часов
  })

  const handleMaterialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newMaterials = Array.from(files).map((file) => ({
        id: Math.random().toString(),
        name: file.name,
        file,
      }))
      setMaterials([...materials, ...newMaterials])
    }
  }

  const handleHomeworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHomework({
        id: Math.random().toString(),
        name: file.name,
        file,
      })
    }
  }

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasConflict) {
      alert('Выберите другое время - есть конфликт с другим занятием!')
      return
    }
    // TODO: Upload files and save lesson
    console.log('Creating lesson:', { courseId, title, date: selectedDate, time, materials, homework })
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Создать занятие</h2>
            <p className="text-sm text-gray-600 mt-1">
              {courseName} • {new Date(selectedDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название занятия *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Введение в асинхронность"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Время начала *
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
              required
            />
            {hasConflict && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Конфликт с другим занятием в это время!</span>
              </div>
            )}
          </div>

          {/* Existing lessons at this date */}
          {existingLessons.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 mb-2">Занятия в этот день:</p>
              <div className="space-y-1">
                {existingLessons.map((lesson) => (
                  <div key={lesson.id} className="text-xs text-yellow-800">
                    {lesson.time} - {lesson.title} ({lesson.courseName})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Раздаточные материалы (PDF, DOCX)
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Загрузить файлы</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleMaterialUpload}
                  className="hidden"
                />
              </label>

              {materials.length > 0 && (
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{material.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMaterial(material.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Homework upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ТЗ для домашней работы (PDF, DOCX)
            </label>
            <div className="space-y-2">
              {!homework ? (
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Загрузить задание</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleHomeworkUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-900">{homework.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHomework(null)}
                    className="p-1 hover:bg-blue-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={hasConflict}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Создать занятие
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
