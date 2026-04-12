import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Feedback } from '../types/feedback';
import { FeedbackCard } from '../components/FeedbackCard';
import { FeedbackDetailDialog } from '../components/FeedbackDetailDialog';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Search, AlertTriangle } from 'lucide-react';

interface HighPriorityFeedbackProps {
  feedbackList: Feedback[];
  onUpdateFeedback: (id: string, updates: Partial<Feedback>) => void;
}

export function HighPriorityFeedback() {
  const { feedbackList, onUpdateFeedback } = useOutletContext<HighPriorityFeedbackProps>();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Feedback['status'] | 'all'>('all');

  // Filter only high priority feedback
  const highPriorityFeedback = feedbackList.filter((f) => f.priority === 'high');

  const filteredFeedback = highPriorityFeedback.filter((feedback) => {
    const matchesSearch =
      feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: highPriorityFeedback.length,
    pending: highPriorityFeedback.filter((f) => f.status === 'pending').length,
    inProgress: highPriorityFeedback.filter((f) => f.status === 'in-progress').length,
    resolved: highPriorityFeedback.filter((f) => f.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900">高优先级问题</h3>
          <p className="text-sm text-red-700 mt-1">
            以下是所有标记为高优先级的问题反馈，请优先处理这些问题以确保用户满意度。
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">总计</p>
          <p className="text-2xl font-bold text-red-700">{stats.total}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">待处理</p>
          <p className="text-2xl font-bold text-orange-700">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">处理中</p>
          <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">已解决</p>
          <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索标题、描述或用户名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="in-progress">处理中</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
              <SelectItem value="closed">已关闭</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(searchQuery || statusFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-sm text-gray-600">
              显示 {filteredFeedback.length} 条结果
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              清除筛选
            </Button>
          </div>
        )}
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            {highPriorityFeedback.length === 0 ? (
              <div>
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无高优先级问题</p>
                <p className="text-sm text-gray-400 mt-1">所有高优先级问题都已处理完毕</p>
              </div>
            ) : (
              <p className="text-gray-500">没有找到匹配的问题反馈</p>
            )}
          </div>
        ) : (
          filteredFeedback.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onViewDetails={setSelectedFeedback}
            />
          ))
        )}
      </div>

      {/* Detail Dialog */}
      <FeedbackDetailDialog
        feedback={selectedFeedback}
        open={!!selectedFeedback}
        onOpenChange={(open) => !open && setSelectedFeedback(null)}
        onUpdate={onUpdateFeedback}
      />
    </div>
  );
}