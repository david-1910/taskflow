import type { Task } from '../api/tasks'
import { priorityColor } from '../utils/styles'
import { FiEdit2, FiTrash2, FiCheck, FiX, FiCalendar, FiMoreVertical } from 'react-icons/fi'

interface TaskItemProps {
  task: Task
  darkMode: boolean
  isEditing: boolean
  editingTitle: string
  isDragging: boolean
  onToggle: () => void
  onDelete: () => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onEditingTitleChange: (title: string) => void
  onDragStart: (e: React.DragEvent) => void
  onDrag: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
  isOverdue: boolean
}

export function TaskItem({
  task,
  darkMode,
  isEditing,
  editingTitle,
  isDragging,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditingTitleChange,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragOver,
  onDrop,
  isOverdue,
}: TaskItemProps) {
  return (
    <li
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        backdrop-blur-lg rounded-xl p-4 border transition-all
        ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/10 border-white/20'}
        ${isDragging ? 'opacity-50 scale-95 border-slate-400 border-2' : ''}
        ${task.done ? 'opacity-60' : ''}
        hover:bg-white/20
      `}
    >
      {isEditing ? (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => onEditingTitleChange(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-400 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white/30 border-white/50 text-white placeholder-white/50'
            }`}
            autoFocus
          />
          <button
            onClick={onSaveEdit}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer transition-colors"
          >
            <FiCheck className="text-lg" />
          </button>
          <button
            onClick={onCancelEdit}
            className={`p-2 rounded-lg cursor-pointer transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <FiX className="text-lg" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Drag handle */}
            <span
              draggable
              onDragStart={onDragStart}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              className="cursor-grab text-white/50 hover:text-white/80 transition-colors"
            >
              <FiMoreVertical className="text-lg" />
            </span>

            {/* Checkbox */}
            <label className="relative cursor-pointer">
              <input
                type="checkbox"
                checked={task.done}
                onChange={onToggle}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                task.done
                  ? 'bg-slate-500 border-slate-500'
                  : darkMode
                    ? 'border-gray-500 hover:border-slate-400'
                    : 'border-white/50 hover:border-white'
              }`}>
                {task.done && <FiCheck className="text-white text-sm" />}
              </div>
            </label>

            {/* Priority dot */}
            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${priorityColor(task.priority)}`} />

            {/* Title */}
            <span className={`text-white truncate ${task.done ? 'line-through opacity-50' : ''}`}>
              {task.title}
            </span>

            {/* Category badge */}
            {task.category && (
              <span className={`px-2 py-1 text-xs rounded-lg flex-shrink-0 ${
                darkMode
                  ? 'bg-slate-600/30 text-slate-300'
                  : 'bg-white/30 text-white'
              }`}>
                {task.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Deadline */}
            {task.deadline && (
              <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg ${
                isOverdue && !task.done
                  ? 'bg-red-500/20 text-red-300'
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-white/70'
              }`}>
                <FiCalendar className="text-xs" />
                <span>{task.deadline}</span>
              </div>
            )}

            {/* Edit button */}
            <button
              onClick={onStartEdit}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-blue-400'
                  : 'hover:bg-white/20 text-white'
              }`}
            >
              <FiEdit2 className="text-lg" />
            </button>

            {/* Delete button */}
            <button
              onClick={onDelete}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-red-400'
                  : 'hover:bg-white/20 text-red-300'
              }`}
            >
              <FiTrash2 className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
