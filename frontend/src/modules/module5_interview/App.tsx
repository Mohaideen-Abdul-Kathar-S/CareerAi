
import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  FileText, 
  CheckCircle, 
  Send, 
  BarChart2, 
  Download, 
  RefreshCcw,
  Sparkles,
  Search,
  Check,
  TrendingUp,
  Target,
  Zap,
  AlertCircle
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { AppState, InterviewData, Question, EvaluationReport } from './types';
import * as interviewApi from './services/interviewApi';

const ROLES = [
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'Marketing Specialist'
];

export default function App() {
      // Store question-answer pairs
      const [qaPairs, setQaPairs] = useState<{ question: string; answer: string }[]>([]);
    // Voice assistant: read question aloud on update
    
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [interviewData, setInterviewData] = useState<InterviewData>({
    role: ROLES[0],
    duration: 15,
    resumeFileName: '',
    resumeFile: null,
    sessionId: ''
  });
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const formatTime = (seconds: number) => {
    const safe = Math.max(0, seconds);
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (appState !== AppState.INTERVIEWING) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [appState]);

  useEffect(() => {
    if (appState === AppState.INTERVIEWING && remainingSeconds === 0 && questions.length > 0 && !isLoading) {
      void handleCompleteInterview();
    }
  }, [appState, remainingSeconds, isLoading, questions.length]);

  // Start the interview
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewData.resumeFile) {
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setAppState(AppState.ANALYZING);

    try {
      const response = await interviewApi.startInterview(
        interviewData.resumeFile,
        interviewData.role,
        interviewData.duration
      );

      const initialQuestion: Question = {
        id: 1,
        text: response.question,
      };

      setQuestions([initialQuestion]);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setCurrentAnswer('');
      setQaPairs([]); // Reset QA pairs at start
      setRemainingSeconds(interviewData.duration * 60);
      setInterviewData(prev => ({ ...prev, sessionId: response.session_id }));
      setAppState(AppState.INTERVIEWING);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to start interview session.');
      setAppState(AppState.IDLE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      if (appState === AppState.INTERVIEWING && questions[currentQuestionIndex]?.text) {
        const utterance = new window.SpeechSynthesisUtterance(questions[currentQuestionIndex].text);
        utterance.lang = 'en-US';
        window.speechSynthesis.cancel(); // Stop any previous speech
        window.speechSynthesis.speak(utterance);
      }
      // Optional: cleanup on unmount
      return () => {
        window.speechSynthesis.cancel();
      };
    }, [appState, currentQuestionIndex, questions]);
    
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const answerToSubmit = currentAnswer;
    const newAnswers = [...userAnswers, answerToSubmit];
    setUserAnswers(newAnswers);
    // Store the current question and answer as a pair
    if (questions[currentQuestionIndex]?.text) {
      setQaPairs(prev => ([
        ...prev,
        { question: questions[currentQuestionIndex].text, answer: answerToSubmit }
      ]));
    }
    setCurrentAnswer('');

    setIsLoading(true);
    setErrorMessage('');
    try {
      const nextResponse = await interviewApi.submitAnswer(interviewData.sessionId, answerToSubmit);

      if (nextResponse.error) {
        throw new Error(nextResponse.error);
      }

      if (nextResponse.message === 'TIME_OVER' || nextResponse.message === 'Interview already ended') {
        await handleCompleteInterview();
        return;
      }

      if (!nextResponse.question) {
        throw new Error('No next question returned by server.');
      }

      setQuestions(prev => ([
        ...prev,
        {
          id: prev.length + 1,
          text: nextResponse.question as string,
        },
      ]));
      setCurrentQuestionIndex(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to continue interview.');
      setAppState(AppState.IDLE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteInterview = async () => {
    setAppState(AppState.EVALUATING);
    setIsLoading(true);
    setErrorMessage('');
    try {
      const evaluation = await interviewApi.getFinalReport(interviewData.sessionId);
      setReport(evaluation);
      setAppState(AppState.REPORT);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to generate final report. Please try again.'
      );
      setAppState(AppState.IDLE);
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setAppState(AppState.IDLE);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentAnswer('');
    setReport(null);
    setErrorMessage('');
    setRemainingSeconds(0);
    setQaPairs([]);
    setInterviewData(prev => ({
      ...prev,
      resumeFileName: '',
      resumeFile: null,
      sessionId: '',
    }));
  };

  const ScoreBadge = ({ label, score, colorClass }: { label: string, score: number, colorClass: string }) => (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-2xl font-bold ${colorClass}`}>{score}%</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-100 py-4 mb-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 custom-gradient rounded-xl flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">HireAI</h1>
              <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Premium Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              appState === AppState.IDLE ? 'bg-gray-100 text-gray-500' : 
              appState === AppState.INTERVIEWING ? 'bg-green-100 text-green-600 animate-pulse' : 
              'bg-blue-100 text-blue-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                appState === AppState.IDLE ? 'bg-gray-400' : 
                appState === AppState.INTERVIEWING ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              {appState === AppState.IDLE ? 'Ready' : 
               appState === AppState.INTERVIEWING ? 'Active Session' : 
               appState === AppState.ANALYZING ? 'Analyzing Resume...' :
               appState === AppState.EVALUATING ? 'Generating Report...' : 'Report Ready'}
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold text-red-700">Something went wrong</p>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* State: IDLE - Setup Interview */}
        {appState === AppState.IDLE && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HireAI</h2>
              <p className="text-gray-500">The world's most advanced AI interview coach.</p>
            </div>

            <Card title="Start New Interview" subtitle="Configure your session details to begin.">
              <form onSubmit={handleStart} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Briefcase size={16} className="text-blue-600" />
                      Target Role
                    </label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      value={interviewData.role}
                      onChange={(e) => setInterviewData({...interviewData, role: e.target.value})}
                    >
                      {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      Duration (Minutes)
                    </label>
                    <input 
                      type="number" 
                      min="5" 
                      max="60"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      value={interviewData.duration}
                      onChange={(e) => setInterviewData({...interviewData, duration: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    Upload Resume (.pdf)
                  </label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setInterviewData({
                          ...interviewData,
                          resumeFileName: file?.name || '',
                          resumeFile: file,
                        });
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 transition-colors">
                      <Search className="text-gray-400" />
                      <p className="text-sm text-gray-700">
                        {interviewData.resumeFileName || "Drag and drop your resume here, or click to browse"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={isLoading}
                  disabled={!interviewData.resumeFile}
                >
                  Start Professional Interview
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* State: ANALYZING - Loading state */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 custom-gradient rounded-full animate-ping opacity-20" />
              <div className="relative w-full h-full custom-gradient rounded-full flex items-center justify-center text-white">
                <FileText size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Resume</h2>
            <p className="text-gray-500 max-w-sm">
              Our AI is extracting key skills and crafting tailored interview questions for the <span className="font-semibold text-blue-600">{interviewData.role}</span> position...
            </p>
          </div>
        )}

        {/* State: INTERVIEWING - Active Session */}
        {appState === AppState.INTERVIEWING && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-500">
                Session ID: <span className="text-blue-600">{interviewData.sessionId}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                <span>
                  Question <span className="text-blue-600">{currentQuestionIndex + 1}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                  <Clock size={14} /> {formatTime(remainingSeconds)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full custom-gradient transition-all duration-500 ease-out"
                style={{ width: `${((interviewData.duration * 60 - remainingSeconds) / (interviewData.duration * 60 || 1)) * 100}%` }}
              />
            </div>

            <Card className="relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
                   {currentQuestionIndex + 1}
                 </div>
               </div>
               
               <div className="pt-4 mb-8">
                 <h3 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                   {questions[currentQuestionIndex]?.text}
                 </h3>
               </div>

               <div className="space-y-4">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Answer</label>
                 <textarea 
                   rows={6}
                   className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none resize-none shadow-sm placeholder-gray-500"
                   placeholder="Type your response here... Be detailed and provide examples."
                   value={currentAnswer}
                   onChange={(e) => setCurrentAnswer(e.target.value)}
                 />
                 <div className="flex justify-end gap-3">
                   <Button 
                     onClick={handleSubmitAnswer}
                     className="min-w-[160px]"
                     disabled={!currentAnswer.trim() || isLoading}
                     isLoading={isLoading}
                   >
                     Next Question
                     <Send size={18} />
                   </Button>
                   <Button
                     variant="secondary"
                     onClick={handleCompleteInterview}
                     disabled={isLoading || userAnswers.length === 0}
                   >
                     Finish & Get Score
                   </Button>
                 </div>
               </div>
            </Card>
          </div>
        )}

        {/* State: EVALUATING - Analysis after interview */}
        {appState === AppState.EVALUATING && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
              <div className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white">
                <BarChart2 size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Detailed Report</h2>
            <p className="text-gray-500 max-w-sm">
              Our AI is reviewing your responses, calculating skill matches, and preparing constructive feedback.
            </p>
          </div>
        )}

        {/* State: REPORT - Results */}
        {appState === AppState.REPORT && report && (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Performance Report</h2>
                <p className="text-gray-500">Session ID: <span className="text-blue-600 font-medium">{interviewData.sessionId}</span> &bull; {interviewData.role}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => window.print()}>
                  <Download size={18} />
                  Export PDF
                </Button>
                <Button onClick={resetInterview}>
                  <RefreshCcw size={18} />
                  Restart Session
                </Button>
              </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-8 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Executive Summary</h3>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                    <TrendingUp size={14} /> AI Analysis
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {report.summary}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                  <ScoreBadge label="Technical" score={report.technicalScore} colorClass="text-blue-600" />
                  <ScoreBadge label="Communication" score={report.communicationScore} colorClass="text-purple-600" />
                  <ScoreBadge label="Problem Solving" score={report.problemSolvingScore} colorClass="text-orange-500" />
                  <ScoreBadge label="Cultural Fit" score={report.culturalFitScore} colorClass="text-green-600" />
                </div>
              </Card>

              <Card className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 custom-gradient" />
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Overall Performance</div>
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#F1F5F9"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient-report)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={439.8}
                      strokeDashoffset={439.8 * (1 - report.overallScore / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient-report" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-5xl font-bold text-gray-900">
                    {report.overallScore}
                  </div>
                </div>
                <div className="mt-6 font-bold text-gray-900">
                  {report.overallScore >= 80 ? 'Exceptional' : report.overallScore >= 60 ? 'Competitive' : 'Developing'}
                </div>
              </Card>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Candidate Strengths" className="border-l-4 border-l-green-500">
                <div className="space-y-4">
                  {report.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 bg-green-50/30 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Candidate Weaknesses" className="border-l-4 border-l-red-500">
                <div className="space-y-4">
                  {report.weaknesses.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 bg-red-50/30 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={14} strokeWidth={3} />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{w}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Actionable Improvement Plan */}
            <Card title="Improvement Plan" subtitle="Actionable steps tailored to your interview performance." className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-blue-100 -mr-8 -mt-8">
                <Target size={120} />
              </div>
              <div className="relative z-10 grid grid-cols-1 gap-4">
                {report.improvementPlan.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-5 p-5 bg-blue-50/40 rounded-2xl border border-blue-100 group hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col items-center">
                       <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                         {idx + 1}
                       </div>
                       {idx < report.improvementPlan.length - 1 && <div className="w-0.5 h-12 bg-blue-200 mt-2" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Growth Action</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="text-center pt-8 text-gray-400 text-xs flex items-center justify-center gap-2">
              <Sparkles size={14} /> Powered by AI Interview Engine &bull; Smart Recruitment Dashboard &bull; {new Date().getFullYear()}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
