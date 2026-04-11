import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, CreditCard, TrendingDown } from 'lucide-react'
import api from '../../services/api'
import AnimatedStatCard from '../../components/common/AnimatedStatCard'
import { StatCardSkeleton, Skeleton } from '../../components/common/Skeleton'
import EmptyState from '../../components/common/EmptyState'

interface Payment {
  id: string
  courseId: string
  courseName: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  dueDate: string
  paidAt?: string
  periodMonth?: number
  periodYear?: number
}

const MONTH_NAMES = [
  '', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', minimumFractionDigits: 0 }).format(amount)

function PaymentRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-3.5 px-4"><Skeleton className="h-4 w-36 rounded" /></td>
      <td className="py-3.5 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
      <td className="py-3.5 px-4"><Skeleton className="h-4 w-24 rounded" /></td>
      <td className="py-3.5 px-4"><Skeleton className="h-4 w-24 rounded" /></td>
      <td className="py-3.5 px-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
    </tr>
  )
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Payment[]>('/student/payments')
      .then((res) => setPayments(res.data))
      .catch((err) => console.error('Failed to load payments:', err))
      .finally(() => setLoading(false))
  }, [])

  const totalPaid = payments.filter((p) => p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0)
  const totalUnpaid = payments.filter((p) => p.status !== 'COMPLETED').reduce((s, p) => s + p.amount, 0)
  const isOverdue = (p: Payment) => p.status !== 'COMPLETED' && new Date(p.dueDate) < new Date()

  const paymentsByYear = payments.reduce((acc, p) => {
    const year = p.periodYear ?? new Date(p.dueDate).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(p)
    return acc
  }, {} as Record<number, Payment[]>)

  const getMonthLabel = (p: Payment) =>
    p.periodMonth ? MONTH_NAMES[p.periodMonth] : new Date(p.dueDate).toLocaleDateString('ru-RU', { month: 'long' })

  const getStatusBadge = (status: Payment['status'], overdue: boolean) => {
    if (status === 'COMPLETED') return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" /> Оплачен
      </span>
    )
    if (overdue) return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
        <XCircle className="w-3.5 h-3.5" /> Просрочен
      </span>
    )
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
        <Clock className="w-3.5 h-3.5" /> Ожидает
      </span>
    )
  }

  const stats = [
    { label: 'Оплачено', value: formatAmount(totalPaid), icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'К оплате', value: formatAmount(totalUnpaid), icon: TrendingDown, bg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'Всего платежей', value: String(payments.length), icon: CreditCard, bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="animate-fadeSlideDown">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Оплата обучения</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">История платежей</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((s, i) => <AnimatedStatCard key={s.label} {...s} delay={i * 80} />)
        }
      </div>

      {loading ? (
        <div className="card animate-[fadeSlideUp_0.4s_0.2s_ease_both] opacity-0 [animation-fill-mode:forwards]">
          <Skeleton className="h-6 w-20 mb-4 rounded" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {['Курс', 'Месяц', 'Сумма', 'Срок', 'Статус'].map((h) => (
                    <th key={h} className="text-left py-3 px-4">
                      <Skeleton className="h-3 w-16 rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => <PaymentRowSkeleton key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      ) : payments.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={CreditCard}
            title="Платежей пока нет"
            description="История платежей появится после зачисления на курс"
          />
        </div>
      ) : (
        Object.keys(paymentsByYear)
          .sort((a, b) => Number(b) - Number(a))
          .map((year) => (
            <div key={year} className="card animate-[fadeSlideUp_0.4s_0.2s_ease_both] opacity-0 [animation-fill-mode:forwards]">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">{year}</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      {['Курс', 'Месяц', 'Сумма', 'Срок оплаты', 'Статус'].map((h) => (
                        <th key={h} className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsByYear[Number(year)].map((payment) => {
                      const overdue = isOverdue(payment)
                      return (
                        <tr
                          key={payment.id}
                          className={`border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                            overdue ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">{payment.courseName}</td>
                          <td className="py-3.5 px-4 text-sm text-gray-600 dark:text-gray-400">{getMonthLabel(payment)}</td>
                          <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{formatAmount(payment.amount)}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(payment.dueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                            </span>
                            {payment.paidAt && (
                              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                                ✓ {new Date(payment.paidAt).toLocaleDateString('ru-RU')}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">{getStatusBadge(payment.status, overdue)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
      )}
    </div>
  )
}
