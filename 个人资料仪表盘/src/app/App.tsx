import { ProfileHeader } from './components/ProfileHeader';
import { StatsGrid } from './components/StatsGrid';
import { PaymentCards } from './components/PaymentCards';
import { InfoSection } from './components/InfoSection';
import { SettingsSection } from './components/SettingsSection';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Profile Header with Progress Ring */}
        <ProfileHeader
          name="张伟"
          email="zhangwei@example.com"
          avatar="https://images.unsplash.com/photo-1569913486515-b74bf7751574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBwcm9maWxlfGVufDF8fHx8MTc3MzEyNTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          totalMileage={847}
          mileageGoal={1000}
        />

        {/* Stats Grid */}
        <StatsGrid />

        {/* Payment Cards - Horizontal Scroll */}
        <PaymentCards />

        {/* Two Column Layout for Info and Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoSection />
          <SettingsSection />
        </div>
      </div>
    </div>
  );
}
