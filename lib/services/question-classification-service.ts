import { QuestionClassifier } from '../questionClassifier';
import { convertClassifierResult, type ClassifierQuestionType } from '../types/question-classification';
import { QuestionType } from '@prisma/client';

/**
 * Service for integrating question classification with the database
 */
export class QuestionClassificationService {
  private classifier: QuestionClassifier;

  constructor() {
    this.classifier = new QuestionClassifier();
  }

  /**
   * Classify a question and return database-compatible result
   */
  async classifyQuestion(title: string, content: string) {
    const fullQuestion = `${title} ${content}`.trim();
    const result = this.classifier.classify(fullQuestion);
    
    return convertClassifierResult(
      result.type as ClassifierQuestionType,
      result.confidence,
      result.reasoning
    );
  }

  /**
   * Get detailed analysis of a question
   */
  async analyzeQuestion(title: string, content: string) {
    const fullQuestion = `${title} ${content}`.trim();
    return this.classifier.analyze(fullQuestion);
  }

  /**
   * Get human-readable description of question types
   */
  getQuestionTypeDescription(type: QuestionType): {
    title: string;
    description: string;
    gradingMethod: string;
  } {
    switch (type) {
      case QuestionType.OBJECTIVE:
        return {
          title: 'Objective Question',
          description: 'Fact-based questions with specific, correct answers',
          gradingMethod: 'Exact match or multiple choice scoring'
        };
      case QuestionType.STRUCTURED:
        return {
          title: 'Structured Question',
          description: 'Explanations and analysis requiring detailed responses',
          gradingMethod: 'Rubric-based scoring with key points'
        };
      case QuestionType.OPINION:
        return {
          title: 'Opinion Question',
          description: 'Personal reflection and discussion questions',
          gradingMethod: 'Engagement scoring (no right/wrong answers)'
        };
      default:
        return {
          title: 'Unknown Type',
          description: 'Question type not recognized',
          gradingMethod: 'Manual review required'
        };
    }
  }

  /**
   * Get question type icon or badge info
   */
  getQuestionTypeBadge(type: QuestionType): {
    label: string;
    color: string;
    icon?: string;
  } {
    switch (type) {
      case QuestionType.OBJECTIVE:
        return {
          label: 'Objective',
          color: 'bg-blue-100 text-blue-800',
          icon: '🎯'
        };
      case QuestionType.STRUCTURED:
        return {
          label: 'Structured',
          color: 'bg-green-100 text-green-800',
          icon: '📝'
        };
      case QuestionType.OPINION:
        return {
          label: 'Opinion',
          color: 'bg-purple-100 text-purple-800',
          icon: '💭'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: '❓'
        };
    }
  }

  /**
   * Validate if a question type is appropriate for the content
   */
  async validateQuestionType(type: QuestionType, title: string, content: string): Promise<{
    isValid: boolean;
    suggestedType?: QuestionType;
    confidence: number;
    reasoning: string[];
  }> {
    const classification = await this.classifyQuestion(title, content);
    const isValid = classification.type === type;
    
    return {
      isValid,
      suggestedType: isValid ? undefined : classification.type,
      confidence: classification.confidence,
      reasoning: classification.reasoning
    };
  }
}

export const questionClassificationService = new QuestionClassificationService();
