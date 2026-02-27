import { useState } from 'react';
import { Moon, Sun, Brain, Target, TrendingUp, Code, Sparkles, Clock, BarChart3, Zap, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';

interface CareerResult {
  transferable_skills: Array<{ name: string; description: string }>;
  skill_gap: Array<{ name: string; difficulty: 'Easy' | 'Medium' | 'Advanced'; description: string }>;
  career_switch_roadmap: Array<{
    phase: string;
    skills: string[];
    duration: string;
    milestones: string[];
    progress: number;
  }>;
  suggested_projects: Array<{
    title: string;
    tools: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    benefit: string;
  }>;
  future_prediction: {
    salary_data: Array<{ year: string; salary: number }>;
    stability: 'High' | 'Medium' | 'Low';
    demand: 'High' | 'Medium' | 'Low';
    confidence: number;
  };
}

interface ApiCareerSwitchResponse {
  transferable_skills: string[];
  skill_gap: string[];
  career_switch_roadmap: string[];
  suggested_projects_for_transition: string[];
  future_prediction_5_years: string;
}

const API_BASE_URL =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

function getDifficulty(skillName: string): 'Easy' | 'Medium' | 'Advanced' {
  const normalized = skillName.toLowerCase();
  if (
    normalized.includes('architecture') ||
    normalized.includes('machine learning') ||
    normalized.includes('ai') ||
    normalized.includes('deep') ||
    normalized.includes('system design')
  ) {
    return 'Advanced';
  }

  if (
    normalized.includes('api') ||
    normalized.includes('database') ||
    normalized.includes('cloud') ||
    normalized.includes('framework') ||
    normalized.includes('devops')
  ) {
    return 'Medium';
  }

  return 'Easy';
}

function normalizeCareerResponse(apiData: ApiCareerSwitchResponse): CareerResult {
  const currentYear = new Date().getFullYear();
  const prediction = apiData.future_prediction_5_years?.toLowerCase() || '';

  const stability: 'High' | 'Medium' | 'Low' = prediction.includes('low')
    ? 'Low'
    : prediction.includes('medium')
      ? 'Medium'
      : 'High';

  const demand: 'High' | 'Medium' | 'Low' = prediction.includes('decline') || prediction.includes('low demand')
    ? 'Low'
    : prediction.includes('moderate') || prediction.includes('medium demand')
      ? 'Medium'
      : 'High';

  return {
    transferable_skills: (apiData.transferable_skills || []).map((skill) => ({
      name: skill,
      description: 'Relevant experience from your current profile that directly applies to your target role.'
    })),
    skill_gap: (apiData.skill_gap || []).map((skill) => ({
      name: skill,
      difficulty: getDifficulty(skill),
      description: 'Recommended focus area to close your transition gap.'
    })),
    career_switch_roadmap: (apiData.career_switch_roadmap || []).map((step, index, allSteps) => ({
      phase: `Phase ${index + 1}`,
      skills: (apiData.skill_gap || []).slice(index, index + 3),
      duration: `${Math.max(1, Math.ceil(6 / Math.max(allSteps.length, 1)))} months`,
      milestones: [step],
      progress: Math.max(0, Math.min(100, 100 - index * 25))
    })),
    suggested_projects: (apiData.suggested_projects_for_transition || []).map((projectName) => ({
      title: projectName,
      tools: ['Git', 'VS Code', 'Portfolio'],
      difficulty: 'Intermediate',
      benefit: 'Demonstrates practical capability and strengthens your transition portfolio.'
    })),
    future_prediction: {
      salary_data: [0, 1, 2, 3, 4].map((offset) => ({
        year: String(currentYear + offset),
        salary: 65000 + offset * 15000
      })),
      stability,
      demand,
      confidence: 85
    }
  };
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [currentRole, setCurrentRole] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CareerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const targetDomains = [
    'AI Engineer',
    'Data Scientist',
    'Full Stack Developer',
    'Cybersecurity Analyst',
    'UI/UX Designer',
    'DevOps Engineer',
    'Cloud Architect',
    'Mobile Developer',
    'Machine Learning Engineer',
    'Blockchain Developer'
  ];

  const generateAIPlan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/phase4/career-switch?email=${localStorage.getItem('email')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_role: currentRole,
          target_role: targetDomain
        })
      });

      if (!response.ok) {
        throw new Error(`Backend request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(normalizeCareerResponse(data as ApiCareerSwitchResponse));
    } catch (err) {
      setResults(null);
      setError(err instanceof Error ? err.message : 'Failed to generate plan from backend API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Main Content */}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12 bg-white dark:bg-slate-950">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-12 mb-8 shadow-lg"
        >
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />

          <motion.div
            className="relative z-10 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white/90 font-medium text-sm">AI-Powered Career Planning</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Switch Your Career Smartly with AI
            </h1>
            <p className="text-lg text-white/90">
              Enter your current skills and your target domain to generate a personalized career transition roadmap.
            </p>
          </motion.div>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-white">Career Transition Analysis</CardTitle>
              <CardDescription>
                Tell us about your current expertise and where you want to go
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Role */}
              <div className="space-y-3">
                <Label htmlFor="skills" className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  1️⃣ Current Job Role
                </Label>
                <Input
                  id="skills"
                  placeholder="Enter your current role (e.g., Java Developer, QA Engineer)"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="rounded-lg h-11 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Target Domain */}
              <div className="space-y-3">
                <Label htmlFor="domain" className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  2️⃣ Target Domain
                </Label>
                <Select value={targetDomain} onValueChange={setTargetDomain}>
                  <SelectTrigger className="rounded-lg h-11 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#2563EB]">
                    <SelectValue placeholder="Select the domain you want to switch to" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateAIPlan}
                disabled={!currentRole.trim() || !targetDomain || isLoading}
                className="w-full h-12 rounded-lg text-base font-semibold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1d4ed8] hover:to-[#6d28d9] shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mr-2"
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    AI is analyzing your career transition...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Plan
                  </>
                )}
              </Button>

              {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {results && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="mt-8 space-y-6"
            >
              {/* Transferable Skills */}
              <Card className="rounded-2xl shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-white">
                        🟢 Transferable Skills
                      </CardTitle>
                      <CardDescription>Your existing strengths that will help you transition</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.transferable_skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                              {skill.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {skill.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skill Gap */}
              <Card className="rounded-2xl shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-sm">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-white">
                        🔴 Skill Gap
                      </CardTitle>
                      <CardDescription>Skills you need to acquire for the transition</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.skill_gap.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-red-900 dark:text-red-300">
                                  {skill.name}
                                </h4>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {skill.description}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs px-3 py-1 rounded-lg ${skill.difficulty === 'Easy'
                                ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
                                : skill.difficulty === 'Medium'
                                  ? 'border-orange-500 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
                                  : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                              }`}
                          >
                            {skill.difficulty}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Career Switch Roadmap */}
              <Card className="rounded-2xl shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-sm">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-white">
                        🗺 Career Switch Roadmap
                      </CardTitle>
                      <CardDescription>Your personalized learning path</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {results.career_switch_roadmap.map((phase, index) => (
                    <motion.div
                      key={phase.phase}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {phase.phase}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{phase.duration}</span>
                          </div>
                        </div>
                        <Badge className="bg-[#2563EB] text-white rounded-lg">
                          {phase.progress}% Complete
                        </Badge>
                      </div>

                      <Progress value={phase.progress} className="mb-4 h-2" />

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                            Skills to Learn:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-lg"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">
                            Key Milestones:
                          </h4>
                          <ul className="space-y-1">
                            {phase.milestones.map((milestone, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <ChevronRight className="w-4 h-4 text-[#2563EB]" />
                                {milestone}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Suggested Projects */}
              <Card className="rounded-2xl shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-sm">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-white">
                        💻 Suggested Projects for Transition
                      </CardTitle>
                      <CardDescription>Build these projects to gain practical experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.suggested_projects.map((project, index) => (
                      <motion.div
                        key={project.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {project.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-xs rounded-lg ${project.difficulty === 'Beginner'
                                ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
                                : project.difficulty === 'Intermediate'
                                  ? 'border-orange-500 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
                                  : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                              }`}
                          >
                            {project.difficulty}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                              Tools Required:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tools.map((tool) => (
                                <Badge
                                  key={tool}
                                  variant="secondary"
                                  className="text-xs bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-blue-400 border-0 rounded-md"
                                >
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Why this helps:
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {project.benefit}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Future Prediction */}
              <Card className="rounded-2xl shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-white">
                        🔮 Future Prediction (5 Years)
                      </CardTitle>
                      <CardDescription>Career growth forecast and market analysis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Salary Growth Chart */}
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                      Salary Growth Forecast
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={results.future_prediction.salary_data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis
                          dataKey="year"
                          className="text-xs"
                          stroke="currentColor"
                        />
                        <YAxis
                          className="text-xs"
                          stroke="currentColor"
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                          }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Salary']}
                        />
                        <Line
                          type="monotone"
                          dataKey="salary"
                          stroke="#2563EB"
                          strokeWidth={3}
                          dot={{ fill: '#2563EB', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Career Stability
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {results.future_prediction.stability}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20 flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="w-6 h-6 text-[#2563EB]" />
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Industry Demand
                      </p>
                      <p className="text-2xl font-bold text-[#2563EB]">
                        {results.future_prediction.demand}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6 text-[#7C3AED]" />
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        AI Confidence
                      </p>
                      <p className="text-2xl font-bold text-[#7C3AED]">
                        {results.future_prediction.confidence}%
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}