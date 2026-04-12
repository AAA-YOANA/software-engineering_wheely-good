import { WeeklyChart } from "./WeeklyChart";
import { TripTimeline } from "./TripTimeline";

export function TripHistory() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">我的行程</h1>
        <p className="text-slate-600">查看您的骑行历史与统计数据</p>
      </div>

      {/* 每周骑行时长图表 */}
      <WeeklyChart />

      {/* 行程时间轴 */}
      <TripTimeline />
    </div>
  );
}
