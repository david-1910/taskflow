export const buttonClass = (isActive: boolean, darkMode: boolean) =>
  `px-3 py-1 rounded cursor-pointer ${isActive ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`

export const smallButtonClass = (isActive: boolean, darkMode: boolean) =>
  `px-2 py-1 rounded text-sm cursor-pointer ${isActive ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`

export const inputClass = (darkMode: boolean) =>
  `p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`

export const priorityColor = (priority: 'low' | 'medium' | 'high') => {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  }
  return colors[priority]
}
