import React from 'react';
import { Bell, Lock, Globe, HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon, label, description, onClick, danger = false }: SettingItemProps) {
  return (
    <button
      className={`w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left ${
        danger ? 'hover:bg-red-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={danger ? 'text-red-600' : 'text-gray-600'}>
          {icon}
        </div>
        <div>
          <div className={`font-medium ${danger ? 'text-red-600' : 'text-gray-900'}`}>
            {label}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          )}
        </div>
      </div>
      <ChevronRight className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
    </button>
  );
}

export function SettingsSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">设置</h2>
      
      <div className="space-y-2">
        <SettingItem
          icon={<Bell className="w-5 h-5" />}
          label="通知设置"
          description="管理推送通知和提醒"
          onClick={() => alert('打开通知设置')}
        />
        <SettingItem
          icon={<Lock className="w-5 h-5" />}
          label="隐私与安全"
          description="密码、验证和隐私设置"
          onClick={() => alert('打开隐私设置')}
        />
        <SettingItem
          icon={<Globe className="w-5 h-5" />}
          label="语言和区域"
          description="当前: 简体中文"
          onClick={() => alert('打开语言设置')}
        />
        <SettingItem
          icon={<Shield className="w-5 h-5" />}
          label="账户安全"
          description="两步验证、登录设备管理"
          onClick={() => alert('打开安全设置')}
        />
        <SettingItem
          icon={<HelpCircle className="w-5 h-5" />}
          label="帮助与支持"
          description="常见问题、联系客服"
          onClick={() => alert('打开帮助中心')}
        />
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <SettingItem
            icon={<LogOut className="w-5 h-5" />}
            label="退出登录"
            onClick={() => confirm('确定要退出登录吗?')}
            danger
          />
        </div>
      </div>
    </div>
  );
}
