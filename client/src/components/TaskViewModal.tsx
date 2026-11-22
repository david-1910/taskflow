import type { Task } from '../types'
import { priorityBadgeClass, priorityColor, priorityLabel } from '../utils/styles'

interface TaskViewModalProps {
  task: Task
  darkMode: boolean
  isOverdue: (deadline: string | null) => boolean
  onEdit: (task: Task) => void
  onClose: () => void
}

export function TaskViewModal({
  task,
  darkMode,
  isOverdue,
  onEdit,
  onClose,
}: TaskViewModalProps) {
  const surfaceClass = darkMode ? 'bg-gray-700' : 'bg-gray-100'
  const labelClass = 'text-sm font-medium'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`w-4 h-4 rounded-full ${priorityColor(task.priority)}`} />
            <span className={`text-sm px-2 py-1 rounded ${priorityBadgeClass(task.priority)}`}>
              {priorityLabel[task.priority]}
            </span>
            {task.done && (
              <span className="text-sm px-2 py-1 rounded bg-slate-100 text-slate-700">
                Выполнено
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg cursor-pointer transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            ✕
          </button>
        </div>

        <h3
          className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          } ${task.done ? 'line-through opacity-50' : ''}`}
        >
          {task.title}
        </h3>

        <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {task.category && (
            <div className="flex items-center gap-2">
              <span className={labelClass}>Категория:</span>
              <span className={`px-2 py-1 text-sm rounded ${surfaceClass}`}>
                {task.category}
              </span>
            </div>
          )}

          {task.deadline && (
            <div className="flex items-center gap-2">
              <span className={labelClass}>Дедлайн:</span>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  isOverdue(task.deadline) && !task.done
                    ? 'bg-red-100 text-red-700'
                    : surfaceClass
                }`}
              >
                {task.deadline}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onEdit(task)}
            className={`flex-1 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            Редактировать
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl cursor-pointer transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
