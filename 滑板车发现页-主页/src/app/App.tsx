import { useState, useMemo } from 'react';
import { ScooterMap, type Scooter } from './components/ScooterMap';
import { ScooterList } from './components/ScooterList';
import { SearchBar, type FilterState } from './components/SearchBar';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

// 模拟滑板车数据
const MOCK_SCOOTERS: Scooter[] = [
  {
    id: 'SC-001',
    position: [39.9042, 116.4074],
    battery: 85,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1583322319396-08178ea4f8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBtb2Rlcm58ZW58MXx8fHwxNzczMTU0Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'SC-002',
    position: [39.9142, 116.4174],
    battery: 25,
    status: 'low-battery',
    image: 'https://images.unsplash.com/photo-1742078684146-43ad5c9a7388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGVsZWN0cmljJTIwc2Nvb3RlcnxlbnwxfHx8fDE3NzMxOTYwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'SC-003',
    position: [39.9092, 116.4124],
    battery: 60,
    status: 'in-use',
    image: 'https://images.unsplash.com/photo-1764003000916-b002dbcab88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY29vdGVyJTIwc2hhcmluZyUyMGJpa2V8ZW58MXx8fHwxNzczMTk2MDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'SC-004',
    position: [39.9002, 116.4024],
    battery: 95,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1629099580192-b8300533fc06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGtpY2slMjBzY29vdGVyfGVufDF8fHx8MTc3MzE5NjA1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'SC-005',
    position: [39.9082, 116.4154],
    battery: 72,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1583322319396-08178ea4f8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBtb2Rlcm58ZW58MXx8fHwxNzczMTU0Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'SC-006',
    position: [39.9122, 116.4094],
    battery: 45,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1742078684146-43ad5c9a7388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGVsZWN0cmljJTIwc2Nvb3RlcnxlbnwxfHx8fDE3NzMxOTYwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'SC-007',
    position: [39.9062, 116.4044],
    battery: 18,
    status: 'low-battery',
    image: 'https://images.unsplash.com/photo-1764003000916-b002dbcab88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY29vdGVyJTIwc2hhcmluZyUyMGJpa2V8ZW58MXx8fHwxNzczMTk2MDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'SC-008',
    position: [39.9152, 116.4134],
    battery: 88,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1629099580192-b8300533fc06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGtpY2slMjBzY29vdGVyfGVufDF8fHx8MTc3MzE5NjA1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export default function App() {
  const [selectedScooterId, setSelectedScooterId] = useState<string>();
  const [isListOpen, setIsListOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    minBattery: 0,
  });

  // 筛选滑板车
  const filteredScooters = useMemo(() => {
    return MOCK_SCOOTERS.filter((scooter) => {
      // 搜索筛选
      if (searchQuery && !scooter.id.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 状态筛选
      if (filters.status !== 'all' && scooter.status !== filters.status) {
        return false;
      }

      // 电量筛选
      if (scooter.battery < filters.minBattery) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const handleScooterClick = (scooter: Scooter) => {
    setSelectedScooterId(scooter.id);
    setIsListOpen(true);
  };

  const handleUnlock = (scooter: Scooter) => {
    if (scooter.status === 'in-use') {
      toast.error('此滑板车正在使用中');
      return;
    }

    toast.success(`成功解锁滑板车 ${scooter.id}`, {
      description: `电量: ${scooter.battery}% | 开始您的旅程吧！`,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-50">
      <Toaster position="top-center" richColors />
      
      {/* 地图 */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <ScooterMap
          scooters={filteredScooters}
          onScooterClick={handleScooterClick}
          selectedScooterId={selectedScooterId}
        />
      </div>

      {/* 搜索和筛选栏 */}
      <SearchBar onSearch={setSearchQuery} onFilterChange={setFilters} />

      {/* 滑板车列表侧边栏 */}
      <ScooterList
        scooters={filteredScooters}
        onUnlock={handleUnlock}
        selectedScooterId={selectedScooterId}
        onScooterSelect={handleScooterClick}
        isOpen={isListOpen}
        onToggle={() => setIsListOpen(!isListOpen)}
      />
    </div>
  );
}