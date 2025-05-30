export interface ProfileUser {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  roles: Array<{
    name: string
    permissions: string[]
  }>
}

export interface ProfileQuestion {
  id: string
  slug: string
  title: string
  type: string
  createdAt: string
  answerCount: number
  voteCount: number
  status?: string
  course?: {
    id: string
    title: string
    slug: string
  } | null
  lesson?: {
    id: string
    title: string
    slug: string
  } | null
}

export interface ProfileAnswer {
  id: string
  content: string
  questionId: string
  questionTitle: string
  questionSlug: string
  createdAt: string
  isAccepted: boolean
}

export interface ReputationBreakdown {
  fromQuestionVotes: number
  fromAnswerVotes: number
  fromAcceptedAnswers: number
  fromQuestionsPosted: number
  fromAnswersPosted: number
}

export interface ProfileStats {
  totalQuestions: number
  totalAnswers: number
  reputation: number
  reputationBreakdown?: ReputationBreakdown
}

export interface ProfileData {
  user: ProfileUser
  questions: ProfileQuestion[]
  answers: ProfileAnswer[]
  stats: ProfileStats
} 