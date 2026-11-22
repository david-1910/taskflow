import type { Priority } from '../types'

export const buttonClass = (isActive: boolean, darkMode: boolean) =>
  `px-3 py-1 rounded cursor-pointer ${isActive ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`

export const smallButtonClass = (isActive: boolean, darkMode: boolean) =>
  `px-2 py-1 rounded text-sm cursor-pointer ${isActive ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`

export const inputClass = (darkMode: boolean) =>
  `p-2 border rounded ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`

export const priorityColor = (priority: Priority) => {
  const colors: Record<Priority, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  }
  return colors[priority]
}

export const priorityLabel: Record<Priority, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
}

/** Tailwind classes for a priority badge (light/dark aware) */
export const priorityBadgeClass = (priority: Priority) => {
  const badges: Record<Priority, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }
  return badges[priority]
}

/** Shared card/panel surface styles used across the app */
export const cardClass = (darkMode: boolean) =>
  `backdrop-blur-lg rounded-2xl border ${
    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/20 border-white/30'
  }`

/** App-wide background (used by auth screen, loading & error states too) */
export const appBackgroundClass = (darkMode: boolean) =>
  `min-h-screen transition-colors duration-300 ${
    darkMode
      ? 'bg-gray-900'
      : 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600'
  }`
