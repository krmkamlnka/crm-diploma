import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, BookOpen, Sparkles, Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import api from '../../services/api'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface Enrollment {
  id: string
  courseId: string
  courseName: string
}

export default function AIAssistantPage() {
  const { t, i18n } = useTranslation()
  const dateLocale = i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-RU'
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('student.aiAssistant.greeting'),
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get<Enrollment[]>('/student/me/enrollments')
      .then((res) => {
        setEnrollments(res.data)
        if (res.data.length > 0) setSelectedEnrollmentId(res.data[0].id)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text || !selectedEnrollmentId || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const res = await api.post<{ reply: string }>(
        `/student/ai/chat?enrollmentId=${selectedEnrollmentId}`,
        { message: text }
      )
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: res.data.reply,
          sender: 'ai',
          timestamp: new Date(),
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: t('student.aiAssistant.error'),
          sender: 'ai',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const quickQuestions = [
    t('student.aiAssistant.q1'),
    t('student.aiAssistant.q2'),
    t('student.aiAssistant.q3'),
    t('student.aiAssistant.q4'),
  ]

  const selectedCourse = enrollments.find((e) => e.id === selectedEnrollmentId)

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between animate-[fadeSlideDown_0.4s_ease_both]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('student.aiAssistant.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {t('student.aiAssistant.subtitle')}
          </p>
        </div>

        {/* Course selector */}
        {enrollments.length > 1 && (
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={selectedEnrollmentId}
              onChange={(e) => {
                setSelectedEnrollmentId(e.target.value)
                setMessages([{
                  id: Date.now(),
                  text: t('student.aiAssistant.courseSelected'),
                  sender: 'ai',
                  timestamp: new Date(),
                }])
              }}
              className="input-field text-sm py-2 max-w-[220px]"
            >
              {enrollments.map((e) => (
                <option key={e.id} value={e.id}>{e.courseName}</option>
              ))}
            </select>
          </div>
        )}

        {enrollments.length === 1 && selectedCourse && (
          <div className="flex items-center gap-2 px-3 py-1.5
                          bg-primary-50 dark:bg-primary-900/20
                          border border-primary-100 dark:border-primary-800/50
                          rounded-xl text-sm">
            <BookOpen className="w-3.5 h-3.5 text-primary-500" />
            <span className="font-medium text-primary-700 dark:text-primary-400">{selectedCourse.courseName}</span>
          </div>
        )}
      </div>

      {/* Chat container */}
      <div className="card flex-1 flex flex-col min-h-0 p-0 overflow-hidden">

        {/* Top gradient accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent shrink-0" />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-[fadeSlideUp_0.3s_ease_both] ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
              style={{ animationDelay: `${idx * 20}ms` }}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                message.sender === 'ai'
                  ? 'bg-gradient-to-br from-primary-500 to-cyan-500'
                  : 'bg-gradient-to-br from-violet-500 to-purple-600'
              }`}>
                {message.sender === 'ai'
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-white" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                message.sender === 'ai'
                  ? 'bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                  : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm shadow-[0_4px_14px_rgba(14,165,233,0.35)]'
              }`}>
                {message.sender === 'ai' ? (
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none
                    prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0
                    prose-headings:my-2
                    prose-code:bg-gray-200 dark:prose-code:bg-gray-600/80
                    prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs
                    prose-pre:bg-gray-200 dark:prose-pre:bg-gray-700
                    prose-pre:p-3 prose-pre:rounded-xl prose-pre:text-xs">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                )}
                <p className={`text-[11px] mt-1.5 ${
                  message.sender === 'ai'
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-primary-100/80'
                }`}>
                  {message.timestamp.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-[fadeSlideUp_0.2s_ease_both]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60
                              rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions — shown only at start */}
        {messages.length === 1 && (
          <div className="px-5 pb-4 border-t border-gray-100/80 dark:border-gray-800/60 pt-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              {t('student.aiAssistant.quickQuestions')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInputText(q); inputRef.current?.focus() }}
                  className="text-left p-3
                             bg-primary-50/60 dark:bg-primary-900/15
                             hover:bg-primary-100 dark:hover:bg-primary-900/30
                             border border-primary-100 dark:border-primary-800/40
                             hover:border-primary-200 dark:hover:border-primary-700/60
                             text-primary-700 dark:text-primary-400
                             rounded-xl text-sm transition-all duration-200
                             hover:-translate-y-0.5 hover:shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100/80 dark:border-gray-800/60 flex gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={selectedEnrollmentId
                ? t('student.aiAssistant.placeholder')
                : t('student.aiAssistant.selectCourseFirst')
              }
              disabled={!selectedEnrollmentId || isLoading}
              className="input-field w-full pr-4 disabled:opacity-50"
            />
            {inputText && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                ↵
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || !selectedEnrollmentId || isLoading}
            className="flex items-center gap-2 px-5 py-2.5
                       bg-gradient-to-r from-primary-500 to-primary-600
                       hover:from-primary-600 hover:to-primary-700
                       text-white font-semibold text-sm rounded-xl
                       shadow-[0_4px_14px_rgba(14,165,233,0.4)]
                       hover:shadow-[0_6px_20px_rgba(14,165,233,0.5)]
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                       transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            {isLoading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Send className="w-4 h-4" />
            }
            <span className="hidden sm:inline">{t('student.aiAssistant.send')}</span>
          </button>
        </div>
      </div>

      {/* Powered by badge */}
      <div className="flex justify-center animate-[fadeSlideUp_0.5s_0.3s_ease_both] opacity-0 [animation-fill-mode:forwards]">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600">
          <Sparkles className="w-3 h-3" />
          {t('student.aiAssistant.poweredBy')}
        </div>
      </div>
    </div>
  )
}
