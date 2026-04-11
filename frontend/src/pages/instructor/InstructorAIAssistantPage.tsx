import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import api from '../../services/api'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface Course {
  id: string
  name: string
}

export default function InstructorAIAssistantPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Я ваш AI-помощник. Выберите курс выше, и я смогу помогать вам анализировать успеваемость студентов, выявлять отстающих и давать рекомендации.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<{ content: Course[] }>('/instructor/courses')
      .then((res) => {
        const list = res.data.content ?? (res.data as unknown as Course[])
        setCourses(list)
        if (list.length > 0) setSelectedCourseId(list[0].id)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text || !selectedCourseId || isLoading) return

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
        `/instructor/ai/chat?courseId=${selectedCourseId}`,
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
          text: 'Произошла ошибка при обращении к AI. Попробуйте ещё раз.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    'Кто из студентов отстаёт по успеваемости?',
    'Какова средняя посещаемость по курсу?',
    'Кому из студентов нужна дополнительная помощь?',
    'Дай общий анализ успеваемости группы',
  ]

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-4 animate-fadeSlideDown">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Ассистент</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Анализ успеваемости студентов с помощью AI</p>
      </div>

      {/* Course selector */}
      {courses.length > 1 && (
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value)
              setMessages([{
                id: Date.now(),
                text: 'Курс выбран. Задавайте вопросы о студентах и успеваемости!',
                sender: 'ai',
                timestamp: new Date(),
              }])
            }}
            className="input-field max-w-xs"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {courses.length === 1 && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <BookOpen className="w-4 h-4" />
          <span>Курс: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedCourse?.name}</span></span>
        </div>
      )}

      <div className="card flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'ai'
                    ? 'bg-violet-100 dark:bg-violet-900/30'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {message.sender === 'ai' ? (
                  <Bot className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                ) : (
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.sender === 'ai'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'bg-violet-600 text-white'
                }`}
              >
                {message.sender === 'ai' ? (
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none
                    prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0
                    prose-headings:my-2 prose-code:bg-gray-200 dark:prose-code:bg-gray-600
                    prose-code:px-1 prose-code:rounded prose-pre:bg-gray-200
                    dark:prose-pre:bg-gray-600 prose-pre:p-3 prose-pre:rounded-lg">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                )}
                <p className={`text-xs mt-1 ${
                  message.sender === 'ai'
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-violet-200'
                }`}>
                  {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions — shown at start */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Быстрые вопросы:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(q)}
                  className="text-left p-3 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-400 rounded-xl text-sm transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={selectedCourseId ? 'Задайте вопрос о студентах...' : 'Выберите курс для начала...'}
            disabled={!selectedCourseId || isLoading}
            className="input-field flex-1 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || !selectedCourseId || isLoading}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Отправить</span>
          </button>
        </div>
      </div>
    </div>
  )
}
