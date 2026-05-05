export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Data has been moved to locale files (zh.json, en.json, ja.json) 
// for internationalization support.
export const quizData: QuizQuestion[] = [];
