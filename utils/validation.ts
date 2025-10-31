/**
 * Validation Utilities
 * Functions for validating survey data and user input
 */

import { SurveyResponse } from '../types';

/**
 * Validate survey response data
 */
export function validateSurveyData(data: Partial<SurveyResponse>): boolean {
  return !!(
    data.gradeQuestion &&
    data.classLevelQuestion &&
    data.creditQuestion &&
    data.stemInterestQuestion
  );
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate grade level
 */
export function validateGrade(grade: string): boolean {
  return ['9', '10', '11', '12'].includes(grade);
}

/**
 * Validate rigor level
 */
export function validateRigor(rigor: string): boolean {
  return ['easy', 'medium', 'hard'].includes(rigor);
}

/**
 * Validate STEM interest
 */
export function validateSTEMInterest(interest: string): boolean {
  return ['science', 'technology', 'engineer', 'math'].includes(interest);
}

/**
 * Validate credit completion status
 */
export function validateCreditStatus(status: string): boolean {
  return ['both', 'pe', 'health', 'none'].includes(status);
}

/**
 * Check if user is a freshman (9th grader)
 */
export function isFreshman(grade: string): boolean {
  return grade === '9';
}

/**
 * Sanitize course name
 */
export function sanitizeCourseName(name: string): string {
  return name.trim();
}

/**
 * Validate survey answer array
 */
export function validateSurveyAnswers(answers: any[]): boolean {
  if (!Array.isArray(answers) || answers.length === 0) {
    return false;
  }

  return answers.every((answer) => {
    return answer.question && answer.answer !== undefined;
  });
}
