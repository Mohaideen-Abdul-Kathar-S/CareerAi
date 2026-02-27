import React from 'react';
import {
    Sparkles,
    FileSearch,
    GraduationCap,
    SwitchCamera,
    Search,
    Zap,
    CheckCircle2,
    ArrowRight,
    Brain,
    Rocket,
    PenTool
} from 'lucide-react';
import { motion } from 'motion/react';

interface ToolCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
    features: string[];
}

const ToolCard = ({ title, description, icon, color, onClick, features }: ToolCardProps) => (
    <motion.button
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={onClick}
        className="group relative flex flex-col items-start p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 text-left transition-all overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />

        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} mb-6 shadow-lg shadow-blue-500/20 text-white`}>
            <div className="w-8 h-8">
                {icon}
            </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {description}
        </p>

        <div className="space-y-3 mb-8 w-full">
            {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                </div>
            ))}
        </div>

        <div className="mt-auto flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
    </motion.button>
);

export const LandingPage = ({ onSelectModule }: { onSelectModule: (key: string) => void }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-800/20" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-6 border border-blue-100 dark:border-blue-800">
                            <Sparkles className="w-4 h-4" />
                            <span>The Future of Career Management</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                            Empower Your Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI Intelligence</span>
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-loose mb-10 max-w-3xl mx-auto">
                            A comprehensive suite of AI-driven tools designed to help you analyze resumes, prepare for interviews, screen candidates, and plan your next big career move.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2"
                            >
                                <Rocket className="w-5 h-5" />
                                Explore Tools
                            </button>
                            <button onClick={() => onSelectModule('premium')} className="px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg border border-slate-200 dark:border-slate-800 transition-all">
                                Get Premium
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none"
                    >
                        {[
                            { label: 'AI Accuracy', value: '99%' },
                            { label: 'Time Saved', value: '10x' },
                            { label: 'Users Helped', value: '50k+' },
                            { label: 'Career Growth', value: '85%' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Tools for Every Professional</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400">Choose the right specialized AI tool to accelerate your career goals or streamline your hiring process.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ToolCard
                            title="AI Resume Analyzer"
                            description="Upload your resume and get instant feedback on how to optimize it for ATS systems and specific job roles."
                            icon={<Search size={32} />}
                            color="from-blue-500 to-indigo-600"
                            onClick={() => onSelectModule('module1')}
                            features={[
                                "ATS Compatibility Check",
                                "Keyword Optimization",
                                "Role-specific Analysis",
                                "Skill Gap Identification"
                            ]}
                        />
                        <ToolCard
                            title="Interactive Resume Editor"
                            description="Craft your perfect resume with our intuitive builder. Choose templates and customize every detail with live preview."
                            icon={<PenTool size={32} />}
                            color="from-rose-500 to-orange-600"
                            onClick={() => onSelectModule('module5')}
                            features={[
                                "Live Preview Mode",
                                "Multiple Design Templates",
                                "Easy PDF Export",
                                "Dynamic Content Blocks"
                            ]}
                        />
                        <ToolCard
                            title="AI Mock Interview"
                            description="Practice with our realistic AI interviewer. Get real-time questions, feedback, and a detailed performance report."
                            icon={<Brain size={32} />}
                            color="from-blue-600 to-cyan-500"
                            onClick={() => onSelectModule('module7')}
                            features={[
                                "Dynamic AI Questions",
                                "Real-time Feedback",
                                "Comprehensive Scoring",
                                "Skill-specific Analysis"
                            ]}
                        />
                        <ToolCard
                            title="Smart Preparation Hub"
                            description="Get personalized interview questions and preparation strategies tailored to your target company and role."
                            icon={<GraduationCap size={32} />}
                            color="from-emerald-500 to-teal-600"
                            onClick={() => onSelectModule('module2')}
                            features={[
                                "Role-based Roadmaps",
                                "Technical Question Bank",
                                "Behavioral Guidance",
                                "Company-specific Insights"
                            ]}
                        />
                        <ToolCard
                            title="Candidate Screener"
                            description="An enterprise-grade tool for HR professionals to quickly screen bulk resumes and identify top candidates."
                            icon={<FileSearch size={32} />}
                            color="from-amber-500 to-orange-600"
                            onClick={() => onSelectModule('module3')}
                            features={[
                                "Bulk Resume Processing",
                                "Ranked Scorecards",
                                "Key Findings Extraction",
                                "Comparative Analytics"
                            ]}
                        />
                        <ToolCard
                            title="Career Switch AI"
                            description="Planning a career change? Get a roadmap, skills gap analysis, and tailored project suggestions for your transition."
                            icon={<SwitchCamera size={32} />}
                            color="from-purple-500 to-pink-600"
                            onClick={() => onSelectModule('module4')}
                            features={[
                                "Transition Roadmap",
                                "Transferable Skills Map",
                                "Learning Resources",
                                "Salary Predictions"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto rounded-[48px] bg-gradient-to-br from-blue-600 to-purple-700 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to transform your career?</h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of professionals who are using AI to stay ahead in the modern job market.</p>
                        <button className="px-10 py-5 bg-white text-blue-600 rounded-[20px] font-extrabold text-xl shadow-xl hover:scale-105 transition-transform">
                            Get Started for Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-900 dark:text-white">AI Career Suite</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-500 mb-8 max-w-md mx-auto">The ultimate platform for modern professionals to navigate their career journey with AI.</p>
                    <div className="flex justify-center gap-8 mb-8 font-medium text-slate-600 dark:text-slate-400">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
                    </div>
                    <div className="text-slate-400 dark:text-slate-600 text-sm">
                        © 2024 AI Career Suite. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};
