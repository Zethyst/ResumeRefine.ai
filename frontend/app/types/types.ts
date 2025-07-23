export interface FeedbackSection {
  title: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface AnalysisResult {
  overallScore: number;
  sections: FeedbackSection[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}