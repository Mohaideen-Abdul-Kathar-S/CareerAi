import { User, Brain } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">CareerAI</span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button 
              className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Resume Analyzer
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Smart Preparation
            </button>
            <button 
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-medium shadow-sm"
            >
              Recruiter Dashboard
            </button>
          </div>

          {/* Profile Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>
    </nav>
  );
}
