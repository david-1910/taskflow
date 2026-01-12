import { buttonClass, smallButtonClass, inputClass } from '../utils/styles'

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
  return (
    <>
      {/* Фильтры по статусу */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => onFilterChange('all')} className={buttonClass(filter === 'all', darkMode)}>
          Все
        </button>
        <button onClick={() => onFilterChange('active')} className={buttonClass(filter === 'active', darkMode)}>
          Активные
        </button>
        <button onClick={() => onFilterChange('completed')} className={buttonClass(filter === 'completed', darkMode)}>
          Выполненные
        </button>
      </div>

      {/* Категории */}
      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="text-gray-500">Категории:</span>
          <button
            onClick={() => onCategoryChange(null)}
            className={smallButtonClass(filterCategory === null, darkMode)}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={smallButtonClass(filterCategory === cat, darkMode)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Поиск */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Поиск задач.."
        className={`flex-1 w-full mb-4 ${inputClass(darkMode)}`}
      />

      {/* Сортировка */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-gray-500">Сортировка:</span>
        <button onClick={() => onSortChange('default')} className={smallButtonClass(sortBy === 'default', darkMode)}>
          По умолчанию
        </button>
        <button onClick={() => onSortChange('date')} className={smallButtonClass(sortBy === 'date', darkMode)}>
          По дате
        </button>
        <button onClick={() => onSortChange('title')} className={smallButtonClass(sortBy === 'title', darkMode)}>
          По названию
        </button>
        <button onClick={() => onSortChange('priority')} className={smallButtonClass(sortBy === 'priority', darkMode)}>
          По приоритету
        </button>
      </div>
    </>
  )
}
