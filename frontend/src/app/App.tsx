import { useMemo, useState } from 'react';
import Module1App from '../modules/module1/App';
import Module2App from '../modules/module2/App';
import Module3App from '../modules/module3/App';
import Module4App from '../modules/module4/App';
import Module5App from '../modules/module5/ModuleIndex';
import Module7App from '../modules/module5_interview/ModuleIndex';
import Module6App from '../modules/module6/App';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { PremiumPage } from './components/PremiumPage';
import { Sparkles, Home, FileText, GraduationCap, Users, LayoutDashboard, ChevronRight, PenTool, LogOut, CreditCard, MessageSquare } from 'lucide-react';

type ModuleKey = 'home' | 'module1' | 'module2' | 'module3' | 'module4' | 'module5' | 'module6' | 'module7' | 'premium';

const modules: Array<{ key: ModuleKey; label: string; icon: any }> = [
  { key: 'module1', label: 'Resume Analyzer', icon: FileText },
  { key: 'module5', label: 'Resume Editor', icon: PenTool },
  { key: 'module7', label: 'Mock Interview', icon: MessageSquare },
  { key: 'module2', label: 'Prep Hub', icon: GraduationCap },
  { key: 'module3', label: 'Candidate Screen', icon: Users },
  { key: 'module4', label: 'Career Switch', icon: LayoutDashboard },
  { key: 'module6', label: 'Payments', icon: CreditCard },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("email") ? true : false);

  const ActiveModulePage = useMemo(() => {
    switch (activeModule) {
      case 'home':
        return () => <LandingPage onSelectModule={(key) => setActiveModule(key as ModuleKey)} />;
      case 'premium':
        return () => <PremiumPage onBack={() => setActiveModule('home')} />;
      case 'module1':
        return Module1App;
      case 'module5':
        return Module5App;
      case 'module7':
        return Module7App;
      case 'module2':
        return Module2App;
      case 'module3':
        return Module3App;
      case 'module4':
        return Module4App;
      case 'module6':
        return Module6App;
      default:
        return () => <LandingPage onSelectModule={(key) => setActiveModule(key as ModuleKey)} />;
    }
  }, [activeModule]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Integrated Navigation Bar */}
      <header className="sticky top-0 z-[60] w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            onClick={() => setActiveModule('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              CareerAI
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveModule('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeModule === 'home'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <div className="w-px h-4 bg-slate-200 mx-2" />
            {modules.map((module) => (
              <button
                key={module.key}
                onClick={() => setActiveModule(module.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeModule === module.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <module.icon className="w-4 h-4" />
                <span>{module.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">AI Online</span>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
              title="Logout"
            >
              <LogOut className="w-4 h-4" onClick={() => {
                localStorage.removeItem("email");
                setIsLoggedIn(false);
              }} />
            </button>
            <button className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative">
        <ActiveModulePage />
      </main>

      {/* Global Toast / Feedback area could go here */}
    </div>
  );
}
