import { EvaluationReport } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;

interface StartInterviewResponse {
  session_id: string;
  question: string;
}

interface NextQuestionResponse {
  question?: string;
  message?: string;
  error?: string;
}

interface BackendFinalReport {
  overall_score?: number;
  technical_score?: number;
  communication_score?: number;
  confidence_score?: number;
  strengths?: string[];
  weaknesses?: string[];
  improvement_plan?: string[];
  final_summary_message?: string;
  raw_response?: string;
  error?: string;
}

const normalizeScore = (value: number | undefined): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  const scaled = value <= 10 ? value * 10 : value;
  return Math.max(0, Math.min(100, Math.round(scaled)));
};

const tryParseEmbeddedJson = (raw: string): BackendFinalReport | null => {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

export const startInterview = async (
  resumeFile: File,
  role: string,
  duration: number
): Promise<StartInterviewResponse> => {
  const formData = new FormData();
  formData.append('resume_file', resumeFile);
  formData.append('role', role);
  formData.append('duration', String(duration));

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/interview/start`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error(`Cannot reach backend at ${API_BASE_URL}. Start FastAPI server and retry.`);
  }

  if (!response.ok) {
    throw new Error('Failed to start interview session.');
  }

  return response.json();
};

export const submitAnswer = async (
  sessionId: string,
  answer: string
): Promise<NextQuestionResponse> => {
  const response = await fetch(`${API_BASE_URL}/interview/next`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      answer,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch the next interview question.');
  }

  return response.json();
};

export const getFinalReport = async (sessionId: string): Promise<EvaluationReport> => {
  const response = await fetch(`${API_BASE_URL}/interview/final`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate final interview report.');
  }

  let backendReport: BackendFinalReport = await response.json();

  if (backendReport.raw_response) {
    const parsed = tryParseEmbeddedJson(backendReport.raw_response);
    if (parsed) {
      backendReport = parsed;
    }
  }

  const hasAnyScore = [
    backendReport.overall_score,
    backendReport.technical_score,
    backendReport.communication_score,
    backendReport.confidence_score,
  ].some((value) => typeof value === 'number');

  if (!hasAnyScore && backendReport.error) {
    throw new Error('Failed to parse final interview report from AI response.');
  }

  const technicalScore = normalizeScore(backendReport.technical_score);
  const communicationScore = normalizeScore(backendReport.communication_score);
  const confidenceScore = normalizeScore(backendReport.confidence_score);
  const overallScore = normalizeScore(backendReport.overall_score);

  return {
    summary: backendReport.final_summary_message || 'Interview analysis completed.',
    overallScore,
    technicalScore,
    communicationScore,
    problemSolvingScore: confidenceScore,
    culturalFitScore: Math.round((communicationScore + confidenceScore) / 2),
    strengths: backendReport.strengths || [],
    weaknesses: backendReport.weaknesses || [],
    improvementPlan: backendReport.improvement_plan || [],
  };
};
