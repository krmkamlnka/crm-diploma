import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface Course {
  id: string
  name: string
}

interface EnrollStudentModalProps {
  student: { id: number; name: string; email: string }
  onClose: () => void
}

export default function EnrollStudentModal({ student, onClose }: EnrollStudentModalProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  const availableCourses: Course[] = [
    { id: '1', name: 'JavaScript Fundamentals' },
    { id: '2', name: 'React Advanced' },
    { id: '3', name: 'Node.js Backend' },
    { id: '4', name: 'Python для начинающих' },
    { id: '5', name: 'Database Design' },
  ]

  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId))
    } else {
      setSelectedCourses([...selectedCourses, courseId])
    }
  }

  const handleSave = () => {
    console.log('Enrolling student', student.id, 'to courses:', selectedCourses)
    alert(`Студент ${student.name} записан на ${selectedCourses.length} курс(ов)`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Запись на курсы</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {student.name} ({student.email})
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Доступные курсы
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableCourses.map((course) => {
              const isSelected = selectedCourses.includes(course.id)
              return (
                <label
                  key={course.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCourse(course.id)}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{course.name}</p>
                  </div>
                  {isSelected && (
                    <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium">
                      Выбран
                    </span>
                  )}
                </label>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Выбрано курсов: <span className="font-semibold">{selectedCourses.length}</span>
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary">
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={selectedCourses.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Записать на курсы
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
