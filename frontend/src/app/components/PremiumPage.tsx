import React from 'react';
import { motion } from 'motion/react';
import {
    Check,
    Zap,
    ShieldCheck,
    Users,
    Building2,
    Sparkles,
    ArrowRight,
    CreditCard,
    Trophy,
    Target,
    ArrowLeft
} from 'lucide-react';

interface PremiumPageProps {
    onBack: () => void;
}

interface PricingCardProps {
    title: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    highlighted?: boolean;
    onAction?: () => void;
    icon: React.ReactNode;
    color: string;
}

const PricingCard = ({
    title,
    price,
    period,
    description,
    features,
    buttonText,
    highlighted,
    onAction,
    icon,
    color
}: PricingCardProps) => (
    <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        className={`relative p-8 rounded-[32px] border ${highlighted
            ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/20'
            : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xl'
            } backdrop-blur-xl transition-all h-full flex flex-col`}
    >
        {highlighted && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                Most Popular
            </div>
        )}

        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10`}>
            {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: "w-7 h-7 text-white" })}
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{description}</p>

        <div className="mb-8">
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{price}</span>
                <span className="text-slate-500 dark:text-slate-400">/{period}</span>
            </div>
        </div>

        <div className="space-y-4 mb-8 flex-grow">
            {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                </div>
            ))}
        </div>

        <button
            onClick={onAction}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${highlighted
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                }`}
        >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
        </button>
    </motion.div>
);

export const PremiumPage = ({ onBack }: PremiumPageProps) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/10" />

            <div className="max-w-7xl mx-auto relative z-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-6 border border-blue-100 dark:border-blue-800"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Pricing Plans</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight"
                    >
                        Choose the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Premium Plan</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        Unlock advanced AI features, bulk processing, and specialized screening tools designed for both individuals and high-growth companies.
                    </motion.p>
                </div>

                {/* Section 1: Company Screening */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Company Screening</h2>
                            <p className="text-slate-500">Perfect for HR teams and recruitment agencies with full license management.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard
                            title="Quick Start"
                            price="$5"
                            period="1 week"
                            description="Test our features for a short sprint."
                            icon={<Zap />}
                            color="from-blue-500 to-blue-600"
                            buttonText="Buy & Give Licenses"
                            features={[
                                "Full License Management",
                                "AI Candidate Screening",
                                "Bulk Resume Upload",
                                "Priority Support"
                            ]}
                        />
                        <PricingCard
                            title="Professional"
                            price="$15"
                            period="1 month"
                            highlighted
                            description="The standard for growing HR teams."
                            icon={<Trophy />}
                            color="from-blue-600 to-indigo-700"
                            buttonText="Buy & Give Licenses"
                            features={[
                                "All Quick Start features",
                                "Advanced Analytics",
                                "Custom Ranking Rules",
                                "Team Collaboration Tools",
                                "Dedicated Account Manager"
                            ]}
                        />
                        <PricingCard
                            title="Enterprise Ready"
                            price="$100"
                            period="1 year"
                            description="Maximum value for long-term growth."
                            icon={<ShieldCheck />}
                            color="from-indigo-600 to-purple-700"
                            buttonText="Buy & Give Licenses"
                            features={[
                                "Everything in Professional",
                                "Unlimited License Transfers",
                                "API Access (Beta)",
                                "White-label Reports",
                                "24/7 Premium Hotline"
                            ]}
                        />
                    </div>
                </div>

                {/* Section 2: Individual Users */}
                <div>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Individual Plans</h2>
                            <p className="text-slate-500">Enhanced career tools with couth screening (no license transfers).</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard
                            title="Basic User"
                            price="$2"
                            period="1 week"
                            description="Quick boost for your job search."
                            icon={<Target />}
                            color="from-emerald-500 to-teal-600"
                            buttonText="Get Started Now"
                            features={[
                                "Access to All AI Tools",
                                "Couth Screening Enabled",
                                "Personal Career Roadmap",
                                "No License Transfers"
                            ]}
                        />
                        <PricingCard
                            title="Power User"
                            price="$10"
                            period="1 month"
                            description="The best value for active job seekers."
                            icon={<Sparkles />}
                            color="from-amber-500 to-orange-600"
                            buttonText="Get Started Now"
                            features={[
                                "Everything in Basic",
                                "Unlimited Resume Edits",
                                "Advanced Prep Hub",
                                "Skill Optimization Tips"
                            ]}
                        />
                        <PricingCard
                            title="Career Mastery"
                            price="$90"
                            period="1 year"
                            description="Full access for the ambitious professional."
                            icon={<CreditCard />}
                            color="from-rose-500 to-pink-600"
                            buttonText="Get Started Now"
                            features={[
                                "Everything in Power User",
                                "Early Access to Features",
                                "Priority AI Processing",
                                "Year-round Career Support"
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
