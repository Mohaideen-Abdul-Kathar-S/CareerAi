import { useState } from 'react';
import { Briefcase, FileText, Building2, Sparkles, User } from 'lucide-react';
import { PreparationModeCard } from './preparation-mode-card';
import { SkillTag } from './skill-tag';
import { RoadmapPhase } from './roadmap-phase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type PreparationMode = 'job-role' | 'job-description' | 'company-role' | null;

interface GeneratedData {
  skills: string[];
  roadmap: {
    phase: string;
    title: string;
    items: string[];
  }[];
  prediction: string;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const jobRoles = [
  'Frontend Developer',
  'AI Engineer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'UI/UX Designer',
];

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/,|\n|\d+\.|•|-/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const buildSinglePhaseRoadmap = (items: string[], title: string) => [
  {
    phase: 'Phase 1',
    title,
    items: items.length > 0 ? items : ['No roadmap data returned'],
  },
];

const parseBackendError = async (response: Response) => {
  try {
    const data = await response.json();
    if (data?.detail) return String(data.detail);
    if (data?.error) return String(data.error);
  } catch {
    return `Request failed with status ${response.status}`;
  }

  return `Request failed with status ${response.status}`;
};

export function SmartPreparationHub() {
  const [selectedMode, setSelectedMode] = useState<PreparationMode>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setGeneratedData(null);

    try {
      let data: GeneratedData;

      if (selectedMode === 'job-role') {
        const email = localStorage.getItem('email') || 'guest@example.com';
        const response = await fetch(`${API_BASE_URL}/phase1/role-roadmap?email=${encodeURIComponent(email)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: selectedRole }),
        });

        if (!response.ok) {
          throw new Error(await parseBackendError(response));
        }

        const result = await response.json();
        data = {
          skills: normalizeList(result.required_skills),
          roadmap: buildSinglePhaseRoadmap(normalizeList(result.roadmap), `Roadmap for ${selectedRole}`),
          prediction: String(result.future_prediction ?? 'No future prediction available.'),
        };
      } else if (selectedMode === 'job-description') {
        const response = await fetch(`${API_BASE_URL}/phase2/analyze-jd?email=${encodeURIComponent(localStorage.getItem('email') || 'guest@example.com')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_description: jobDescription }),
        });

        if (!response.ok) {
          throw new Error(await parseBackendError(response));
        }

        const result = await response.json();
        data = {
          skills: [...normalizeList(result.technical_skills), ...normalizeList(result.soft_skills)],
          roadmap: buildSinglePhaseRoadmap(normalizeList(result.preparation_roadmap), 'Job Description Preparation Roadmap'),
          prediction: `Interview focus: ${normalizeList(result.interview_focus_areas).join(', ') || 'Not provided'}. Suggested projects: ${normalizeList(result.suggested_projects).join(', ') || 'Not provided'}.`,
        };
      } else if (selectedMode === 'company-role') {
        const response = await fetch(`${API_BASE_URL}/phase3/company-role-analysis?email=${encodeURIComponent(localStorage.getItem('email') || 'guest@example.com')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company_name: companyName, job_role: roleName }),
        });

        if (!response.ok) {
          throw new Error(await parseBackendError(response));
        }

        const result = await response.json();
        data = {
          skills: normalizeList(result.preferred_skills_by_company),
          roadmap: buildSinglePhaseRoadmap(normalizeList(result.preparation_roadmap), `${companyName} Preparation Roadmap`),
          prediction: String(result.future_prediction_5_years ?? 'No future prediction available.'),
        };
      } else {
        throw new Error('Please select a preparation mode.');
      }

      setGeneratedData(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to fetch data from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerate = () => {
    if (selectedMode === 'job-role') return selectedRole !== '';
    if (selectedMode === 'job-description') return jobDescription.trim() !== '';
    if (selectedMode === 'company-role') return companyName.trim() !== '' && roleName.trim() !== '';
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Main Content */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎓 Smart Preparation Hub
          </h1>
          <p className="text-lg text-gray-600">
            AI-Powered Career Preparation Engine
          </p>
        </div>

        {/* Section 1 - Preparation Mode Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Choose Your Preparation Mode
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <PreparationModeCard
              icon={Briefcase}
              title="Job Role"
              description="Generate roadmap based on selected job role"
              isSelected={selectedMode === 'job-role'}
              onClick={() => {
                setSelectedMode('job-role');
                setGeneratedData(null);
              }}
            />

            <PreparationModeCard
              icon={FileText}
              title="Job Description (JD)"
              description="Paste job description to generate custom plan"
              isSelected={selectedMode === 'job-description'}
              onClick={() => {
                setSelectedMode('job-description');
                setGeneratedData(null);
              }}
            />

            <PreparationModeCard
              icon={Building2}
              title="Company + Role"
              description="Get company-specific preparation roadmap"
              isSelected={selectedMode === 'company-role'}
              onClick={() => {
                setSelectedMode('company-role');
                setGeneratedData(null);
              }}
            />
          </div>
        </div>

        {/* Section 2 - Dynamic Input Area */}
        {selectedMode && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {selectedMode === 'job-role' && 'Select Job Role'}
              {selectedMode === 'job-description' && 'Paste Job Description'}
              {selectedMode === 'company-role' && 'Enter Company & Role Details'}
            </h2>

            {selectedMode === 'job-role' && (
              <div className="space-y-4">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full h-12 text-base border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select Job Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate() || isLoading}
                  className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  {isLoading ? 'Generating...' : 'Generate Roadmap'}
                </Button>
              </div>
            )}

            {selectedMode === 'job-description' && (
              <div className="space-y-4">
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="min-h-[200px] text-base border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                />

                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate() || isLoading}
                  className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze JD & Generate Plan'}
                </Button>
              </div>
            )}

            {selectedMode === 'company-role' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Zoho"
                    className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role
                  </label>
                  <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g., Frontend Developer"
                    className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate() || isLoading}
                  className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  {isLoading ? 'Generating...' : 'Generate Company-Specific Plan'}
                </Button>
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8">
            {errorMessage}
          </div>
        )}

        {/* Section 3 - Generated Output Area */}
        {generatedData && (
          <div className="space-y-8 animate-fade-in">
            {/* Required Skills Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📋 Required Skills for This Path
              </h2>
              <div className="flex flex-wrap gap-3">
                {generatedData.skills.map((skill, index) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </div>
            </div>

            {/* AI Learning Roadmap Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🛣 Personalized Learning Roadmap
                </h2>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold">
                  AI Generated
                </div>
              </div>

              <div className="space-y-4">
                {generatedData.roadmap.map((phase, index) => (
                  <RoadmapPhase
                    key={index}
                    phase={phase.phase}
                    title={phase.title}
                    items={phase.items}
                  />
                ))}
              </div>
            </div>

            {/* Future Prediction Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="size-6" />
                <h2 className="text-2xl font-bold">
                  📈 AI Future Demand Insight
                </h2>
              </div>
              <p className="text-lg leading-relaxed">
                {generatedData.prediction}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}