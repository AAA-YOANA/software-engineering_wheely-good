import { Feedback } from '../types/feedback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
  onViewDetails: (feedback: Feedback) => void;
}

export function FeedbackCard({ feedback, onViewDetails }: FeedbackCardProps) {
  const getStatusIcon = (status: Feedback['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'closed':
        return <CheckCircle2 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: Feedback['status']) => {
    switch (status) {
      case 'resolved':
        return '已解决';
      case 'in-progress':
        return '处理中';
      case 'pending':
        return '待处理';
      case 'closed':
        return '已关闭';
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'pending':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getPriorityColor = (priority: Feedback['priority']) => {
    return priority === 'high' 
      ? 'bg-red-100 text-red-800 hover:bg-red-100' 
      : 'bg-gray-100 text-gray-600 hover:bg-gray-100';
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold truncate">{feedback.title}</h3>
            {feedback.adminReply && (
              <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {feedback.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {getStatusIcon(feedback.status)}
              <Badge variant="secondary" className={getStatusColor(feedback.status)}>
                {getStatusText(feedback.status)}
              </Badge>
            </div>
            
            <Badge variant="secondary" className={getPriorityColor(feedback.priority)}>
              {feedback.priority === 'high' ? '高优先级' : '低优先级'}
            </Badge>
            
            <Badge variant="outline">{feedback.category}</Badge>
            
            <span className="text-gray-500">
              {feedback.userName}
            </span>
            
            <span className="text-gray-400">
              {feedback.createdAt.toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(feedback)}
          className="flex-shrink-0"
        >
          查看详情
        </Button>
      </div>
    </Card>
  );
}
