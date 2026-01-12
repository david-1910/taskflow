import { FiSearch, FiFilter, FiList } from 'react-icons/fi'

interface FiltersProps {
  darkMode: boolean
  filter: 'all' | 'active' | 'completed'
  sortBy: 'default' | 'date' | 'title' | 'priority'
  searchQuery: string
  filterCategory: string | null
  categories: string[]
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void
  onSortChange: (sort: 'default' | 'date' | 'title' | 'priority') => void
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string | null) => void
}

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
  const tabStyle = (active: boolean) => `
    px-4 py-2 rounded-xl cursor-pointer transition-all font-medium
    ${active
      ? 'bg-slate-600 text-white'
      : darkMode
        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
        : 'bg-white/10 text-white/70 hover:bg-white/20'
    }
  `

  const chipStyle = (active: boolean) => `
    px-3 py-1 rounded-lg cursor-pointer transition-all text-sm
    ${active
      ? 'bg-slate-600 text-white'
      : darkMode
        ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
        : 'bg-white/10 text-white/60 hover:bg-white/20'
    }
  `

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="relative">
        <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg ${darkMode ? 'text-gray-400' : 'text-white/50'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск задач..."
          className={`
            w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-slate-400
            ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white/20 border-white/30 text-white placeholder-white/50'
            }
          `}
        />
      </div>

      {/* Фильтры по статусу */}
      <div className="flex items-center gap-2">
        <FiFilter className={`${darkMode ? 'text-gray-400' : 'text-white/50'}`} />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onFilterChange('all')} className={tabStyle(filter === 'all')}>
            Все
          </button>
          <button onClick={() => onFilterChange('active')} className={tabStyle(filter === 'active')}>
            Активные
          </button>
          <button onClick={() => onFilterChange('completed')} className={tabStyle(filter === 'completed')}>
            Выполненные
          </button>
        </div>
      </div>

      {/* Сортировка */}
      <div className="flex items-center gap-2">
        <FiList className={`${darkMode ? 'text-gray-400' : 'text-white/50'}`} />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onSortChange('default')} className={chipStyle(sortBy === 'default')}>
            По умолчанию
          </button>
          <button onClick={() => onSortChange('date')} className={chipStyle(sortBy === 'date')}>
            По дате
          </button>
          <button onClick={() => onSortChange('title')} className={chipStyle(sortBy === 'title')}>
            По названию
          </button>
          <button onClick={() => onSortChange('priority')} className={chipStyle(sortBy === 'priority')}>
            По приоритету
          </button>
        </div>
      </div>

      {/* Категории */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-white/50'}`}>Категории:</span>
          <button
            onClick={() => onCategoryChange(null)}
            className={chipStyle(filterCategory === null)}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={chipStyle(filterCategory === cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
