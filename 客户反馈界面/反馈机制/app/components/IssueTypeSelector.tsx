import { Car, Battery, AlertTriangle, MessageSquare } from 'lucide-react';

export interface IssueType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const issueTypes: IssueType[] = [
  { id: 'vehicle-damage', label: '车辆损坏', icon: Car },
  { id: 'battery-issue', label: '电池问题', icon: Battery },
  { id: 'system-fault', label: '系统故障', icon: AlertTriangle },
  { id: 'other', label: '其他问题', icon: MessageSquare },
];

interface IssueTypeSelectorProps {
  selectedType: string;
  onSelect: (typeId: string) => void;
}

export function IssueTypeSelector({ selectedType, onSelect }: IssueTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block font-medium text-gray-900">问题类型</label>
      <div className="grid grid-cols-2 gap-3">
        {issueTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              className={`
                flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
              <span className="font-medium text-sm">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
