export interface AssessmentOption {
  value: number;
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
  value: number;
}

export interface AssessmentSubmitRequest {
  userId: number;
  answers: AssessmentAnswer[];
} 