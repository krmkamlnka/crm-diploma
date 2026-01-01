import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Я ваш AI ассистент. Могу помочь с вопросами по курсам, объяснить сложные темы или дать рекомендации по обучению. Чем могу помочь?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputText('')

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: 'Это демо-ответ AI ассистента. В реальной версии здесь будет интеграция с AI для персональных рекомендаций и помощи по обучению.',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const quickQuestions = [
    'Объясни разницу между let и const',
    'Как работает async/await?',
    'Что такое React hooks?',
    'Помоги подготовиться к следующему занятию',
  ]

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Ассистент</h1>
        <p className="text-gray-600 mt-2">Персональный помощник по обучению</p>
      </div>

      <div className="card flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'ai' ? 'bg-primary-100' : 'bg-gray-200'
                }`}
              >
                {message.sender === 'ai' ? (
                  <Bot className="w-5 h-5 text-primary-600" />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'ai'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-primary-500 text-white'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender === 'ai' ? 'text-gray-500' : 'text-primary-100'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Быстрые вопросы:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(question)}
                  className="text-left p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Задайте ваш вопрос..."
            className="input-field flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>Отправить</span>
          </button>
        </div>
      </div>
    </div>
  )
}
