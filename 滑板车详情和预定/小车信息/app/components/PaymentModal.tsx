import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CreditCard,
  Smartphone,
  Wallet,
  Check,
  Loader2,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

type PaymentMethod = "wechat" | "alipay" | "card";

export function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("wechat");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: "wechat" as PaymentMethod,
      name: "微信支付",
      icon: Smartphone,
      color: "from-green-500 to-green-600",
    },
    {
      id: "alipay" as PaymentMethod,
      name: "支付宝",
      icon: Wallet,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "card" as PaymentMethod,
      name: "银行卡",
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 md:w-[480px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 z-50 overflow-hidden"
          >
            {/* 成功动画覆盖层 */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-green-600 z-50 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 15,
                      stiffness: 200,
                    }}
                  >
                    <div className="bg-white rounded-full p-6">
                      <Check className="w-16 h-16 text-green-600" />
                    </div>
                    <p className="text-white text-xl text-center mt-4">
                      支付成功！
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 头部 */}
            <div className="relative p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-white">确认支付</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* 金额显示 */}
              <div className="mt-6 text-center">
                <div className="text-sm text-slate-400 mb-2">支付金额</div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-baseline justify-center gap-2"
                >
                  <span className="text-2xl text-slate-300">¥</span>
                  <span className="text-5xl font-['Orbitron'] text-white">
                    {totalAmount.toFixed(2)}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* 支付方式选择 */}
            <div className="p-6">
              <h3 className="text-sm text-slate-400 mb-4">选择支付方式</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  const Icon = method.icon;

                  return (
                    <motion.button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`relative w-full p-4 rounded-2xl transition-all duration-300 ${
                        isSelected
                          ? "bg-slate-700/50 border-2 border-blue-500"
                          : "bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`bg-gradient-to-br ${method.color} p-3 rounded-xl`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white flex-1 text-left">
                          {method.name}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-blue-500 rounded-full p-1"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* 确认支付按钮 */}
              <motion.button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 disabled:shadow-none"
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    处理中...
                  </span>
                ) : (
                  "确认支付"
                )}
              </motion.button>

              {/* 安全提示 */}
              <div className="mt-4 text-center text-xs text-slate-400">
                <p>支付过程安全加密，请放心支付</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
