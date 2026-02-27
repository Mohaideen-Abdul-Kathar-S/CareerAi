import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CircularProgress } from './circular-progress';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  status: 'shortlisted' | 'review' | 'rejected';
  atsScore: number;
  skillMatchScore: number;
  formatQualityScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

interface ResultsPageProps {
  candidates: Candidate[];
  onViewAnalysis: (candidateId: string) => void;
}

export function ResultsPage({ candidates, onViewAnalysis }: ResultsPageProps) {
  const topCandidates = candidates.filter(c => c.status === 'shortlisted');
  const rejectedCandidates = candidates.filter(c => c.status === 'rejected');
  const reviewCandidates = candidates.filter(c => c.status === 'review');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'review':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {candidates.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No results yet</h2>
            <p className="text-gray-600">Upload resumes and start AI screening to see candidates here.</p>
          </div>
        )}
        
        {/* Section 1: Top Candidates */}
        {topCandidates.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Top Matching Candidates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-6">
                  {/* Header with Overall Score */}
                  <div className="flex flex-col items-center text-center border-b border-gray-200 pb-6">
                    <div className="mb-4">
                      <CircularProgress 
                        value={candidate.matchScore} 
                        color={getScoreColor(candidate.matchScore)}
                        size={100}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {candidate.name}
                    </h3>
                    <Badge 
                      className={`px-4 py-1 rounded-full capitalize ${getStatusColor(candidate.status)}`}
                    >
                      {candidate.status}
                    </Badge>
                  </div>

                  {/* Detailed Scores */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">ATS Score</span>
                        <span className="text-sm font-bold text-[#2563EB]">{candidate.atsScore}%</span>
                      </div>
                      <Progress value={candidate.atsScore} className="h-2 rounded-full" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Skill Match Score</span>
                        <span className="text-sm font-bold text-[#2563EB]">{candidate.skillMatchScore}%</span>
                      </div>
                      <Progress value={candidate.skillMatchScore} className="h-2 rounded-full" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Format Score</span>
                        <span className="text-sm font-bold text-[#2563EB]">{candidate.formatQualityScore}%</span>
                      </div>
                      <Progress value={candidate.formatQualityScore} className="h-2 rounded-full" />
                    </div>
                  </div>

                  {/* Skills You Have */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Skills You Have</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matchedSkills.slice(0, 6).map((skill, index) => (
                        <Badge
                          key={index}
                          className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.matchedSkills.length > 6 && (
                        <Badge className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          +{candidate.matchedSkills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Skills Missed */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Skills Missed</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.missingSkills.slice(0, 4).map((skill, index) => (
                        <Badge
                          key={index}
                          className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 border border-red-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.missingSkills.length > 4 && (
                        <Badge className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          +{candidate.missingSkills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Improvement Suggestions */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Improvement Suggestions</h4>
                    <ul className="space-y-2">
                      {candidate.suggestions.slice(0, 2).map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0"></div>
                          <p className="text-xs text-gray-700 leading-relaxed">{suggestion}</p>
                        </li>
                      ))}
                      {candidate.suggestions.length > 2 && (
                        <li className="text-xs text-gray-500 italic">
                          +{candidate.suggestions.length - 2} more suggestions
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* View Full Analysis Button */}
                  <Button
                    onClick={() => onViewAnalysis(candidate.id)}
                    className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 text-white rounded-xl"
                  >
                    View Full Analysis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Section 2: Candidates For Review */}
        {reviewCandidates.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Candidates For Review</h2>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Match %</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900">
                        {candidate.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-lg font-semibold" style={{ color: getScoreColor(candidate.matchScore) }}>
                          {candidate.matchScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`px-3 py-1 rounded-full capitalize ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => onViewAnalysis(candidate.id)}
                          variant="outline"
                          className="rounded-xl border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                        >
                          View Analysis
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Section 3: Rejected Candidates */}
        {rejectedCandidates.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rejected Candidates</h2>
            
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Match %</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900">
                        {candidate.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-lg font-semibold" style={{ color: getScoreColor(candidate.matchScore) }}>
                          {candidate.matchScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`px-3 py-1 rounded-full capitalize ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => onViewAnalysis(candidate.id)}
                          variant="outline"
                          className="rounded-xl border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                        >
                          View Analysis
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}