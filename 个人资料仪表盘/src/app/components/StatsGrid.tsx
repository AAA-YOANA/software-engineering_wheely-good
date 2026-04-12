import React from 'react';
import { TrendingUp, Clock, Zap, Trophy } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  trend?: number;
}

function StatCard({ icon, label, value, subtext, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="bg-blue-50 rounded-xl p-3 text-blue-600">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </div>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Zap className="w-6 h-6" />}
        label="本周骑行"
        value="23.5 km"
        trend={12}
      />
      <StatCard
        icon={<Clock className="w-6 h-6" />}
        label="总骑行时长"
        value="48.2 小时"
        subtext="过去30天"
      />
      <StatCard
        icon={<Trophy className="w-6 h-6" />}
        label="完成订单"
        value="156"
        trend={8}
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="平均速度"
        value="18.5 km/h"
        trend={-3}
      />
    </div>
  );
}
