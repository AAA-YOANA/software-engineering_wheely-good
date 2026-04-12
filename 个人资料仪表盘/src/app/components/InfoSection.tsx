import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, ChevronRight } from 'lucide-react';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
  onClick?: () => void;
}

function InfoItem({ icon, label, value, editable = false, onClick }: InfoItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors ${
        editable ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-400">
          {icon}
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">{label}</div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
        </div>
      </div>
      {editable && (
        <div className="text-gray-400 hover:text-blue-600 transition-colors">
          <Edit2 className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export function InfoSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">个人信息</h2>
      
      <div className="space-y-2">
        <InfoItem
          icon={<User className="w-5 h-5" />}
          label="姓名"
          value="张伟"
          editable
          onClick={() => alert('编辑姓名')}
        />
        <InfoItem
          icon={<Mail className="w-5 h-5" />}
          label="邮箱"
          value="zhangwei@example.com"
          editable
          onClick={() => alert('编辑邮箱')}
        />
        <InfoItem
          icon={<Phone className="w-5 h-5" />}
          label="手机号码"
          value="+86 138 0013 8000"
          editable
          onClick={() => alert('编辑手机号码')}
        />
        <InfoItem
          icon={<MapPin className="w-5 h-5" />}
          label="常用地址"
          value="北京市朝阳区建国路88号"
          editable
          onClick={() => alert('编辑地址')}
        />
        <InfoItem
          icon={<Calendar className="w-5 h-5" />}
          label="注册时间"
          value="2024年1月15日"
        />
      </div>
    </div>
  );
}
