import { useState } from 'react'
import type { NewTask, Priority } from '../types'
import { FiPlus, FiCalendar, FiFlag, FiTag } from 'react-icons/fi'

interface TaskFormProps {
  darkMode: boolean
  onSubmit: (task: NewTask) => void
}

const DEFAULT_DRAFT: NewTask = {
  title: '',
  deadline: null,
  priority: 'medium',
  category: null,
}

const emptyDraft = { ...DEFAULT_DRAFT }

export function TaskForm({ darkMode, onSubmit }: TaskFormProps) {
  const [draft, setDraft] = useState<NewTask>(emptyDraft)

  const patch = (changes: Partial<NewTask>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  const submit = () => {
    if (!draft.title.trim()) return
    onSubmit(draft)
    setDraft(emptyDraft)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit()
  }

  const inputStyle = `
    px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-slate-400
    ${
      darkMode
        ? 'bg-gray-700 border-gray-600 text-white'
        : 'bg-white/20 border-white/30 text-white placeholder-white/50'
    }
  `

  const iconStyle = darkMode ? 'text-gray-400' : 'text-white/50'

  return (
    <div className="space-y-4">
      {/* Основной input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="Что нужно сделать?"
          className={`flex-1 ${inputStyle}`}
        />
        <button
          onClick={submit}
          className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl cursor-pointer transition-colors flex items-center gap-2 font-medium"
        >
          <FiPlus className="text-lg" />
          <span>Добавить</span>
        </button>
      </div>

      {/* Дополнительные поля */}
      <div className="flex gap-3 flex-wrap">
        {/* Дата */}
        <div className="relative flex-1 min-w-[140px]">
          <FiCalendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconStyle}`} />
          <input
            type="date"
            value={draft.deadline ?? ''}
            onChange={(e) => patch({ deadline: e.target.value || null })}
            className={`w-full pl-10 ${inputStyle}`}
          />
        </div>

        {/* Приоритет */}
        <div className="relative flex-1 min-w-[140px]">
          <FiFlag className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconStyle}`} />
          <select
            value={draft.priority}
            onChange={(e) => patch({ priority: e.target.value as Priority })}
            className={`w-full pl-10 cursor-pointer appearance-none ${inputStyle}`}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        {/* Категория */}
        <div className="relative flex-1 min-w-[140px]">
          <FiTag className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconStyle}`} />
          <input
            type="text"
            value={draft.category ?? ''}
            onChange={(e) => patch({ category: e.target.value || null })}
            placeholder="Категория"
            className={`w-full pl-10 ${inputStyle}`}
          />
        </div>
      </div>
    </div>
  )
}
