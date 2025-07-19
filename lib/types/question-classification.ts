import { QuestionType } from '@prisma/client';

// Bridge between our classifier types and database types
export type ClassifierQuestionType = 'objective' | 'structured' | 'opinion';

// Mapping from classifier types to database types
export const classifierToDbType: Record<ClassifierQuestionType, QuestionType> = {
  objective: QuestionType.OBJECTIVE,
  structured: QuestionType.STRUCTURED,
  opinion: QuestionType.OPINION,
};

// Mapping from database types to classifier types
export const dbTypeToClassifier: Record<QuestionType, ClassifierQuestionType> = {
  [QuestionType.OBJECTIVE]: 'objective',
  [QuestionType.STRUCTURED]: 'structured',
  [QuestionType.OPINION]: 'opinion',
};

// Type for question classification result
export interface QuestionClassificationResult {
  type: QuestionType;
  confidence: number;
  reasoning: string[];
}

// Type for question with classification data
export interface QuestionWithClassification {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  classificationConfidence: number | null;
  classificationReasoning: string[];
  // ... other question fields
}

// Helper function to convert classifier result to database format
export function convertClassifierResult(
  classifierType: ClassifierQuestionType,
  confidence: number,
  reasoning: string[]
): QuestionClassificationResult {
  return {
    type: classifierToDbType[classifierType],
    confidence,
    reasoning,
  };
} 
