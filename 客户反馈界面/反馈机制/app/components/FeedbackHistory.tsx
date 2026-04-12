import { Clock, CheckCircle2, MessageCircle } from 'lucide-react';

export interface Feedback {
  id: string;
  type: string;
  typeLabel: string;
  description: string;
  images: string[];
  status: 'pending' | 'processing' | 'resolved';
  createdAt: Date;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date;
}

interface FeedbackHistoryProps {
  feedbacks: Feedback[];
}

export function FeedbackHistory({ feedbacks }: FeedbackHistoryProps) {
  const getStatusLabel = (status: string) => {
    const statusMap = {
      pending: '待处理',
      processing: '处理中',
      resolved: '已解决',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">暂无历史反馈记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">历史反馈</h2>
      
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            {/* 反馈头部 */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{feedback.typeLabel}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                    {getStatusLabel(feedback.status)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(feedback.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* 用户反馈内容 - 对话气泡样式 */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                <p className="text-sm leading-relaxed">{feedback.description}</p>
                {feedback.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {feedback.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`反馈图片 ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 管理员回复 */}
            {feedback.replies && feedback.replies.length > 0 && (
              <div className="space-y-3 pt-2">
                {feedback.replies.map((reply) => (
                  <div key={reply.id} className="flex justify-start">
                    <div className="max-w-[85%] bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">管理员回复</span>
                      </div>
                      <p className="text-sm leading-relaxed">{reply.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{formatDate(reply.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
