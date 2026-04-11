import { useEffect, useState } from 'react'

interface Props {
  label: string
  value: number
  color: string
  delay?: number
}

const COLOR_GRADIENTS: Record<string, string> = {
  'bg-emerald-500': 'from-emerald-400 to-teal-500',
  'bg-blue-500':    'from-blue-400 to-primary-500',
  'bg-violet-500':  'from-violet-400 to-purple-500',
  'bg-amber-500':   'from-amber-400 to-orange-500',
  'bg-red-500':     'from-red-400 to-rose-500',
}

export default function AnimatedProgressBar({ label, value, color, delay = 0 }: Props) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 100)
    return () => clearTimeout(t)
  }, [value, delay])

  const gradient = COLOR_GRADIENTS[color] ?? 'from-primary-400 to-primary-600'

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums
                         bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
          {value}%
        </span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden
                      shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${gradient}
                       transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${width}%` }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-shimmer-light dark:bg-shimmer-dark
                          bg-[length:200%_100%] animate-shimmer opacity-60" />
        </div>
      </div>
    </div>
  )
}
