import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Feedback } from '../types/feedback';
import { mockFeedback } from '../data/mockFeedback';
import { Button } from './ui/button';
import { MessageSquare, AlertCircle, Menu, X } from 'lucide-react';
import { cn } from './ui/utils';

export function Layout() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(mockFeedback);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleUpdateFeedback = (id: string, updates: Partial<Feedback>) => {
    setFeedbackList((prev) =>
      prev.map((feedback) =>
        feedback.id === id ? { ...feedback, ...updates } : feedback
      )
    );
  };

  const highPriorityCount = feedbackList.filter(
    (f) => f.priority === 'high' && f.status !== 'resolved' && f.status !== 'closed'
  ).length;

  const navItems = [
    {
      path: '/',
      label: '所有反馈',
      icon: MessageSquare,
      count: feedbackList.length,
    },
    {
      path: '/high-priority',
      label: '高优先级',
      icon: AlertCircle,
      count: highPriorityCount,
      highlight: highPriorityCount > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  问题与反馈管理系统
                </h1>
                <p className="text-xs text-gray-500">
                  统一管理用户反馈和故障报告
                </p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'relative',
                        item.highlight && !isActive && 'text-red-600 hover:text-red-700'
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.count > 0 && (
                        <span
                          className={cn(
                            'ml-2 px-2 py-0.5 text-xs rounded-full',
                            isActive
                              ? 'bg-white text-blue-600'
                              : item.highlight
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        item.highlight && !isActive && 'text-red-600 hover:text-red-700'
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.count > 0 && (
                        <span
                          className={cn(
                            'ml-auto px-2 py-0.5 text-xs rounded-full',
                            isActive
                              ? 'bg-white text-blue-600'
                              : item.highlight
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ feedbackList, onUpdateFeedback: handleUpdateFeedback }} />
      </main>
    </div>
  );
}
