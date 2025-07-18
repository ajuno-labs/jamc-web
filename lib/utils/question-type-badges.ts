import { QuestionType } from "@prisma/client"

export interface QuestionTypeBadge {
  label: string
  variant: "default" | "secondary" | "outline" | "destructive"
  icon: string
  description: string
  color: string
}

export const getQuestionTypeBadge = (type: QuestionType): QuestionTypeBadge => {
  switch (type) {
    case QuestionType.OBJECTIVE:
      return {
        label: 'Objective',
        variant: 'secondary',
        icon: '🎯',
        description: 'Fact-based questions with specific, correct answers',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      }
    case QuestionType.STRUCTURED:
      return {
        label: 'Structured',
        variant: 'default',
        icon: '📝',
        description: 'Explanations and analysis requiring detailed responses',
        color: 'bg-green-100 text-green-800 border-green-200'
      }
    case QuestionType.OPINION:
      return {
        label: 'Opinion',
        variant: 'outline',
        icon: '💭',
        description: 'Personal reflection and discussion questions',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      }
    default:
      return {
        label: 'Unknown',
        variant: 'secondary',
        icon: '❓',
        description: 'Question type not recognized',
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      }
  }
}

export const getAllQuestionTypes = (): QuestionTypeBadge[] => {
  return [
    getQuestionTypeBadge(QuestionType.OBJECTIVE),
    getQuestionTypeBadge(QuestionType.STRUCTURED),
    getQuestionTypeBadge(QuestionType.OPINION),
  ]
} 
