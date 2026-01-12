import type { Task } from '../api/tasks'
import { priorityColor } from '../utils/styles'

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
      className={`p-3 rounded flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${isDragging ? 'opacity-50 border-2 border-dashed border-blue-500' : ''}`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => onEditingTitleChange(e.target.value)}
            className={`flex-1 p-1 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
          />
          <button
            onClick={onSaveEdit}
            className="text-green-500 hover:text-green-700 cursor-pointer"
          >
            Сохранить
          </button>
          <button
            onClick={onCancelEdit}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Отмена
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span
              draggable
              onDragStart={onDragStart}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              className="cursor-grab text-gray-400 hover:text-gray-600 select-none"
            >
              ⠿
            </span>
            <input
              type="checkbox"
              checked={task.done}
              onChange={onToggle}
              className={`cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
            />
            <span className={`w-2 h-2 rounded-full ${priorityColor(task.priority)}`} />
            <span
              className={`break-words max-w-[150px] ${task.done ? 'line-through text-gray-400' : ''}`}
            >
              {task.title}
            </span>
            {task.category && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                {task.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {task.deadline && (
              <span
                className={`text-sm ${isOverdue && !task.done ? 'text-red-500 font-bold' : 'text-gray-500'}`}
              >
                {task.deadline}
              </span>
            )}
            <button
              onClick={onStartEdit}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              Изменить
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              Удалить
            </button>
          </div>
        </>
      )}
    </li>
  )
}
