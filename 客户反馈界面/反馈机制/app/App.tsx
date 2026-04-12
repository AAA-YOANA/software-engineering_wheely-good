import { useState } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackHistory, type Feedback } from './components/FeedbackHistory';
import { AlertCircle } from 'lucide-react';

// 模拟历史数据
const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    type: 'battery-issue',
    typeLabel: '电池问题',
    description: '车辆电池电量显示异常，实际续航与显示不符。',
    images: [],
    status: 'resolved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    replies: [
      {
        id: 'r1',
        message: '您好，我们已经收到您的反馈。经过检测，电池管理系统已更新至最新版本，问题已解决。感谢您的反馈！',
        isAdmin: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: '2',
    type: 'vehicle-damage',
    typeLabel: '车辆损坏',
    description: '车辆右后视镜有刮痕，疑似在停车场被刮蹭。',
    images: [],
    status: 'processing',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    replies: [
      {
        id: 'r2',
        message: '感谢您的反馈，我们正在调取停车场监控录像，稍后会与您联系处理方案。',
        isAdmin: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ],
  },
];

export default function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedbacks);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (newFeedback: Omit<Feedback, 'id' | 'createdAt' | 'status' | 'replies'>) => {
    const feedback: Feedback = {
      ...newFeedback,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      replies: [],
    };

    setFeedbacks([feedback, ...feedbacks]);
    
    // 显示成功提示
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 页面头部 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">问题反馈中心</h1>
          <p className="text-gray-600">遇到问题？告诉我们，我们会尽快为您解决</p>
        </div>

        {/* 成功提示 */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="bg-green-500 rounded-full p-1">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-green-900">提交成功！</p>
              <p className="text-sm text-green-700">我们已收到您的反馈，将尽快处理。</p>
            </div>
          </div>
        )}

        {/* 反馈表单 */}
        <FeedbackForm onSubmit={handleSubmit} />

        {/* 历史记录 */}
        <FeedbackHistory feedbacks={feedbacks} />
      </div>
    </div>
  );
}
