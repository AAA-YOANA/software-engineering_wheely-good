import { Calendar, MapPin, Clock, Battery, AlertCircle, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Trip {
  id: string;
  scooterImage: string;
  date: string;
  time: string;
  duration: string;
  distance: string;
  startLocation: string;
  endLocation: string;
  battery: number;
  cost: string;
  status: 'completed' | 'ongoing';
  route: { lat: number; lng: number }[];
}

const trips: Trip[] = [
  {
    id: '1',
    scooterImage: 'https://images.unsplash.com/photo-1583322319396-08178ea4f8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBtb2Rlcm58ZW58MXx8fHwxNzczMTU0Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2026年3月11日',
    time: '14:30',
    duration: '25分钟',
    distance: '3.2公里',
    startLocation: '中关村大街1号',
    endLocation: '五道口地铁站',
    battery: 85,
    cost: '¥6.50',
    status: 'ongoing',
    route: [
      { lat: 39.99, lng: 116.32 },
      { lat: 39.995, lng: 116.325 },
      { lat: 40.00, lng: 116.33 },
    ],
  },
  {
    id: '2',
    scooterImage: 'https://images.unsplash.com/photo-1609682243212-7b5d77f37ccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBibGFjayUyMHJlbnRhbHxlbnwxfHx8fDE3NzMyMzI3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2026年3月10日',
    time: '09:15',
    duration: '18分钟',
    distance: '2.1公里',
    startLocation: '望京SOHO',
    endLocation: '来广营地铁站',
    battery: 92,
    cost: '¥4.80',
    status: 'completed',
    route: [
      { lat: 40.00, lng: 116.47 },
      { lat: 40.005, lng: 116.475 },
      { lat: 40.01, lng: 116.48 },
    ],
  },
  {
    id: '3',
    scooterImage: 'https://images.unsplash.com/photo-1599486858190-a56a25d4616b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjB3aGl0ZSUyMHNoYXJpbmd8ZW58MXx8fHwxNzczMjMyNzQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2026年3月9日',
    time: '18:45',
    duration: '32分钟',
    distance: '4.5公里',
    startLocation: '国贸CBD',
    endLocation: '双井站',
    battery: 78,
    cost: '¥8.20',
    status: 'completed',
    route: [
      { lat: 39.91, lng: 116.46 },
      { lat: 39.905, lng: 116.455 },
      { lat: 39.90, lng: 116.45 },
    ],
  },
  {
    id: '4',
    scooterImage: 'https://images.unsplash.com/photo-1630865769389-e9bbb75306a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBibHVlJTIwdXJiYW58ZW58MXx8fHwxNzczMjMyNzQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '2026年3月8日',
    time: '16:20',
    duration: '22分钟',
    distance: '2.8公里',
    startLocation: '三里屯太古里',
    endLocation: '亮马桥',
    battery: 88,
    cost: '¥5.60',
    status: 'completed',
    route: [
      { lat: 39.94, lng: 116.45 },
      { lat: 39.945, lng: 116.455 },
      { lat: 39.95, lng: 116.46 },
    ],
  },
];

function RouteMap({ route }: { route: { lat: number; lng: number }[] }) {
  return (
    <svg className="w-full h-24" viewBox="0 0 200 80" preserveAspectRatio="none">
      <defs>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      
      {/* 背景网格 */}
      <rect x="0" y="0" width="200" height="80" fill="#f8fafc" rx="4" />
      <g stroke="#e2e8f0" strokeWidth="0.5">
        <line x1="0" y1="20" x2="200" y2="20" />
        <line x1="0" y1="40" x2="200" y2="40" />
        <line x1="0" y1="60" x2="200" y2="60" />
      </g>

      {/* 路径线 */}
      <polyline
        points={route.map((point, i) => {
          const x = (i / (route.length - 1)) * 180 + 10;
          const y = 40 + (Math.sin(i * 0.5) * 15);
          return `${x},${y}`;
        }).join(' ')}
        fill="none"
        stroke="url(#routeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* 起点 */}
      <circle cx="10" cy="40" r="4" fill="#3b82f6" />
      
      {/* 终点 */}
      <circle cx="190" cy="40" r="4" fill="#10b981" />
    </svg>
  );
}

export function TripTimeline() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">行程历史</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>最近30天</span>
        </div>
      </div>

      <div className="relative">
        {/* 时间轴线 */}
        <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500" />

        <div className="space-y-6">
          {trips.map((trip, index) => (
            <div key={trip.id} className="relative flex gap-6">
              {/* 时间轴圆点 */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-24 h-24 rounded-full p-1 ${
                  trip.status === 'ongoing' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 animate-pulse' 
                    : 'bg-gradient-to-br from-slate-300 to-slate-400'
                }`}>
                  <div className="w-full h-full rounded-full bg-white p-1">
                    <ImageWithFallback
                      src={trip.scooterImage}
                      alt={`滑板车 ${trip.id}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* 行程卡片 */}
              <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* 卡片头部 */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900">{trip.date}</div>
                        <div className="text-sm text-slate-500">{trip.time}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trip.status === 'ongoing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {trip.status === 'ongoing' ? '进行中' : '已完成'}
                    </div>
                  </div>
                </div>

                {/* 行程路径简图 */}
                <div className="p-4 bg-slate-50">
                  <RouteMap route={trip.route} />
                </div>

                {/* 行程详情 */}
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 mb-1">起点</div>
                      <div className="text-sm font-medium text-slate-900 truncate">{trip.startLocation}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 mb-1">终点</div>
                      <div className="text-sm font-medium text-slate-900 truncate">{trip.endLocation}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">时长/距离</div>
                      <div className="text-sm font-medium text-slate-900">{trip.duration} / {trip.distance}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Battery className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">电量/费用</div>
                      <div className="text-sm font-medium text-slate-900">{trip.battery}% / {trip.cost}</div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮区 */}
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex gap-3">
                    {trip.status === 'ongoing' ? (
                      <>
                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                          <Plus className="w-5 h-5" />
                          延长行程
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                          <AlertCircle className="w-5 h-5" />
                          上报故障
                        </button>
                      </>
                    ) : (
                      <button className="flex-1 border-2 border-slate-300 text-slate-600 py-3 px-4 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        上报问题
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
