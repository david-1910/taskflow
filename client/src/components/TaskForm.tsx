import { FiPlus, FiCalendar, FiFlag, FiTag } from 'react-icons/fi'

interface TaskFormProps {
  darkMode: boolean
  newTitle: string
  newDeadline: string
  newPriority: 'low' | 'medium' | 'high'
  newCategory: string
  onTitleChange: (title: string) => void
  onDeadlineChange: (deadline: string) => void
  onPriorityChange: (priority: 'low' | 'medium' | 'high') => void
  onCategoryChange: (category: string) => void
  onSubmit: () => void
}

export function TaskForm({
  darkMode,
  newTitle,
  newDeadline,
  newPriority,
  newCategory,
  onTitleChange,
  onDeadlineChange,
  onPriorityChange,
  onCategoryChange,
  onSubmit,
}: TaskFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSubmit()
  }

  const inputStyle = `
    px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-slate-400
    ${darkMode
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white/20 border-white/30 text-white placeholder-white/50'
    }
  `

  return (
    <div className="space-y-4">
      {/* Основной input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Что нужно сделать?"
          className={`flex-1 ${inputStyle}`}
        />
        <button
          onClick={onSubmit}
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
          <FiCalendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-white/50'}`} />
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => onDeadlineChange(e.target.value)}
            className={`w-full pl-10 ${inputStyle}`}
          />
        </div>

        {/* Приоритет */}
        <div className="relative flex-1 min-w-[140px]">
          <FiFlag className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-white/50'}`} />
          <select
            value={newPriority}
            onChange={(e) => onPriorityChange(e.target.value as 'low' | 'medium' | 'high')}
            className={`w-full pl-10 cursor-pointer appearance-none ${inputStyle}`}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        {/* Категория */}
        <div className="relative flex-1 min-w-[140px]">
          <FiTag className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-white/50'}`} />
          <input
            type="text"
            value={newCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="Категория"
            className={`w-full pl-10 ${inputStyle}`}
          />
        </div>
      </div>
    </div>
  )
}
