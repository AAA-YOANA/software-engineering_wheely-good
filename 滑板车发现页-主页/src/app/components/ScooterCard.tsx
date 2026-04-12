import { Battery, Lock, MapPin } from 'lucide-react';
import type { Scooter } from './ScooterMap';

interface ScooterCardProps {
  scooter: Scooter;
  onUnlock: (scooter: Scooter) => void;
  isSelected: boolean;
  onClick: () => void;
}

export function ScooterCard({ scooter, onUnlock, isSelected, onClick }: ScooterCardProps) {
  const getBatteryColor = (battery: number) => {
    if (battery >= 60) return '#10b981';
    if (battery >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusText = () => {
    switch (scooter.status) {
      case 'available':
        return '可用';
      case 'low-battery':
        return '低电量';
      case 'in-use':
        return '使用中';
    }
  };

  const getStatusColor = () => {
    switch (scooter.status) {
      case 'available':
        return 'text-emerald-600';
      case 'low-battery':
        return 'text-amber-600';
      case 'in-use':
        return 'text-gray-600';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl mb-3 cursor-pointer
        transition-all duration-300 hover:scale-[1.02]
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* 滑板车图片 */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={scooter.image}
          alt={`Scooter ${scooter.id}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm">
          <span className={getStatusColor()}>{getStatusText()}</span>
        </div>
      </div>

      {/* 滑板车信息 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} className="text-gray-500" />
              <h3 className="font-semibold text-gray-900">ID: {scooter.id}</h3>
            </div>
          </div>
        </div>

        {/* 电量显示 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Battery size={18} className="text-gray-600" />
              <span className="text-sm text-gray-600">电量</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: getBatteryColor(scooter.battery) }}>
              {scooter.battery}%
            </span>
          </div>
          
          {/* 电量条 */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
              style={{
                width: `${scooter.battery}%`,
                background: getBatteryColor(scooter.battery),
              }}
            />
          </div>
        </div>

        {/* 解锁按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnlock(scooter);
          }}
          disabled={scooter.status === 'in-use'}
          className={`
            w-full py-3 px-4 rounded-xl font-medium
            flex items-center justify-center gap-2
            transition-all duration-300
            ${scooter.status === 'in-use'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
            }
          `}
        >
          <Lock size={18} />
          <span>{scooter.status === 'in-use' ? '使用中' : '立即解锁'}</span>
        </button>
      </div>
    </div>
  );
}
