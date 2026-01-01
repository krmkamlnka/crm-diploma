import { useState } from 'react'
import { Search, Filter, MoreVertical, BookOpen, Ban, Edit } from 'lucide-react'
import EnrollStudentModal from '../../components/admin/EnrollStudentModal'

export default function ManageUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const users = [
    { id: 1, name: 'Алия Смагулова', email: 'aliya@example.com', role: 'student', status: 'active', registered: '2024-01-15' },
    { id: 2, name: 'Нуржан Касымов', email: 'nurzhan@example.com', role: 'instructor', status: 'active', registered: '2024-01-10' },
    { id: 3, name: 'Айгерим Токтарова', email: 'aigerim@example.com', role: 'student', status: 'active', registered: '2024-01-20' },
    { id: 4, name: 'Ерлан Досымов', email: 'erlan@example.com', role: 'admin', status: 'active', registered: '2023-12-01' },
    { id: 5, name: 'Мадина Жанузакова', email: 'madina@example.com', role: 'student', status: 'inactive', registered: '2024-02-01' },
  ]

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      instructor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      student: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    }
    const labels = {
      admin: 'Админ',
      instructor: 'Преподаватель',
      student: 'Студент',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
        Активен
      </span>
    ) : (
      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
        Неактивен
      </span>
    )
  }

  const handleEnrollStudent = (user: any) => {
    setSelectedStudent(user)
    setOpenMenuId(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Управление пользователями</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Просмотр и управление всеми пользователями системы</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени или email..."
              className="input-field pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input-field"
            >
              <option value="all">Все роли</option>
              <option value="admin">Администраторы</option>
              <option value="instructor">Преподаватели</option>
              <option value="student">Студенты</option>
            </select>

            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Фильтры
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Пользователь</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Роль</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Статус</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Дата регистрации</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 dark:text-primary-300 font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {new Date(user.registered).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      
                      {openMenuId === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <div className="py-1">
                            {user.role === 'student' && (
                              <button
                                onClick={() => handleEnrollStudent(user)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <BookOpen className="w-4 h-4" />
                                Записать на курсы
                              </button>
                            )}
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Редактировать
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                              <Ban className="w-4 h-4" />
                              {user.status === 'active' ? 'Деактивировать' : 'Активировать'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Показано <span className="font-medium">5</span> из <span className="font-medium">156</span> пользователей
          </p>
          <div className="flex gap-2">
            <button className="btn-secondary">Предыдущая</button>
            <button className="btn-primary">Следующая</button>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <EnrollStudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  )
}
