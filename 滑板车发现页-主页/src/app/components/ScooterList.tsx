import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScooterCard } from './ScooterCard';
import type { Scooter } from './ScooterMap';
import { useState } from 'react';

interface ScooterListProps {
  scooters: Scooter[];
  onUnlock: (scooter: Scooter) => void;
  selectedScooterId?: string;
  onScooterSelect: (scooter: Scooter) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ScooterList({
  scooters,
  onUnlock,
  selectedScooterId,
  onScooterSelect,
  isOpen,
  onToggle,
}: ScooterListProps) {
  return (
    <>
      {/* 侧边滑出面板 */}
      <div
        className={`
          fixed right-0 top-0 h-full w-96 z-[1000]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-white/30">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">附近滑板车</h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600">找到 {scooters.length} 辆滑板车</p>
        </div>

        {/* 滑板车列表 */}
        <div className="overflow-y-auto h-[calc(100%-120px)] p-4">
          {scooters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">没有找到滑板车</p>
              <p className="text-sm mt-2">尝试调整筛选条件</p>
            </div>
          ) : (
            scooters.map((scooter) => (
              <ScooterCard
                key={scooter.id}
                scooter={scooter}
                onUnlock={onUnlock}
                isSelected={scooter.id === selectedScooterId}
                onClick={() => onScooterSelect(scooter)}
              />
            ))
          )}
        </div>
      </div>

      {/* 切换按钮（当侧边栏关闭时显示） */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-[1000] p-4 rounded-l-2xl transition-all duration-300 hover:pr-6"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ChevronLeft size={24} className="text-gray-700" />
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {scooters.length}
          </div>
        </button>
      )}
    </>
  );
}
