import React from 'react';
import { Target, CheckCircle2, XCircle, Lightbulb, RotateCcw, Download } from 'lucide-react';
import { Button } from './ui/button';
import { CircularProgress } from './CircularProgress';

export interface AnalysisData {
  ats_score: number;
  skills_required: string[];
  skills_you_have: string[];
  skills_to_improve: string[];
  suggestions: string[];
}

interface AnalysisResultsProps {
  resumeFileName: string;
  selectedRole: string;
  analysisData: AnalysisData | null;
  onReAnalyze: () => void;
}

const emptyAnalysis: AnalysisData = {
  ats_score: 0,
  skills_required: [],
  skills_you_have: [],
  skills_to_improve: [],
  suggestions: ['No suggestions returned by backend. Try with a more detailed job description.'],
};

export function AnalysisResults({ resumeFileName, selectedRole, analysisData, onReAnalyze }: AnalysisResultsProps) {

  // const { matchScore, requiredSkills, matchingSkills, skillGaps, suggestions } = analysisData ?? emptyAnalysis;
const  {ats_score, skills_required, skills_you_have ,skills_to_improve, suggestions} = analysisData ?? emptyAnalysis;
console.log(ats_score)
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Great Match!';
    if (score >= 50) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-slate-800 mb-2">
          Analysis Results
        </h2>
        <p className="text-slate-600">
          Analyzing: {resumeFileName}
        </p>
      </div>

      {/* Match Score Card */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 border border-slate-200/60">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <CircularProgress value={ats_score} size={180} strokeWidth={12} />
            </div>
            <h3 className={`text-2xl font-semibold mb-2 ${getScoreColor(ats_score)}`}>
              {getScoreLabel(ats_score)}
            </h3>
            <p className="text-slate-600">
              Your resume matches {ats_score}% of the job requirements
            </p>
          </div>
        </div>
      </div>

      {/* Skills Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Required Skills */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-200/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Skills Required for This Role
            </h3>
          </div>
          {skills_required.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills_required.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No required skills detected.</p>
          )}
        </div>

        {/* Matching Skills */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-200/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Skills You Have
            </h3>
          </div>
          {skills_you_have.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills_you_have.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No matching skills found.</p>
          )}
        </div>

        {/* Skill Gaps */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-200/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Skills You Need to Improve
            </h3>
          </div>
          {skills_to_improve.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills_to_improve.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200 flex items-center gap-1"
                >
                  <XCircle className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No critical skill gaps detected.</p>
          )}
        </div>
      </div>

      {/* AI Suggestions Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 border border-slate-200/60">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">
              Improvement Suggestions
            </h3>
          </div>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onReAnalyze}
          className="px-6 py-3 font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Re-analyze
        </Button>
        <Button
          onClick={() => alert('Download report feature coming soon!')}
          className="px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>
    </main>
  );
}
