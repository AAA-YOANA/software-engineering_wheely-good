import { useState } from "react";
import { motion } from "motion/react";
import { ScooterCarousel } from "./components/ScooterCarousel";
import { DurationSelector } from "./components/DurationSelector";
import { PriceDisplay } from "./components/PriceDisplay";
import { PaymentModal } from "./components/PaymentModal";
import {
  Battery,
  Gauge,
  MapPin,
  Star,
  Users,
  Shield,
  Zap,
} from "lucide-react";

const scooterImages = [
  "https://images.unsplash.com/photo-1583322319396-08178ea4f8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBtb2Rlcm58ZW58MXx8fHwxNzczMTU0Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1623079400394-f07956928c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY29vdGVyJTIwZGV0YWlsJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzMxOTY5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1723403067433-73299460534a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY29vdGVyJTIwd2hlZWwlMjBjbG9zZXxlbnwxfHx8fDE3NzMxOTY5NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1713254249770-7e9a688064d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBjaXR5fGVufDF8fHx8MTc3MzE0Nzk2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

function App() {
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const pricePerHour = 25;
  const basePrice = selectedDuration * pricePerHour;
  const discount =
    selectedDuration >= 8 ? 0.15 : selectedDuration >= 4 ? 0.1 : 0;
  const finalPrice = basePrice * (1 - discount);
  const totalAmount = finalPrice + 299; // 含押金

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 顶部轮播 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ScooterCarousel images={scooterImages} />
        </motion.div>

        {/* 产品信息区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl text-white">
                    WheelyGood
                  </h1>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full">
                    <span className="text-sm text-white flex items-center gap-1">
                      <Star className="w-4 h-4 fill-white" />
                      4.9
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-lg mb-6">
                  续航强劲 • 智能科技 • 安全可靠
                </p>

                {/* 特性标签 */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-xl border border-blue-500/30">
                    <Battery className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300">续航60km</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30">
                    <Gauge className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300">最高35km/h</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/30">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">智能防护</span>
                  </div>
                </div>
              </div>

              {/* 位置与使用信息 */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span className="text-white">当前位置</span>
                </div>
                <p className="text-slate-300 mb-4">人民广场站点 A03</p>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>今日已被租用 28 次</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 核心选择区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2">
            <DurationSelector
              selected={selectedDuration}
              onSelect={setSelectedDuration}
              pricePerHour={pricePerHour}
            />
          </div>

          <div className="md:col-span-1">
            <PriceDisplay
              duration={selectedDuration}
              pricePerHour={pricePerHour}
            />
          </div>
        </motion.div>

        {/* 额外信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50 mb-24"
        >
          <h3 className="text-xl text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            为什么选择我们
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white mb-2">安全保障</h4>
              <p className="text-sm text-slate-400">
                专业维护团队定期检修，配备完善的保险体系
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Battery className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white mb-2">电量充足</h4>
              <p className="text-sm text-slate-400">
                智能电池管理，实时显示剩余电量，无忧出行
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white mb-2">随借随还</h4>
              <p className="text-sm text-slate-400">
                市内50+站点，方便快捷，支持异地还车
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 底部浮动按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent backdrop-blur-lg border-t border-slate-700/50 p-4 z-30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.button
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* 滑板车图标 */}
            <svg
              className="w-8 h-8 text-white group-hover:animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="19" r="2" />
              <circle cx="18" cy="19" r="2" />
              <path d="M6 19h12" />
              <path d="M12 17V7l5-3" />
              <path d="M17 4v3" />
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-lg">确认预订</span>
              <span className="text-sm text-blue-100">
                {selectedDuration}小时 · ¥{totalAmount.toFixed(2)}
              </span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* 支付弹窗 */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalAmount}
      />
    </div>
  );
}

export default App;