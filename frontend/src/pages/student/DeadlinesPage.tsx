import { useState, useEffect } from 'react'
import { Clock, CheckCircle2, XCircle, AlertTriangle, BookOpen, Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AnimatedStatCard from '../../components/common/AnimatedStatCard'
import api from '../../services/api'

// ── Types ──────────────────────────────────────────────────────────────────

type DeadlineStatus = 'pending' | 'submitted' | 'graded' | 'overdue'

interface Deadline {
  homeworkId: string
  courseTitle: string
  homeworkTitle: string
  dueDate: string       // ISO datetime string
  status: DeadlineStatus
  grade?: number
  maxGrade: number
  feedback?: string
  submittedAt?: string
  gradedAt?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const due = new Date(dateStr)
  const now = new Date()
  const diff = due.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const STATUS_ICONS: Record<DeadlineStatus, typeof CheckCircle2> = {
  pending: Clock,
  submitted: CheckCircle2,
  graded: CheckCircle2,
  overdue: XCircle,
}

const STATUS_BADGES: Record<DeadlineStatus, string> = {
  pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  submitted: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  graded: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  overdue: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
}

const STATUS_ICON_COLORS: Record<DeadlineStatus, string> = {
  pending: 'text-amber-500',
  submitted: 'text-blue-500',
  graded: 'text-emerald-500',
  overdue: 'text-red-500',
}

function urgencyStyle(days: number, status: DeadlineStatus): string {
  if (status === 'graded' || status === 'submitted') return ''
  if (status === 'overdue') return 'border-l-4 border-l-red-400'
  if (days <= 1) return 'border-l-4 border-l-red-400'
  if (days <= 3) return 'border-l-4 border-l-amber-400'
  return 'border-l-4 border-l-transparent'
}

type FilterKey = 'all' | 'pending' | 'submitted' | 'graded' | 'overdue'

// ── Page ──────────────────────────────────────────────────────────────────

export default function DeadlinesPage() {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    api.get<Deadline[]>('/student/deadlines')
      .then((res) => setDeadlines(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const pendingCount = deadlines.filter((d) => d.status === 'pending').length
  const overdueCount = deadlines.filter((d) => d.status === 'overdue').length
  const gradedCount = deadlines.filter((d) => d.status === 'graded').length

  const filtered = deadlines
    .filter((d) => filter === 'all' || d.status === filter)
    .sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1
      if (b.status === 'overdue' && a.status !== 'overdue') return 1
      if (a.status === 'graded' && b.status !== 'graded') return 1
      if (b.status === 'graded' && a.status !== 'graded') return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t('common.all') },
    { key: 'pending', label: t('student.deadlines.pending') },
    { key: 'submitted', label: t('student.deadlines.submitted') },
    { key: 'graded', label: t('student.deadlines.graded') },
    { key: 'overdue', label: t('student.deadlines.overdue') },
  ]

  return (
    <div className="space-y-6 animate-[fadeSlideDown_0.3s_ease_both]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('student.deadlines.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('student.deadlines.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedStatCard
          label={t('student.deadlines.pending')}
          value={`${pendingCount}`}
          icon={Clock}
          bg="bg-amber-50 dark:bg-amber-900/20"
          iconColor="text-amber-600 dark:text-amber-400"
          delay={0}
        />
        <AnimatedStatCard
          label={t('student.deadlines.overdue')}
          value={`${overdueCount}`}
          icon={AlertTriangle}
          bg="bg-red-50 dark:bg-red-900/20"
          iconColor="text-red-600 dark:text-red-400"
          delay={80}
        />
        <AnimatedStatCard
          label={t('student.deadlines.graded')}
          value={`${gradedCount}`}
          icon={CheckCircle2}
          bg="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
          delay={160}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400 mr-1" />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Deadline list */}
      <div className="space-y-3">
        {loading ? (
          <div className="card flex items-center justify-center py-14">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('student.deadlines.noPending')}</p>
          </div>
        ) : (
          filtered.map((d) => {
            const days = daysUntil(d.dueDate)
            const StatusIcon = STATUS_ICONS[d.status]
            const badge = STATUS_BADGES[d.status]
            const iconColor = STATUS_ICON_COLORS[d.status]
            const dueLabel =
              d.status === 'overdue' ? t('student.deadlines.daysAgo', { count: Math.abs(days) }) :
              d.status === 'graded' ? new Date(d.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) :
              days === 0 ? t('common.today') :
              days === 1 ? t('common.tomorrow') :
              t('common.inDays', { count: days })

            return (
              <div
                key={d.homeworkId}
                className={`card py-4 flex items-start gap-4 ${urgencyStyle(days, d.status)}`}
              >
                {/* Course icon */}
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{d.courseTitle}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5 leading-tight">{d.homeworkTitle}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>
                      <StatusIcon className={`w-3 h-3 ${iconColor}`} />
                      {t(`student.deadlines.${d.status}`)}
                    </span>

                    {/* Grade if graded */}
                    {d.status === 'graded' && d.grade !== undefined && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {d.grade}/{d.maxGrade}
                      </span>
                    )}

                    {/* Max grade */}
                    {d.status !== 'graded' && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">{t('student.deadlines.maxPoints', { count: d.maxGrade })}</span>
                    )}
                  </div>
                </div>

                {/* Due date */}
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold tabular-nums ${
                    d.status === 'overdue' ? 'text-red-500 dark:text-red-400' :
                    days <= 1 && d.status === 'pending' ? 'text-red-500 dark:text-red-400' :
                    days <= 3 && d.status === 'pending' ? 'text-amber-500 dark:text-amber-400' :
                    'text-gray-700 dark:text-gray-300'
                  }`}>
                    {dueLabel}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(d.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
