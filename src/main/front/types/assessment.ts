export interface AssessmentOption {
  score: number;
  label: string;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  options: AssessmentOption[];
}

export interface AssessmentTemplate {
  id: number;
  name: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentAnswer {
  questionId: number;
  score: number;
}

export interface AssessmentSubmitRequest {
  userId: number;
  answers: AssessmentAnswer[];
} 