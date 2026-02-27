import { useState } from 'react';
import { Navigation } from './components/navigation';
import { UploadPage } from './components/upload-page';
import { ResultsPage, Candidate } from './components/results-page';
import { EvaluationPanel } from './components/evaluation-panel';
import { screenResumes } from './api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'results' | 'evaluation'>('upload');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleStartScreening = async (payload: {
    files: File[];
    jobRole?: string;
    jobDescription?: string;
  }) => {
    const analyzedCandidates = await screenResumes(payload);
    setCandidates(analyzedCandidates);
    setSelectedCandidateId(null);
    setCurrentPage('results');
  };

  const handleViewAnalysis = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setCurrentPage('evaluation');
  };

  const handleBackToResults = () => {
    setCurrentPage('results');
    setSelectedCandidateId(null);
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId && c.hidden === false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {currentPage === 'upload' && (
        <UploadPage onStartScreening={handleStartScreening} />
      )}

      {currentPage === 'results' && (
        <ResultsPage
          candidates={candidates}
          onViewAnalysis={handleViewAnalysis}
        />
      )}

      {currentPage === 'evaluation' && selectedCandidate && (
        <EvaluationPanel
          candidate={selectedCandidate}
          onBack={handleBackToResults}
        />
      )}
    </div>
  );
}
