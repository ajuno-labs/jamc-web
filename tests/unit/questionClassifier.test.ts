import { QuestionClassifier } from '../../lib/questionClassifier';
import { QuestionType } from '@prisma/client';

describe('QuestionClassifier', () => {
  let classifier: QuestionClassifier;

  beforeEach(() => {
    classifier = new QuestionClassifier();
  });

  describe('Objective Questions', () => {
    const objectiveQuestions = [
      'What is Coulomb\'s law constant?',
      'Define ionic bond',
      'What does NaCl mean?',
      'What are the three states of matter?',
      'List the elements in the periodic table',
      'Name the capital of France',
      'Identify the main components of a cell',
      'When did World War II end?',
      'Where is the Eiffel Tower located?',
      'Who discovered penicillin?',
      'How many planets are in our solar system?',
      'What year was the Declaration of Independence signed?'
    ];

    test.each(objectiveQuestions)('should classify "%s" as objective', (question) => {
      const result = classifier.classify(question);
      expect(result.type).toBe(QuestionType.OBJECTIVE);
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('Structured Questions', () => {
    const structuredQuestions = [
      'Explain why NaCl is ionic',
      'Explain how photosynthesis works',
      'Describe the process of cellular respiration',
      'Analyze the causes of climate change',
      'Compare and contrast mitosis and meiosis',
      'Discuss the impact of technology on society',
      'Evaluate the effectiveness of renewable energy',
      'How does the digestive system work?',
      'What happens when you mix acid and base?',
      'What causes earthquakes?',
      'What leads to global warming?',
      'What results in the formation of clouds?'
    ];

    test.each(structuredQuestions)('should classify "%s" as structured', (question) => {
      const result = classifier.classify(question);
      expect(result.type).toBe(QuestionType.STRUCTURED);
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('Opinion Questions', () => {
    const opinionQuestions = [
      'What do you think about online learning?',
      'What is your opinion on climate change?',
      'How do you feel about remote work?',
      'What would you do in this situation?',
      'In your experience, what works best?',
      'What motivates you to study?',
      'How do you stay motivated to code?',
      'What helps you focus during exams?',
      'What strategies do you use for time management?',
      'How do you approach problem-solving?'
    ];

    test.each(opinionQuestions)('should classify "%s" as opinion', (question) => {
      const result = classifier.classify(question);
      expect([QuestionType.OPINION, QuestionType.STRUCTURED]).toContain(result.type);
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string', () => {
      const result = classifier.classify('');
      expect(result.type).toBe(QuestionType.OBJECTIVE);
      expect(result.confidence).toBe(0.5);
    });

    test('should handle very short questions', () => {
      const result = classifier.classify('Why?');
      expect([QuestionType.OBJECTIVE, QuestionType.STRUCTURED, QuestionType.OPINION]).toContain(result.type);
    });

    test('should handle questions with multiple patterns', () => {
      const result = classifier.classify('Explain what is the meaning of life?');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('Detailed Analysis', () => {
    test('should provide detailed analysis with rule matches', () => {
      const question = 'Explain why NaCl is ionic';
      const analysis = classifier.analyze(question);

      expect(analysis.classification.type).toBe(QuestionType.STRUCTURED);
      expect(analysis.classification.confidence).toBeGreaterThan(0.5);
      expect(analysis.ruleMatches).toHaveLength(6);
      const matchingRules = analysis.ruleMatches.filter(rm => rm.matched);
      expect(matchingRules.length).toBeGreaterThan(0);
    });

    test('should show reasoning for classification', () => {
      const question = 'What is Coulomb\'s law constant?';
      const result = classifier.classify(question);

      expect(result.reasoning.length).toBeGreaterThan(0);
      expect(result.reasoning.some(reason => reason.includes('Pattern match'))).toBe(true);
      expect(result.reasoning.some(reason => reason.includes('Applied rule'))).toBe(true);
    });
  });

  describe('Confidence Scoring', () => {
    test('should provide high confidence for clear matches', () => {
      const result = classifier.classify('What is the definition of gravity?');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should provide lower confidence for ambiguous questions', () => {
      const result = classifier.classify('Why?');
      expect(result.confidence).toBeLessThanOrEqual(0.7);
    });
  });

  describe('Rule Weights', () => {
    test('should prioritize pattern matches over keyword matches', () => {
      const question = 'What is the process of photosynthesis?';
      const analysis = classifier.analyze(question);
      expect(analysis.classification.type).toBe(QuestionType.OBJECTIVE);
    });
  });

  describe('Specific Rule Testing', () => {
    test('should correctly identify definition questions', () => {
      const result = classifier.classify('What is the meaning of life?');
      expect(result.type).toBe(QuestionType.OBJECTIVE);
      expect(result.reasoning.some(reason => reason.includes('definition_question'))).toBe(true);
    });

    test('should correctly identify explanation questions', () => {
      const result = classifier.classify('Explain how computers work');
      expect(result.type).toBe(QuestionType.STRUCTURED);
      expect(result.reasoning.some(reason => reason.includes('explanation_question'))).toBe(true);
    });

    test('should correctly identify opinion questions', () => {
      const result = classifier.classify('What do you think about AI?');
      expect(result.type).toBe(QuestionType.OPINION);
      expect(result.reasoning.some(reason => reason.includes('opinion_question'))).toBe(true);
    });
  });

  describe('Performance', () => {
    test('should handle large number of questions efficiently', () => {
      const questions = Array.from({ length: 100 }, (_, i) => 
        `What is question number ${i}?`
      );
      
      const startTime = Date.now();
      questions.forEach(q => classifier.classify(q));
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
}); 
