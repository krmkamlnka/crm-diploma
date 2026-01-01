import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react'

interface Payment {
  id: string
  courseId: string
  courseName: string
  month: string
  year: number
  amount: number
  status: 'paid' | 'unpaid' | 'overdue'
  dueDate: string
  paidDate?: string
}

export default function PaymentsPage() {
  const payments: Payment[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      month: 'Январь',
      year: 2025,
      amount: 50000,
      status: 'paid',
      dueDate: '2025-01-10',
      paidDate: '2025-01-08',
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'React Advanced',
      month: 'Январь',
      year: 2025,
      amount: 60000,
      status: 'paid',
      dueDate: '2025-01-10',
      paidDate: '2025-01-09',
    },
    {
      id: '3',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      month: 'Февраль',
      year: 2025,
      amount: 50000,
      status: 'unpaid',
      dueDate: '2025-02-10',
    },
    {
      id: '4',
      courseId: '2',
      courseName: 'React Advanced',
      month: 'Февраль',
      year: 2025,
      amount: 60000,
      status: 'unpaid',
      dueDate: '2025-02-10',
    },
    {
      id: '5',
      courseId: '1',
      courseName: 'JavaScript Fundamentals',
      month: 'Декабрь',
      year: 2024,
      amount: 50000,
      status: 'overdue',
      dueDate: '2024-12-10',
    },
  ]

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Оплачен
          </span>
        )
      case 'unpaid':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Не оплачен
          </span>
        )
      case 'overdue':
        return (
          <span className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Просрочен
          </span>
        )
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalUnpaid = payments
    .filter(p => p.status === 'unpaid' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)

  const handlePayment = (paymentId: string) => {
    // TODO: Integrate with Kaspi Pay sandbox
    alert(`Переход к оплате через Kaspi Pay для платежа ${paymentId}`)
  }

  // Group payments by year
  const paymentsByYear = payments.reduce((acc, payment) => {
    if (!acc[payment.year]) {
      acc[payment.year] = []
    }
    acc[payment.year].push(payment)
    return acc
  }, {} as Record<number, Payment[]>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Оплата обучения</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">История платежей и управление оплатой</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Оплачено</h3>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">
            {formatAmount(totalPaid)}
          </p>
        </div>

        <div className="card bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">К оплате</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
            {formatAmount(totalUnpaid)}
          </p>
        </div>

        <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Всего платежей</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
            {payments.length}
          </p>
        </div>
      </div>

      {/* Payments by year */}
      {Object.keys(paymentsByYear)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => (
          <div key={year} className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{year} год</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Курс
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Месяц
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Сумма
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Срок оплаты
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Статус
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsByYear[Number(year)].map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {payment.courseName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700 dark:text-gray-300">{payment.month}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatAmount(payment.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(payment.dueDate).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </span>
                        {payment.paidDate && (
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Оплачено: {new Date(payment.paidDate).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-4 px-4 text-right">
                        {payment.status !== 'paid' && (
                          <button
                            onClick={() => handlePayment(payment.id)}
                            className={`btn-primary text-sm ${
                              payment.status === 'overdue'
                                ? 'bg-red-600 hover:bg-red-700'
                                : ''
                            }`}
                          >
                            Оплатить
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {/* Kaspi Pay info */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500 rounded-lg">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Оплата через Kaspi Pay
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Вы можете оплатить обучение удобным способом через Kaspi Pay. Платеж будет обработан мгновенно,
              и статус обновится автоматически.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
