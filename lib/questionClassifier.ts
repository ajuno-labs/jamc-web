export type QuestionType = 'objective' | 'structured' | 'opinion';

export interface QuestionClassification {
  type: QuestionType;
  confidence: number;
  reasoning: string[];
}

export interface ClassificationRule {
  name: string;
  type: QuestionType;
  patterns: RegExp[];
  keywords: string[];
  weight: number;
}

/**
 * Simple rule-based question classifier
 * Classifies questions into three types: objective, structured, and opinion
 */
export class QuestionClassifier {
  private rules: ClassificationRule[];

  constructor() {
    this.rules = this.initializeRules();
  }

  /**
   * Initialize classification rules based on the provided specification
   */
  private initializeRules(): ClassificationRule[] {
    return [
      // Objective/Closed questions
      {
        name: 'definition_question',
        type: 'objective',
        patterns: [
          /what is\s+\w+/i,
          /define\s+\w+/i,
          /what does\s+\w+\s+mean/i,
          /what are\s+\w+/i,
          /list\s+\w+/i,
          /name\s+\w+/i,
          /identify\s+\w+/i,
        ],
        keywords: ['what is', 'define', 'definition', 'list', 'name', 'identify', 'constant', 'value', 'formula'],
        weight: 0.8
      },
      {
        name: 'factual_question',
        type: 'objective',
        patterns: [
          /when\s+did\s+\w+/i,
          /where\s+is\s+\w+/i,
          /who\s+\w+/i,
          /how many\s+\w+/i,
          /what year\s+\w+/i,
          /what date\s+\w+/i,
        ],
        keywords: ['when', 'where', 'who', 'how many', 'year', 'date', 'number', 'amount'],
        weight: 0.7
      },

      // Structured/Open-ended questions
      {
        name: 'explanation_question',
        type: 'structured',
        patterns: [
          /explain\s+why\s+\w+/i,
          /explain\s+how\s+\w+/i,
          /describe\s+\w+/i,
          /analyze\s+\w+/i,
          /compare\s+\w+/i,
          /contrast\s+\w+/i,
          /discuss\s+\w+/i,
          /evaluate\s+\w+/i,
        ],
        keywords: ['explain', 'describe', 'analyze', 'compare', 'contrast', 'discuss', 'evaluate', 'why', 'how'],
        weight: 0.8
      },
      {
        name: 'process_question',
        type: 'structured',
        patterns: [
          /how does\s+\w+/i,
          /what happens when\s+\w+/i,
          /what causes\s+\w+/i,
          /what leads to\s+\w+/i,
          /what results in\s+\w+/i,
        ],
        keywords: ['how does', 'process', 'happens', 'causes', 'leads to', 'results in', 'mechanism'],
        weight: 0.7
      },

      // Opinion/Exploratory questions
      {
        name: 'opinion_question',
        type: 'opinion',
        patterns: [
          /what do you think\s+\w+/i,
          /what is your opinion\s+\w+/i,
          /how do you feel\s+\w+/i,
          /what would you do\s+\w+/i,
          /in your experience\s+\w+/i,
          /what motivates you\s+\w+/i,
        ],
        keywords: ['think', 'opinion', 'feel', 'experience', 'motivate', 'prefer', 'believe', 'personal', 'your opinion'],
        weight: 0.9
      },
      {
        name: 'reflection_question',
        type: 'opinion',
        patterns: [
          /how do you stay\s+\w+/i,
          /what helps you\s+\w+/i,
          /what strategies do you use\s+\w+/i,
          /how do you approach\s+\w+/i,
        ],
        keywords: ['stay', 'helps', 'strategies', 'approach', 'tips', 'advice', 'personal'],
        weight: 0.7
      }
    ];
  }

  /**
   * Classify a question based on the defined rules
   */
  classify(question: string): QuestionClassification {
    const scores = {
      objective: 0,
      structured: 0,
      opinion: 0
    };

    const reasoning: string[] = [];
    const normalizedQuestion = question.toLowerCase().trim();

    // Apply each rule
    for (const rule of this.rules) {
      let ruleScore = 0;
      let ruleMatched = false;

      // Check patterns
      for (const pattern of rule.patterns) {
        if (pattern.test(normalizedQuestion)) {
          ruleScore += rule.weight;
          ruleMatched = true;
          reasoning.push(`Pattern match: "${pattern.source}"`);
          break;
        }
      }

      // Check keywords
      for (const keyword of rule.keywords) {
        if (normalizedQuestion.includes(keyword.toLowerCase())) {
          ruleScore += rule.weight * 0.5; // Keywords have lower weight than patterns
          ruleMatched = true;
          reasoning.push(`Keyword match: "${keyword}"`);
        }
      }

      if (ruleMatched) {
        scores[rule.type] += ruleScore;
        reasoning.push(`Applied rule: ${rule.name} (${rule.type})`);
      }
    }

    // Determine the winning type
    const maxScore = Math.max(scores.objective, scores.structured, scores.opinion);
    const totalScore = scores.objective + scores.structured + scores.opinion;
    
    let type: QuestionType = 'objective';
    if (scores.structured > scores.objective && scores.structured > scores.opinion) {
      type = 'structured';
    } else if (scores.opinion > scores.objective && scores.opinion > scores.structured) {
      type = 'opinion';
    }

    // Calculate confidence (normalized score)
    const confidence = totalScore > 0 ? maxScore / totalScore : 0.5;

    return {
      type,
      confidence: Math.min(confidence, 1.0),
      reasoning: reasoning.length > 0 ? reasoning : ['No specific patterns or keywords matched']
    };
  }

  /**
   * Get detailed analysis of why a question was classified as a certain type
   */
  analyze(question: string): {
    classification: QuestionClassification;
    ruleMatches: Array<{
      rule: ClassificationRule;
      matched: boolean;
      score: number;
    }>;
  } {
    const classification = this.classify(question);
    const ruleMatches = this.rules.map(rule => {
      const normalizedQuestion = question.toLowerCase().trim();
      let score = 0;
      let matched = false;

      // Check patterns
      for (const pattern of rule.patterns) {
        if (pattern.test(normalizedQuestion)) {
          score += rule.weight;
          matched = true;
          break;
        }
      }

      // Check keywords
      for (const keyword of rule.keywords) {
        if (normalizedQuestion.includes(keyword.toLowerCase())) {
          score += rule.weight * 0.5;
          matched = true;
        }
      }

      return { rule, matched, score };
    });

    return { classification, ruleMatches };
  }
} 
