import React, { useState } from 'react';
import { Sparkles, User } from 'lucide-react';
import { ResumeUploadPage } from './components/ResumeUploadPage';
import { AnalysisResults } from './components/AnalysisResults';
import type { AnalysisData } from './components/AnalysisResults';

// Removed local AnalysisData interface to avoid conflict with imported type

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;


function parseScore(value: unknown): number {
  if (typeof value === 'number') return Math.max(0, Math.min(100, Math.round(value)));
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace('%', '').trim());
    if (!Number.isNaN(parsed)) {
      return Math.max(0, Math.min(100, Math.round(parsed)));
    }
  }
  return 0;
}

function normalizeAnalysis(analysis: Record<string, unknown> | null | undefined): AnalysisData {
  console.log("check score", analysis?.ats_score)
  const safeAnalysis = analysis ?? {};
  const analysisResult = (safeAnalysis.analysis_result as Record<string, unknown>) ?? {};
  const ats_score = analysis?.ats_score as number;
  const skills_required = Array.isArray(safeAnalysis.skills_required)
    ? safeAnalysis.skills_required.filter((item): item is string => typeof item === 'string')
    : [];
  const skills_you_have = Array.isArray(safeAnalysis.skills_you_have)
    ? safeAnalysis.skills_you_have.filter((item): item is string => typeof item === 'string')
    : [];
  const skills_to_improve = Array.isArray(safeAnalysis.skills_to_improve)
    ? safeAnalysis.skills_to_improve.filter((item): item is string => typeof item === 'string')
    : [];
  const suggestions = Array.isArray(safeAnalysis.suggestions)
    ? safeAnalysis.suggestions.filter((item): item is string => typeof item === 'string')
    : [];
  return {
    ats_score,
    skills_required,
    skills_you_have,
    skills_to_improve,
    suggestions,
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'results'>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert('Please upload a resume PDF.');
      return;
    }

    if (!jobDescription.trim() && !selectedRole) {
      alert('Please provide a job description or select a role.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    if (jobDescription.trim()) {
      formData.append('job_description', jobDescription.trim());
    }

    if (selectedRole) {
      formData.append('job_role', selectedRole);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/analyze?email=${localStorage.getItem('email')}`, {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();
      console.log(payload)

      if (!response.ok) {
        const errorMessage = typeof payload?.detail === 'string' ? payload.detail : 'Failed to analyze resume.';
        throw new Error(errorMessage);
      }

      setAnalysisData(normalizeAnalysis(payload.analysis as Record<string, unknown>));
      setCurrentPage('results');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while connecting to backend.';
      alert(message);
    }
  };

  const handleReAnalyze = () => {
    setCurrentPage('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Main Content */}
      {currentPage === 'upload' ? (
        <ResumeUploadPage
          resumeFile={resumeFile}
          jobDescription={jobDescription}
          selectedRole={selectedRole}
          onFileChange={setResumeFile}
          onJobDescriptionChange={setJobDescription}
          onRoleChange={setSelectedRole}
          onAnalyze={handleAnalyze}
        />
      ) : (
        <AnalysisResults
          resumeFileName={resumeFile?.name || 'Resume.pdf'}
          selectedRole={selectedRole}
          analysisData={analysisData}
          onReAnalyze={handleReAnalyze}
        />
      )}
    </div>
  );
}
