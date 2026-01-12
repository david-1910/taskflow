import { inputClass } from '../utils/styles'

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

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Новая задача..."
          className={`flex-1 ${inputClass(darkMode)}`}
        />
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          Добавить
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => onDeadlineChange(e.target.value)}
          className={inputClass(darkMode)}
        />
        <select
          value={newPriority}
          onChange={(e) => onPriorityChange(e.target.value as 'low' | 'medium' | 'high')}
          className={`cursor-pointer ${inputClass(darkMode)}`}
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="Категория..."
          className={inputClass(darkMode)}
        />
      </div>
    </div>
  )
}
