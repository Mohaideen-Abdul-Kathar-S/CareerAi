import { ArrowLeft, Mail, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CircularProgress } from './circular-progress';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Candidate } from './results-page';

interface EvaluationPanelProps {
  candidate: Candidate;
  onBack: () => void;
}

export function EvaluationPanel({ candidate, onBack }: EvaluationPanelProps) {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900">{candidate.name}</h1>
            <Badge className={`mt-2 px-4 py-1 rounded-full capitalize ${getStatusColor(candidate.status)}`}>
              {candidate.status}
            </Badge>
          </div>
        </div>

        {/* Section 1: Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS Compatibility Score */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all">
            <h3 className="text-gray-600 font-medium mb-4">ATS Compatibility Score</h3>
            <div className="flex justify-center mb-3">
              <CircularProgress value={candidate.atsScore} size={100} />
            </div>
            <p className="text-sm text-gray-500">
              How well the resume is formatted for ATS systems
            </p>
          </div>

          {/* Skill Match Score */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
            <h3 className="text-gray-600 font-medium mb-4">Skill Match Score</h3>
            <div className="mb-3">
              <div className="text-4xl font-bold text-[#2563EB] mb-4">{candidate.skillMatchScore}%</div>
              <Progress value={candidate.skillMatchScore} className="h-3 rounded-full" />
            </div>
            <p className="text-sm text-gray-500">
              Percentage of required skills matched
            </p>
          </div>

          {/* Resume Format Quality */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
            <h3 className="text-gray-600 font-medium mb-4">Resume Format Quality</h3>
            <div className="mb-3">
              <div className="text-4xl font-bold text-[#2563EB] mb-4">{candidate.formatQualityScore}%</div>
              <Progress value={candidate.formatQualityScore} className="h-3 rounded-full" />
            </div>
            <p className="text-sm text-gray-500">
              Overall resume structure and readability
            </p>
          </div>
        </div>

        {/* Section 2: Skills Breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skills Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills You Have */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Skills You Have</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.matchedSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 rounded-full bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills Missed */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Skills Missed</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.missingSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="px-4 py-2 rounded-full bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Improvement Suggestions */}
        <div className="bg-white rounded-2xl shadow-md p-8 border-l-4 border-[#7C3AED]">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Improvement Suggestions</h2>
          
          <ul className="space-y-3">
            {candidate.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{suggestion}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Rejection Email Section */}
        {candidate.status === 'rejected' && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rejection Email Preview</h2>
            
            {/* Email Template Preview */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed">
                Dear <strong>{candidate.name}</strong>,
              </p>
              <br />
              <p className="text-gray-700 leading-relaxed">
                Thank you for taking the time to apply for the position at our company. 
                We appreciate your interest and the effort you put into your application.
              </p>
              <br />
              <p className="text-gray-700 leading-relaxed">
                After careful evaluation of your profile against our requirements, we have decided 
                to move forward with other candidates whose skills and experience more closely align 
                with what we're looking for at this time.
              </p>
              <br />
              <p className="text-gray-700 leading-relaxed">
                We encourage you to apply for future opportunities that match your qualifications. 
                We wish you the very best in your job search and career endeavors.
              </p>
              <br />
              <p className="text-gray-700 leading-relaxed">
                Best regards,<br />
                <strong>HR Team</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 text-white rounded-xl">
                <Mail className="w-4 h-4 mr-2" />
                Send Rejection Email
              </Button>
              <Button variant="outline" className="rounded-xl border-[#2563EB] text-[#2563EB] hover:bg-blue-50">
                <Edit className="w-4 h-4 mr-2" />
                Customize Message
              </Button>
            </div>

            {/* Toggle Option */}
            <div className="flex items-center gap-3">
              <Checkbox id="auto-email" />
              <label
                htmlFor="auto-email"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Enable Automatic Email for Rejected Candidates
              </label>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
