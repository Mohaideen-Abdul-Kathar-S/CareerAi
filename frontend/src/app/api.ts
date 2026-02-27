import { Candidate } from './components/results-page';

interface AnalyzeResumeApiResponse {
  resume_name: string;
  analysis: {
    ats_score?: number | string;
    skill_match_score?: number | string;
    format_score?: number | string;
    skills_you_have?: string[];
    skills_missing?: string[];
    improvement_suggestions?: string[];
  };
}

interface ScreenResumesParams {
  files: File[];
  jobRole?: string;
  jobDescription?: string;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function normalizeScore(value: number | string | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace('%', '').trim());
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100, Math.round(parsed)));
    }
  }

  return 0;
}

function deriveStatus(matchScore: number): Candidate['status'] {
  if (matchScore >= 75) {
    return 'shortlisted';
  }

  if (matchScore >= 55) {
    return 'review';
  }

  return 'rejected';
}

function mapApiCandidate(item: AnalyzeResumeApiResponse, index: number): Candidate {
  const atsScore = normalizeScore(item.analysis?.ats_score);
  const skillMatchScore = normalizeScore(item.analysis?.skill_match_score);
  const formatQualityScore = normalizeScore(item.analysis?.format_score);
  const matchScore = Math.round((atsScore + skillMatchScore + formatQualityScore) / 3);

  return {
    id: `${item.resume_name}-${index}`,
    name: item.resume_name,
    matchScore,
    status: deriveStatus(matchScore),
    atsScore,
    skillMatchScore,
    formatQualityScore,
    matchedSkills: item.analysis?.skills_you_have ?? [],
    missingSkills: item.analysis?.skills_missing ?? [],
    suggestions: item.analysis?.improvement_suggestions ?? [],
  };
}

export async function screenResumes({ files, jobRole, jobDescription }: ScreenResumesParams): Promise<Candidate[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('resumes', file);
  });

  if (jobRole?.trim()) {
    formData.append('job_role', jobRole.trim());
  }

  if (jobDescription?.trim()) {
    formData.append('job_description', jobDescription.trim());
  }

  const response = await fetch(`${API_BASE_URL}/analyze-resumes`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = 'Failed to analyze resumes';
    try {
      const error = await response.json();
      message = error?.detail ?? message;
    } catch {
      message = `${message} (${response.status})`;
    }
    throw new Error(message);
  }

  const data = (await response.json()) as AnalyzeResumeApiResponse[];
  return data.map(mapApiCandidate);
}
export async function registerUser(email: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/register-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to register user' }));
    throw new Error(error.detail || 'Failed to register user');
  }

  return response.json();
}
