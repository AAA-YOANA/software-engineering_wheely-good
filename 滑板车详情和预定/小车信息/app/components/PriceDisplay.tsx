import { motion } from "motion/react";
import { Wallet, TrendingDown } from "lucide-react";

interface PriceDisplayProps {
  duration: number;
  pricePerHour: number;
}

export function PriceDisplay({ duration, pricePerHour }: PriceDisplayProps) {
  const basePrice = duration * pricePerHour;
  const discount = duration >= 8 ? 0.15 : duration >= 4 ? 0.1 : 0;
  const finalPrice = basePrice * (1 - discount);
  const savings = basePrice - finalPrice;

  return (
    <motion.div
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500/20 p-3 rounded-xl">
          <Wallet className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="text-xl text-white font-semibold">费用明细</h3>
      </div>

      {/* 价格详情 */}
      <div className="space-y-4">
        {/* 基础费用 */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">基础租金</span>
          <span className="text-slate-300">
            ¥{pricePerHour} × {duration}小时
          </span>
        </div>

        {/* 折扣信息 */}
        {discount > 0 && (
          <motion.div
            className="flex justify-between items-center bg-green-500/10 rounded-xl p-3 border border-green-500/20"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-green-400">时长优惠</span>
            </div>
            <span className="text-green-400">-¥{savings.toFixed(2)}</span>
          </motion.div>
        )}

        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">押金（可退）</span>
            <span className="text-slate-300">¥299</span>
          </div>
        </div>

        {/* 总价 */}
        <div className="border-t border-slate-600 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg text-white">应付总额</span>
            <motion.div
              key={finalPrice}
              initial={{ scale: 1.2, color: "#3b82f6" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.3 }}
              className="flex items-baseline gap-1"
            >
              <span className="text-sm text-slate-400">¥</span>
              <span className="text-3xl font-['Orbitron'] text-white">
                {(finalPrice + 299).toFixed(2)}
              </span>
            </motion.div>
          </div>
        </div>

        {/* 明细说明 */}
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>租金</span>
              <span>¥{finalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>押金</span>
              <span>¥299.00</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
