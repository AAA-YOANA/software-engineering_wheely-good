import { useState } from 'react';
import { IssueTypeSelector, issueTypes } from './IssueTypeSelector';
import { ImageUploader } from './ImageUploader';
import { Send } from 'lucide-react';
import type { Feedback } from './FeedbackHistory';

interface FeedbackFormProps {
  onSubmit: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'status' | 'replies'>) => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !description.trim()) {
      return;
    }

    setIsSubmitting(true);

    const typeLabel = issueTypes.find(t => t.id === selectedType)?.label || '';

    onSubmit({
      type: selectedType,
      typeLabel,
      description: description.trim(),
      images: [...images],
    });

    // 重置表单
    setSelectedType('');
    setDescription('');
    setImages([]);
    setIsSubmitting(false);
  };

  const isValid = selectedType && description.trim();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">提交问题反馈</h2>

      <IssueTypeSelector selectedType={selectedType} onSelect={setSelectedType} />

      <div className="space-y-3">
        <label htmlFor="description" className="block font-medium text-gray-900">
          问题描述
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="请详细描述您遇到的问题..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <ImageUploader images={images} onImagesChange={setImages} />

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
          ${isValid && !isSubmitting
            ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <Send className="w-5 h-5" />
        <span>{isSubmitting ? '提交中...' : '提交反馈'}</span>
      </button>
    </form>
  );
}
