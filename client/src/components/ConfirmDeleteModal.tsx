interface ConfirmDeleteModalProps {
  darkMode: boolean
  onConfirm: () => void
  onCancel: () => void
}

const titleClass = (darkMode: boolean) =>
  `text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`

const textClass = (darkMode: boolean) =>
  `mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`

const secondaryButtonClass = (darkMode: boolean) =>
  `flex-1 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
    darkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
  }`

export function ConfirmDeleteModal({
  darkMode,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h3 className={titleClass(darkMode)}>Удалить задачу?</h3>
        <p className={textClass(darkMode)}>Это действие нельзя отменить</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className={secondaryButtonClass(darkMode)}>
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl cursor-pointer transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
