import { motion } from "motion/react";
import { Clock, Zap } from "lucide-react";

interface DurationOption {
  hours: number;
  label: string;
  popular?: boolean;
}

const durations: DurationOption[] = [
  { hours: 1, label: "1小时" },
  { hours: 2, label: "2小时", popular: true },
  { hours: 4, label: "4小时" },
  { hours: 8, label: "8小时" },
  { hours: 24, label: "全天" },
];

interface DurationSelectorProps {
  selected: number;
  onSelect: (hours: number) => void;
  pricePerHour: number;
}

export function DurationSelector({
  selected,
  onSelect,
  pricePerHour,
}: DurationSelectorProps) {
  return (
    <div className="relative">
      {/* 仪表盘背景 */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50">
        {/* 装饰性圆环 */}
        <div className="absolute top-4 right-4 w-24 h-24 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute top-6 right-6 w-16 h-16 border-2 border-blue-400/30 rounded-full" />

        {/* 标题 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl text-white font-semibold">选择租赁时长</h3>
            <p className="text-sm text-slate-400">
              基础价格: ¥{pricePerHour}/小时
            </p>
          </div>
        </div>

        {/* 时长选项网格 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {durations.map((duration) => {
            const isSelected = selected === duration.hours;
            const totalPrice = duration.hours * pricePerHour;
            const discount = duration.hours >= 8 ? 0.15 : duration.hours >= 4 ? 0.1 : 0;
            const finalPrice = totalPrice * (1 - discount);

            return (
              <motion.button
                key={duration.hours}
                onClick={() => onSelect(duration.hours)}
                className={`relative p-4 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"
                    : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {duration.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                )}

                <div className="text-center">
                  <div
                    className={`text-3xl mb-1 font-['Orbitron'] ${
                      isSelected ? "text-white" : "text-blue-400"
                    }`}
                  >
                    {duration.hours}
                  </div>
                  <div
                    className={`text-xs mb-2 ${
                      isSelected ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {duration.label}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    ¥{finalPrice.toFixed(0)}
                  </div>
                  {discount > 0 && (
                    <div className="text-xs text-green-400 mt-1">
                      省{(discount * 100).toFixed(0)}%
                    </div>
                  )}
                </div>

                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-white/50"
                    layoutId="selected-border"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>租赁4小时以上享受额外优惠</span>
        </div>
      </div>
    </div>
  );
}
