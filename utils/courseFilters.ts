/**
 * Course Filter Utilities
 * Pure functions for filtering and organizing courses
 */

import { Course } from '../types';

/**
 * Filter courses by grade level
 */
export function filterCoursesByGrade(courses: Course[], grade: string): Course[] {
  return courses.filter((course) => {
    const grades = course.grade?.split(',').map(g => g.trim()) || [];
    return grades.includes(grade);
  });
}

/**
 * Filter courses by difficulty level
 */
export function filterCoursesByDifficulty(
  courses: Course[],
  difficulty: 'easy' | 'intermediate' | 'recommended'
): Course[] {
  return courses.filter((course) => course.difficulty === difficulty);
}

/**
 * Filter courses by category
 */
export function filterCoursesByCategory(
  courses: Course[],
  category: string
): Course[] {
  return courses.filter((course) => course.category === category);
}

/**
 * Generic filter function for multiple criteria
 */
export function filterCourses(
  courses: Course[],
  filters: {
    grade?: string;
    difficulty?: string;
    category?: string;
  }
): Course[] {
  return courses.filter((course) => {
    if (filters.grade) {
      const grades = course.grade?.split(',').map(g => g.trim()) || [];
      if (!grades.includes(filters.grade)) return false;
    }
    if (filters.difficulty && course.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.category && course.category !== filters.category) {
      return false;
    }
    return true;
  });
}

/**
 * Extract course names from array of courses
 */
export function extractCourseNames(courses: Course[]): string[] {
  return courses.map((course) => course.courseName);
}

/**
 * Group courses by difficulty level
 */
export function groupCoursesByDifficulty(courses: Course[]): {
  easy: Course[];
  intermediate: Course[];
  recommended: Course[];
} {
  return {
    easy: courses.filter((c) => c.difficulty === 'easy'),
    intermediate: courses.filter((c) => c.difficulty === 'intermediate'),
    recommended: courses.filter((c) => c.difficulty === 'recommended'),
  };
}

/**
 * Group courses by category
 */
export function groupCoursesByCategory(courses: Course[]): Record<string, Course[]> {
  const grouped: Record<string, Course[]> = {};

  for (const course of courses) {
    const category = course.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(course);
  }

  return grouped;
}

/**
 * Get recommended courses based on rigor level
 * Maps user's rigor preference to course difficulty
 */
export function mapRigorToDifficulty(rigor: string): 'easy' | 'intermediate' | 'recommended' {
  switch (rigor) {
    case 'easy':
      return 'easy';
    case 'medium':
      return 'intermediate';
    case 'hard':
      return 'recommended';
    default:
      return 'easy';
  }
}
