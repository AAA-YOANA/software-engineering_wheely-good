import { Search, SlidersHorizontal, Battery, Zap } from 'lucide-react';
import { useState } from 'react';
import type { ScooterStatus } from './ScooterMap';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  status: ScooterStatus | 'all';
  minBattery: number;
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    minBattery: 0,
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div
      className="absolute top-6 left-6 right-6 z-[1000]"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* 搜索栏 */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 flex items-center gap-3 bg-white/50 rounded-xl px-4 py-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="搜索滑板车 ID 或位置..."
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            p-3 rounded-xl transition-all duration-300
            ${showFilters ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-600 hover:bg-white/70'}
          `}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div className="border-t border-white/30 p-4 space-y-4">
          {/* 状态筛选 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Zap size={16} />
              滑板车状态
            </label>
            <div className="flex gap-2 mt-2">
              {[
                { value: 'all', label: '全部' },
                { value: 'available', label: '可用' },
                { value: 'low-battery', label: '低电量' },
                { value: 'in-use', label: '使用中' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('status', option.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${filters.status === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/70 text-gray-600 hover:bg-white'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 电量筛选 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Battery size={16} />
              最低电量: {filters.minBattery}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={filters.minBattery}
              onChange={(e) => handleFilterChange('minBattery', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${filters.minBattery}%, #e5e7eb ${filters.minBattery}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
