import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface PaymentRule {
  id: string
  courseName: string
  amount: number
  dueDay: number // день месяца для оплаты (1-31)
}

export default function AdminPaymentsPage() {
  const [paymentRules, setPaymentRules] = useState<PaymentRule[]>([
    { id: '1', courseName: 'JavaScript Fundamentals', amount: 50000, dueDay: 10 },
    { id: '2', courseName: 'React Advanced', amount: 60000, dueDay: 10 },
    { id: '3', courseName: 'Node.js Backend', amount: 55000, dueDay: 15 },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<PaymentRule | null>(null)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleEdit = (rule: PaymentRule) => {
    setEditingRule(rule)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Удалить правило оплаты?')) {
      setPaymentRules(paymentRules.filter(r => r.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Управление оплатой</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Настройка стоимости и сроков оплаты по курсам</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить правило
        </button>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Правила оплаты по курсам
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Курс
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Стоимость/месяц
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Срок оплаты
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentRules.map((rule) => (
                <tr key={rule.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{rule.courseName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{formatAmount(rule.amount)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700 dark:text-gray-300">{rule.dueDay} число каждого месяца</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Как это работает
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>Для каждого курса можно установить стоимость обучения в месяц</li>
          <li>Укажите день месяца, до которого студенты должны вносить оплату</li>
          <li>Система автоматически создаст платежи для всех студентов, записанных на курс</li>
          <li>Студенты увидят платежи в разделе "Оплата" и смогут оплатить через Kaspi Pay</li>
        </ul>
      </div>
    </div>
  )
}
