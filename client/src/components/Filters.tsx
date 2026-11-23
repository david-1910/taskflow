import type { SortBy, StatusFilter } from '../types'
import { FiSearch, FiFilter, FiList } from 'react-icons/fi'

interface FiltersProps {
  darkMode: boolean
  filter: StatusFilter
  sortBy: SortBy
  searchQuery: string
  filterCategory: string | null
  categories: string[]
  onFilterChange: (filter: StatusFilter) => void
  onSortChange: (sort: SortBy) => void
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string | null) => void
}

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' },
]

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'date', label: 'По дате' },
  { value: 'title', label: 'По названию' },
  { value: 'priority', label: 'По приоритету' },
]

export function Filters({
  darkMode,
  filter,
  sortBy,
  searchQuery,
  filterCategory,
  categories,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onCategoryChange,
}: FiltersProps) {
  const chipStyle = (active: boolean, size: 'md' | 'sm') => `
    ${size === 'md' ? 'px-4 py-2 font-medium' : 'px-3 py-1 text-sm'}
    rounded-xl cursor-pointer transition-all
    ${
      active
        ? 'bg-slate-600 text-white'
        : darkMode
          ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
          : 'bg-white/10 text-white/70 hover:bg-white/20'
    }
  `

  const iconColor = darkMode ? 'text-gray-400' : 'text-white/50'

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="relative">
        <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg ${iconColor}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск задач..."
          className={`
            w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-slate-400
            ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white/20 border-white/30 text-white placeholder-white/50'
            }
          `}
        />
      </div>

      {/* Фильтры по статусу */}
      <div className="flex items-center gap-2">
        <FiFilter className={iconColor} />
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={chipStyle(filter === tab.value, 'md')}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Сортировка */}
      <div className="flex items-center gap-2">
        <FiList className={iconColor} />
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={chipStyle(sortBy === option.value, 'sm')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Категории */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm ${iconColor}`}>Категории:</span>
          <button
            onClick={() => onCategoryChange(null)}
            className={chipStyle(filterCategory === null, 'sm')}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={chipStyle(filterCategory === cat, 'sm')}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
