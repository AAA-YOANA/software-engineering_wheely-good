import React from 'react';
import { Camera, Award } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar: string;
  totalMileage: number;
  mileageGoal: number;
}

export function ProfileHeader({ name, email, avatar, totalMileage, mileageGoal }: ProfileHeaderProps) {
  const progress = (totalMileage / mileageGoal) * 100;
  const strokeDasharray = 2 * Math.PI * 52; // radius = 52
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
      <div className="flex items-start gap-6">
        {/* Avatar with Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="52"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="52"
              fill="none"
              stroke="white"
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-1">{name}</h1>
          <p className="text-blue-100 mb-6">{email}</p>
          
          {/* Mileage Stats */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">总骑行里程</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{totalMileage}</span>
              <span className="text-lg opacity-80 mb-1">km / {mileageGoal} km</span>
            </div>
            <div className="mt-3 bg-white/30 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
