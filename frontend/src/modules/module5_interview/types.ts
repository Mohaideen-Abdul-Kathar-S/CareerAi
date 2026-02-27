
export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  INTERVIEWING = 'INTERVIEWING',
  EVALUATING = 'EVALUATING',
  REPORT = 'REPORT'
}

export interface Question {
  id: number;
  text: string;
}

export interface InterviewData {
  role: string;
  duration: number;
  resumeFileName: string;
  resumeFile: File | null;
  sessionId: string;
}

export interface SkillScore {
  subject: string;
  A: number;
  fullMark: number;
}

export interface EvaluationReport {
  summary: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  culturalFitScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementPlan: string[];
}
