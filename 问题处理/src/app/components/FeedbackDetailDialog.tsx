import { useState } from 'react';
import { Feedback, FeedbackPriority, FeedbackStatus } from '../types/feedback';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { AlertCircle, CheckCircle2, Clock, Mail, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackDetailDialogProps {
  feedback: Feedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Feedback>) => void;
}

export function FeedbackDetailDialog({
  feedback,
  open,
  onOpenChange,
  onUpdate,
}: FeedbackDetailDialogProps) {
  const [status, setStatus] = useState<FeedbackStatus>(feedback?.status || 'pending');
  const [priority, setPriority] = useState<FeedbackPriority>(feedback?.priority || 'low');
  const [reply, setReply] = useState(feedback?.adminReply || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!feedback) return null;

  const handleSave = () => {
    onUpdate(feedback.id, {
      status,
      priority,
      adminReply: reply || undefined,
      updatedAt: new Date(),
    });
    setIsEditing(false);
    toast.success('更新成功', {
      description: '问题信息已成功更新',
    });
  };

  const handleCancel = () => {
    setStatus(feedback.status);
    setPriority(feedback.priority);
    setReply(feedback.adminReply || '');
    setIsEditing(false);
  };

  const getStatusIcon = (status: FeedbackStatus) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'closed':
        return <CheckCircle2 className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(feedback.status)}
            {feedback.title}
          </DialogTitle>
          <DialogDescription>
            问题 ID: {feedback.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">提交用户</p>
                <p className="font-medium">{feedback.userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">邮箱</p>
                <p className="font-medium text-sm">{feedback.userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">提交时间</p>
                <p className="font-medium text-sm">
                  {feedback.createdAt.toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">更新时间</p>
                <p className="font-medium text-sm">
                  {feedback.updatedAt.toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <Label className="text-base">问题描述</Label>
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {feedback.description}
            </p>
          </div>

          {/* Category Badge */}
          <div>
            <Label className="text-base">分类</Label>
            <div className="mt-2">
              <Badge variant="outline">{feedback.category}</Badge>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">状态</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value as FeedbackStatus);
                  setIsEditing(true);
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="in-progress">处理中</SelectItem>
                  <SelectItem value="resolved">已解决</SelectItem>
                  <SelectItem value="closed">已关闭</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">优先级</Label>
              <Select
                value={priority}
                onValueChange={(value) => {
                  setPriority(value as FeedbackPriority);
                  setIsEditing(true);
                }}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高优先级</SelectItem>
                  <SelectItem value="low">低优先级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Admin Reply */}
          <div>
            <Label htmlFor="reply">管理员回复</Label>
            <Textarea
              id="reply"
              placeholder="输入回复内容（选填）"
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
                setIsEditing(true);
              }}
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  保存更改
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                关闭
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
