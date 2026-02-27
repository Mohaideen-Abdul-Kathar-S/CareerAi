import React, { useState } from 'react';
import { Sparkles, FileText, Loader2 } from 'lucide-react';
import { ResumeUploadCard } from './ResumeUploadCard';
import { JobDescriptionCard } from './JobDescriptionCard';
import { Button } from './ui/button';

interface ResumeUploadPageProps {
  resumeFile: File | null;
  jobDescription: string;
  selectedRole: string;
  onFileChange: (file: File | null) => void;
  onJobDescriptionChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onAnalyze: () => Promise<void>;
}

export function ResumeUploadPage({
  resumeFile,
  jobDescription,
  selectedRole,
  onFileChange,
  onJobDescriptionChange,
  onRoleChange,
  onAnalyze,
}: ResumeUploadPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    try {
      await onAnalyze();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-slate-800 mb-2">
          Resume Analyzer
        </h2>
        <p className="text-slate-600">
          Upload your resume and compare it with job descriptions to identify skill gaps
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ResumeUploadCard
          resumeFile={resumeFile}
          onFileChange={onFileChange}
        />
        <JobDescriptionCard
          jobDescription={jobDescription}
          selectedRole={selectedRole}
          onJobDescriptionChange={onJobDescriptionChange}
          onRoleChange={onRoleChange}
        />
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Analyze Resume
            </>
          )}
        </Button>
      </div>

      {/* Info Box */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-slate-700 leading-relaxed">
                We analyze your resume using AI and provide skill gap insights. Our advanced algorithms 
                compare your qualifications against job requirements to help you understand where you stand 
                and what skills to develop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
