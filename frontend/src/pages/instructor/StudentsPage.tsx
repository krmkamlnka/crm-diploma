import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'

export default function StudentsPage() {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const courses = [
    { id: '1', name: 'JavaScript Fundamentals' },
    { id: '2', name: 'React Advanced' },
    { id: '3', name: 'Node.js Backend' },
  ]

  const allStudents = [
    {
      id: 1,
      name: 'Алия Смагулова',
      email: 'aliya@example.com',
      courseId: '1',
      course: 'JavaScript Fundamentals',
      avgGrade: 87,
      homeworkSubmitted: 8,
      homeworkTotal: 10,
      attendance: 95,
    },
    {
      id: 2,
      name: 'Нуржан Касымов',
      email: 'nurzhan@example.com',
      courseId: '2',
      course: 'React Advanced',
      avgGrade: 92,
      homeworkSubmitted: 10,
      homeworkTotal: 10,
      attendance: 100,
    },
    {
      id: 3,
      name: 'Айгерим Токтарова',
      email: 'aigerim@example.com',
      courseId: '3',
      course: 'Node.js Backend',
      avgGrade: 78,
      homeworkSubmitted: 7,
      homeworkTotal: 10,
      attendance: 85,
    },
  ]

  const students = selectedCourse === 'all'
    ? allStudents
    : allStudents.filter(s => s.courseId === selectedCourse)

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50'
    if (grade >= 75) return 'text-blue-600 bg-blue-50'
    if (grade >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Студенты</h1>
        <p className="text-gray-600 mt-2">Отслеживание успеваемости студентов</p>
      </div>

      <div className="card">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск студентов..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="input-field min-w-[200px]"
          >
            <option value="all">Все курсы</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-500">{student.course}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg font-semibold ${getGradeColor(student.avgGrade)}`}>
                  {student.avgGrade}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Домашние задания</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(student.homeworkSubmitted / student.homeworkTotal) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {student.homeworkSubmitted}/{student.homeworkTotal}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Посещаемость</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${student.attendance}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{student.attendance}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => navigate(`/instructor/students/${student.id}`)}
                    className="btn-secondary text-sm"
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
